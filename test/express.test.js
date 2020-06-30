const httpMocks = require('node-mocks-http');
const { EventEmitter } = require('events');
const Markdown = require('..');

describe('testing express', () => {
  [undefined, { _router: undefined }, { _router: { stack: undefined } }].forEach((app) => {
    describe('check various empties app', () => {
      beforeEach(() => {
        if (app) app.use = () => {};
        if (app) app.get = () => {};
        this.md = new Markdown({ express: app, storeResponses: true });
      });

      afterEach(() => {
        this.md = null;
      });

      it('app is undefined', (done) => {
        this.md.express({}, {
          send(data) {
            expect(data).toMatch(/^# Methods/m);
            expect(data).toMatch(/^## Brief/m);
            done();
          },
        });
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
  app.use = () => {};
  app.get = () => {};

  const md = new Markdown({ express: app, storeResponses: true });
  let request = {};
  let response = {};

  beforeEach((done) => {
    response = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });
    done();
  });

  it('post /aaa', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('post /aaa again', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
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
  app.use = () => {};
  app.get = () => {};

  const md = new Markdown({ express: app, storeResponses: true, guessAll: true });
  let request = {};
  let response = {};

  beforeEach((done) => {
    response = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });
    done();
  });

  it('get /aaa/1/bbb', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('post /aaa', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('post /aaa again', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('post /aaa again', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('post /aaa unknown content type', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('delete /aaa/123', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('delete /aaa/123 again', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('post /xxx', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });

  it('no route', (done) => {
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

    md.storeResponses(request, response, () => {
      md.express(request, response, () => {
      });
    });
  });
});
