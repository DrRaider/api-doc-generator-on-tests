const Markdown = require('..');

describe('testing with no validators', () => {
  describe('check if text is in generated md', () => {
    beforeEach(function () {
      this.md = new Markdown({
        title: 'Testing',
        baseUri: 'http://localhost:3000',
        versionAPI: '1',
      });
      this.md.type('books', {
        name: { type: 'string', required: true },
        numberOfPages: { type: 'integer' },
        author: {
          name: { type: 'string' },
          email: { type: 'email' },
        },
      });
      this.md.methods('books', 'get', {
        description: 'Get information about all books',
        responses: {
          200: { 'application/json': [{ name: 'one', author: { name: 'Bert' } }] },
          404: { 'application/json': { code: '120', message: 'Books was found' } },
        },
      });
      this.md.methods('books', 'get', {
        description: 'Get information about all books',
        responses: {
          200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
          404: { 'application/json': { code: '120', message: 'Books not found' } },
        },
      });
      this.md.methods('echo', 'get');
    });

    afterEach(function () {
      this.md = null;
    });

    it('check generated file', function (done) {
      this.md.generate((err, mdText) => {
        (err instanceof Error).should.equal(false);
        mdText.should.match(/# Testing/);
        mdText.should.match(/BaseUri: \[http:\/\/localhost:3000\]\(http:\/\/localhost:3000\)/);
        mdText.should.match(/# Types/);
        mdText.should.match(/## <a name="types.books"><\/a> books/);
        mdText.should.match(/\/books/);
        mdText.should.match(/# Methods/);
        mdText.should.match(/## Brief/);
        mdText.should.match(/ {3}- \[get\]\(#methods.books.get\)/);
        mdText.should.match(/get \| Get information about all books/);
        mdText.should.match(/### <a name="methods.books.get"><\/a> get/);
        mdText.should.match(/\*\*Responses\*\*.?/);
        mdText.should.match(/200 \|application\/json \| ```\[\{"name":"one", "author":\{"name":"Art"\}\}\]```/);
        done();
      });
    });

    it('check test generated file', (done) => {
      const md2 = new Markdown({ templateFileName: './test/repeat.nunjucks' });
      md2.generate((err, mdText) => {
        (err instanceof Error).should.equal(false);
        mdText.should.match(/aaaaa/);
        mdText.should.not.match(/aaaaaa/);
        done();
      });
    });

    it('check not exists file', (done) => {
      const md2 = new Markdown({ templateFileName: './test/not_exists.nunjucks' });
      md2.generate((err, mdText) => {
        (err instanceof Error).should.equal(true);
        err.toString().should.match(/Error: ENOENT: no such file or directory/);
        done();
      });
    });
  });

  describe('type and methods getters', () => {
    beforeEach(function () {
      this.md = new Markdown();
      this.md.type('books', {
        name: { type: 'string', required: true },
        numberOfPages: { type: 'integer' },
        author: {
          name: { type: 'string' },
          email: { type: 'email' },
        },
      });
      this.md.methods('books', 'get', {
        description: 'Get information about all books',
        responses: {
          200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
          404: { 'application/json': { code: '120', message: 'Books not found' } },
        },
      });
    });

    afterEach(function () {
      this.md = null;
    });

    it('type testing', function (done) {
      this.md.type().should.eql({
        books: {
          name: { type: 'string', required: true },
          numberOfPages: { type: 'integer' },
          author: { name: { type: 'string' }, email: { type: 'email' } },
        },
      });

      this.md.type('books').should.eql({
        name: { type: 'string', required: true },
        numberOfPages: { type: 'integer' },
        author: { name: { type: 'string' }, email: { type: 'email' } },
      });

      done();
    });

    it('methods testing', function (done) {
      this.md.methods().should.eql({
        books: {
          get: {
            description: 'Get information about all books',
            responses: {
              200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
              404: { 'application/json': { code: '120', message: 'Books not found' } },
            },
          },
        },
      });

      this.md.methods('books').should.eql({
        get: {
          description: 'Get information about all books',
          responses: {
            200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
            404: { 'application/json': { code: '120', message: 'Books not found' } },
          },
        },
      });

      done();
    });
  });

  describe('empty type and methods getters', () => {
    beforeEach(function () {
      this.md = new Markdown();
    });

    afterEach(function () {
      this.md = null;
    });

    it('type testing', function (done) {
      this.md.type().should.eql({});
      (typeof this.md.type('books') === 'undefined').should.equal(true);
      done();
    });

    it('methods testing', function (done) {
      this.md.methods().should.eql({});
      (typeof this.md.methods('books') === 'undefined').should.equal(true);
      done();
    });
  });
});
