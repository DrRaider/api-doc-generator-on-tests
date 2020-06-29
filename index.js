/*!
 * express2md
 * Copyright(c) 2017 ivanoff .$ curl -A cv ivanoff.org.ua
 * MIT Licensed
 */
'use strict';
var fs = require('fs');
var path = require('path');
var nunjucks = require('nunjucks');
const JSEncrypt = require('node-jsencrypt');

function DataDecryptor() {
  const jsEncrypt = new JSEncrypt();

  const rsaPrivateKey = Buffer.from(process.env.RSA_PRIVATE_KEY, 'base64').toString();
  jsEncrypt.setPrivateKey(rsaPrivateKey);

  this.decrypt = (data) => jsEncrypt.decrypt(data);
}

const dataDecryptor = new DataDecryptor();

const iterate = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      obj[key] = iterate(obj[key]);
    }
    if (obj[key] && typeof obj[key] === 'string') {
      if ([
          'secret_key',
          'secrets',
          'secret',
          'token',
          'secretKey',
          'template_url',
          'component_url',
          'policy',
          'signature',
          ].includes(key)
        ) {
        obj[key] = `[:${key}]`;
      } else {
        obj[key] = dataDecryptor.decrypt(obj[key]) || obj[key];
      }
    }
  });

  return obj;
}

function standardize(body) {
  return JSON.parse(
    JSON.stringify(iterate(body))
      .replace(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/gm, '[:date]')
      .replace(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/g, '[:uuid]')
  );
};

exports = module.exports = function (options) {
  var typesData = {};
  var methodsData = {};
  var called = {};

  if (undef(options)) options = {};
  var templateFile = 'markdown.nunjucks';
  var apiPath = options.path || '/api.md';
  if (undef(options.templateFileName))
    options.templateFileName = path.resolve(__dirname, 'templates', templateFile);

  var exp = {};

  exp.type = function (name, obj) {
    return (undef(name)) ? typesData
      : (undef(obj)) ? typesData[name]
      : typesData[name] = obj;
  };

  exp.methods = function (name, method, obj) {
    if (undef(name)) {
      return methodsData;
    } else if (undef(method)) {
      return methodsData[name];
    } else if (undef(obj)) {
      methodsData[name] = method;
    } else {
      if (undef(methodsData[name])) methodsData[name] = {};
      methodsData[name][method] = obj;
    }
  };

  exp.checkMethodsData = function () {
    if (options.express && Object.keys(methodsData).length === 0)
      methodsData = parseExpressData(options);
  };

  exp.express = function (req, res) {
    this.generate(function (err, data) {
      res.send(data);
    });
  };

  exp.storeResponses = function (req, res, next) {
    this.checkMethodsData();
    var resEnd = res.end;

    res.end = function (c) {
      resEnd.apply(res, arguments);
      if (options.storeResponses && req.route && req.route.path !== apiPath && res.statusCode !== 404) {
        methodsData[req.route.path] =
          updateMethodsData(methodsData[req.route.path], req, res, c, options);
        called[req.route.path] = methodsData[req.route.path];
      }
    };

    next();
  };

  exp.generate = function (cb) {
    fs.readFile(options.templateFileName, function (err, template) {
      if (err) {
        cb(err);
      } else {
        var view = {
          options: options,
          types: typesData,
          url: Object.keys(called).sort(),
          methods: getMethodsTree(called),
          f: additional(),
        };
        cb(null, nunjucks.renderString(template.toString(), view));
      }
    });
  };

  if (options.express) {
    options.express.use(exp.storeResponses.bind(exp));
    options.express.get(apiPath, exp.express.bind(exp));
  }

  return exp;

};

function undef(v) {
  return typeof v === 'undefined';
}

function additional() {
  return {
    stringify: function (value, replacer, space, indent) {
      return JSON.stringify(value, replacer, space).replace(/^/gm, Array(indent).join(' '));
    },

    updatePath: function (path) {
      return path.replace(/^([^\/])/, '/$1').replace(/:([^/:-]+)/g, '{$1}');
    },

    regReplace: function (what, from, to, flags) {
      return what.replace(new RegExp(from, flags), to);
    },

    repeat: function (what, count) {
      return Array(count + 1).join(what);
    },
  };
}

function getMethodsTree(methodsData) {
  var result = {};
  var url = Object.keys(methodsData).sort();
  for (var i = url.length - 1; i >= 0; i--) {
    for (var j = i - 1; j >= 0; j--) {
      if (undef(result[url[i]]) && url[i].indexOf(url[j] + '/') == 0) {
        result[url[i]] = {
          shortLink: url[i].replace(url[j] + '/', ''),
          deep: url[j].replace(/^\//,'').split('/').length,
          data: methodsData[url[i]],
        };
      }
    }

    if (undef(result[url[i]])) {
      result[url[i]] = { shortLink: url[i], deep: 0, data: methodsData[url[i]] };
    }
  }

  return result;
}

function parseExpressData(options) {
  var app = options.express;
  if (undef(app) || undef(app._router)) return {};
  var s = app._router.stack;
  if (!Array.isArray(s)) return {};

  var result = {};
  for (var i = 0; i < s.length; i++) {
    if (undef(s[i])) continue;
    var r = s[i].route;
    if (undef(r) || undef(r.path) || undef(r.methods)) continue;
    if (undef(result[r.path])) result[r.path] = {};
    Object.keys(r.methods).forEach(function (method) {
      result[r.path][method] = {
        description: guessDescription( method, r.path, options.guessAll ),
      };
    });
  }

  return result;
}

function updateMethodsData(methodsPath, req, res, chunk, options) {
  var r = req.route;

  if (undef(methodsPath)) methodsPath = {};
  if (undef(methodsPath[r.stack[0].method]))
    methodsPath[r.stack[0].method] = {
      description: guessDescription( r.stack[0].method, r.path, options.guessAll ),
    };

  var m = methodsPath[r.stack[0].method];

  if (req.headers['content-type']) {
    var reqCType = req.headers['content-type'].match(/([^;]*(application|text)[^;]*)/);
    if (reqCType && reqCType[1]) {
      if (undef(m.body)) m.body = {};
      if (undef(m.body[reqCType[1]])) {
        m.body[reqCType[1]] = {
          example: standardize(req.body),
        };
      }
    }
  }

  if (res.hasHeader('content-type')) {  
    var resCType = res.getHeader('content-type').match(/([^;]*(application|text)[^;]*)/);
    if (resCType && resCType[1]) {
      var result;
      if (undef(chunk)) result = {file: 'file from a stream (no json response)'};
      else result = chunk.toString();
      if (undef(m.responses)) m.responses = {};
      if (undef(m.responses[res.statusCode])) m.responses[res.statusCode] = {};
      if (undef(m.responses[res.statusCode][resCType[1]])) {
        if (resCType[1] === 'application/json') result = standardize(JSON.parse(result));
        m.responses[res.statusCode][resCType[1]] = result;
      }
    }
  } else if (res.statusCode === 204) {
    if (undef(m.responses)) m.responses = {};
      if (undef(m.responses[res.statusCode])) m.responses[res.statusCode] = {};
      if (undef(m.responses[res.statusCode]['empty-response']))
        m.responses[res.statusCode]['empty-response'] = null;
  }

  return methodsPath;
}

function guessDescription( method, path, guess ) {
  var defaultResult = method + ' ' + path;
  if(!guess) return defaultResult;
  var responseText = {
    get : 'List all {names}',
    getOne: 'Get {name} with ID {id}',
    getSub: 'List of {subnames} that {name} ID {id} owns',
    post : 'Insert a new record in to {name} collection',
    postSub: 'Insert a new record in to {subname} collection that {name} ID {id} has',
    put : 'Replace {name} with ID {id}',
    patch : 'Modify {name} with ID {id}',
    delete : 'Delete {name} with ID {id}',
  };
  var result;
  var m = method.toLowerCase();
  var r;
  if( r = path.match(/^\/?([^\/]+?)s?\/:([^/:-]+)\/(([^\/]+?)s?)$/) ){
    m += 'Sub';
    result = responseText[m].replace('{name}',r[1]).replace('{id}','{'+r[2]+'}');
    result = result.replace('{subname}',r[4]).replace('{subnames}',r[3]);
  }
  if( r = path.match(/^\/?([^\/]+?)s?\/:([^/:-]+)$/) ){
    if(m === 'get') m = 'getOne';
    result = responseText[m].replace('{name}',r[1]).replace('{id}','{'+r[2]+'}');
  }
  if( r  = path.match(/^\/?(([^\/]+?)s?)$/) ){
    result = responseText[m].replace('{name}',r[2]).replace('{names}',r[1]);
  }
  return result || defaultResult;
}
