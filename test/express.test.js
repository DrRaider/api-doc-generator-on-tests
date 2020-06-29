const express = require('express');
const httpMocks = require('node-mocks-http');
const Markdown = require('..');

describe('testing express', () => {
  describe('check generated md', () => {
    const app = {
      _router: {
        stack: [
          undefined,
          { },
          { route: { path: 'no_methods' } },
          { route: { methods: 'not_object' } },
          { route: { methods: { no_path: true } } },
          { route: { path: '/aaa', methods: { get: true } } },
          { route: { path: '/aaa', methods: { post: true } } },
          { route: { path: '/aaa/:idAaa', methods: { get: true } } },
          { route: { path: '/bbb', methods: { get: true } } },
        ],
      },
    };
    app.use = function () {};
    app.get = function () {};

    beforeEach(function () {
      this.md = new Markdown({ express: app, storeResponses: true });
    });

    afterEach(function () {
      this.md = null;
    });

    it('app is undefined', function (done) {
      this.md.express({}, {
        send(data) {
          data.should.match(/# Methods/m);
          data.should.match(/\/aaa/m);
          data.should.match(/\/bbb/m);
          data.should.match(/\/aaa\/:idAaa/);
          done();
        },
      });
    });
  });

  [undefined, { _router: undefined }, { _router: { stack: undefined } }].forEach((app) => {
    describe('check various empties app', () => {
      beforeEach(function () {
        if (app) app.use = function () {};
        if (app) app.get = function () {};
        this.md = new Markdown({ express: app, storeResponses: true });
      });

      afterEach(function () {
        this.md = null;
      });

      it('app is undefined', function (done) {
        this.md.express({}, {
          send(data) {
            data.should.match(/^# Methods/m);
            data.should.match(/^## Brief/m);
            done();
          },
        });
      });
    });
  });

  describe('express workflow', () => {
    beforeEach(function () {
      this.app = express();
      this.app.get('/b', (req, res) => { res.send('b1:'); });
      this.app.post('/b', (req, res) => { res.send('b2:'); });
      this.app.get('/b/:id', (req, res) => { res.send(`b3:${req.params.id}`); });
      this.app.delete('/b/:id', (req, res) => { res.send(`b4:${req.params.id}`); });

      this.md = new Markdown({ express: this.app, storeResponses: true, guessAll: true });
      this.app.get('/api.md', this.md.express.bind(this.md));
    });

    afterEach(function () {
      this.md = null;
      this.app = null;
    });

    it('typical usage', function (done) {
      this.md.express({}, {
        send(data) {
          data.should.match(/\[\/\/api.md\]\(#methods.\/api.md\)/m);
          data.should.match(/post \| Insert a new record in to b collection/m);
          done();
        },
      });
    });
  });
});

describe('with httpMocks no guessAll', () => {
  const app = {
    _router: {
      stack: [
        { route: { path: '/aaa', methods: { get: true } } },
        { route: { path: '/aaa', methods: { post: true } } },
        { route: { path: '/aaa/:id', methods: { get: true } } },
      ],
    },
  };
  app.use = function () {};
  app.get = function () {};

  const md = new Markdown({ express: app, storeResponses: true });
  let request = {};
  let response = {};

  beforeEach((done) => {
    response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    done();
  });

  it('post /aaa', function (done) {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/aaa',
      query: {
        name: 'foo',
      },
      headers: {
        'content-type': 'application/json',
      },
      body: {
        name: 'foo',
      },
      route: {
        path: '/aaa',
        stack: [{
          method: 'post',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(201);
      response._headers['content-type'] = 'application/json';
      response.end('{"name":"foo"}');
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('post /aaa again', function (done) {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/aaa',
      query: {
        name: 'foo',
      },
      headers: {
        'content-type': 'application/json',
      },
      body: {
        name: 'foo',
      },
      route: {
        path: '/aaa',
        stack: [{
          method: 'post',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(201);
      response._headers['content-type'] = 'application/json';
      response.end('{"error":"conflict"}');
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });
});

describe('with httpMocks', () => {
  const app = {
    _router: {
      stack: [
        { route: { path: '/aaa', methods: { get: true } } },
        { route: { path: '/aaa', methods: { post: true } } },
        { route: { path: '/aaa/:id', methods: { get: true } } },
      ],
    },
  };
  app.use = function () {};
  app.get = function () {};

  const md = new Markdown({ express: app, storeResponses: true, guessAll: true });
  let request = {};
  let response = {};

  beforeEach((done) => {
    response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    done();
  });

  it('get /aaa/1/bbb', function (done) {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/aaa/1/bbb',
      route: {
        path: '/aaa/:id/bbb',
        stack: [{
          method: 'get',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(200);
      response._headers['content-type'] = 'application/json';
      response.end('{"name":"foo"}');
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('post /aaa', function (done) {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/aaa',
      query: {
        name: 'foo',
      },
      headers: {
        'content-type': 'application/json',
      },
      body: {
        name: 'foo',
      },
      route: {
        path: '/aaa',
        stack: [{
          method: 'post',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(201);
      response._headers['content-type'] = 'application/json';
      response.end('{"name":"foo"}');
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('post /aaa again', function (done) {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/aaa',
      query: {
        name: 'foo',
      },
      headers: {
        'content-type': 'application/json',
      },
      body: {
        name: 'foo',
      },
      route: {
        path: '/aaa',
        stack: [{
          method: 'post',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(201);
      response._headers['content-type'] = 'application/json';
      response.end('{"error":"conflict"}');
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('post /aaa again', function (done) {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/aaa',
      query: {
        name: 'foo',
      },
      headers: {
        'content-type': 'application/json',
      },
      body: {
        name: 'foo',
      },
      route: {
        path: '/aaa',
        stack: [{
          method: 'post',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(409);
      response._headers['content-type'] = 'text/other';
      response.end('{"error":"conflict"}');
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('post /aaa unknown content type', function (done) {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/aaa',
      query: {
        name: 'foo',
      },
      headers: {
        'content-type': 'unknown',
      },
      body: {
        name: 'foo',
      },
      route: {
        path: '/aaa',
        stack: [{
          method: 'post',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(400);
      response._headers['content-type'] = 'unknown';
      response.end('{"name":"foo"}');
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('delete /aaa/123', function (done) {
    request = httpMocks.createRequest({
      method: 'DELETE',
      url: '/aaa/123',
      query: {
        name: 'foo',
      },
      route: {
        path: '/aaa/123',
        stack: [{
          method: 'delete',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(400);
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('delete /aaa/123 again', function (done) {
    request = httpMocks.createRequest({
      method: 'DELETE',
      url: '/aaa/123',
      query: {
        name: 'foo',
      },
      route: {
        path: '/aaa/123',
        stack: [{
          method: 'delete',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(400);
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('post /xxx', function (done) {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/xxx',
      query: {
        name: 'foo',
      },
      route: {
        path: '/xxx',
        stack: [{
          method: 'post',
        }],
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(400);
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });

  it('no route', function (done) {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/aaaBBB',
      query: {
        name: 'foo',
      },
    });

    response.on('end', () => {
      // console.log(response._getData());
      response.status(400);
      done();
    });

    const _this = this;
    md.storeResponses(request, response, (error) => {
      md.express(request, response, (error) => {
      });
    });
  });
});
