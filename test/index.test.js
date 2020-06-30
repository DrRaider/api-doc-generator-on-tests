const Markdown = require('..');

describe('testing with no validators', () => {
  describe('check if text is in generated md', () => {
    beforeEach(() => {
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
      this.md.called('books', 'get', {
        description: 'Get information about all books',
        responses: {
          200: { 'application/json': [{ name: 'one', author: { name: 'Bert' } }] },
          404: { 'application/json': { code: '120', message: 'Books was found' } },
        },
      });
      this.md.called('books', 'get', {
        description: 'Get information about all books',
        responses: {
          200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
          404: { 'application/json': { code: '120', message: 'Books not found' } },
        },
      });
      this.md.called('echo', 'get');
    });

    afterEach(() => {
      this.md = null;
    });

    it('check generated file', (done) => {
      this.md.generate((err, mdText) => {
        expect(err).toBeNull();
        expect(mdText).toMatch(/# Testing/);
        expect(mdText).toMatch(/BaseUri: \[http:\/\/localhost:3000\]\(http:\/\/localhost:3000\)/);
        expect(mdText).toMatch(/# Types/);
        expect(mdText).toMatch(/## <a name="types.books"><\/a> books/);
        expect(mdText).toMatch(/books/);
        expect(mdText).toMatch(/# Methods/);
        expect(mdText).toMatch(/## Brief/);
        done();
      });
    });

    it('check test generated file', (done) => {
      const md2 = new Markdown({ templateFileName: './test/repeat.nunjucks' });
      md2.generate((err, mdText) => {
        expect(err).toBeNull();
        expect(mdText).toMatch(/aaaaa/);
        expect(mdText).not.toMatch(/aaaaaa/);
        done();
      });
    });

    it('check not exists file', (done) => {
      const md2 = new Markdown({ templateFileName: './test/not_exists.nunjucks' });
      md2.generate((err) => {
        expect(err.code).toEqual('ENOENT');
        expect(err.toString()).toMatch(/Error: ENOENT: no such file or directory/);
        done();
      });
    });
  });

  describe('type and methods getters', () => {
    beforeEach(() => {
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

    afterEach(() => {
      this.md = null;
    });

    it('type testing', (done) => {
      expect(this.md.type()).toEqual({
        books: {
          name: { type: 'string', required: true },
          numberOfPages: { type: 'integer' },
          author: { name: { type: 'string' }, email: { type: 'email' } },
        },
      });

      expect(this.md.type('books')).toEqual({
        name: { type: 'string', required: true },
        numberOfPages: { type: 'integer' },
        author: { name: { type: 'string' }, email: { type: 'email' } },
      });

      done();
    });

    it('methods testing', (done) => {
      expect(this.md.methods()).toEqual({
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

      expect(this.md.methods('books')).toEqual({
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
    beforeEach(() => {
      this.md = new Markdown();
    });

    afterEach(() => {
      this.md = null;
    });

    it('type testing', (done) => {
      expect(this.md.type()).toEqual({});
      expect(typeof this.md.type('books')).toBe('undefined');
      done();
    });

    it('methods testing', (done) => {
      expect(this.md.methods()).toEqual({});
      expect(typeof this.md.methods('books')).toBe('undefined');
      done();
    });
  });
});
