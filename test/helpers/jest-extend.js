const _ = require('lodash');

const isAsymmetric = (obj) => {
  return obj && obj.asymmetricMatch && typeof obj.asymmetricMatch === 'function';
};

const containSubset = (actual, expected) => {
  if (isAsymmetric(expected)) {
    return expected.asymmetricMatch(actual);
  }
  if (!actual || !expected) {
    return actual === expected;
  }

  if (_.isArray(expected)) {
    if (!_.isArray(actual)) { return false; }

    const pass = expected.every((expectedItem) => {
      return actual.some((actualItem) => containSubset(actualItem, expectedItem));
    });
    return pass;
  }
  if (_.isObject(expected)) {
    if (!_.isObject(actual)) { return false; }

    const pass = Object.keys(expected).every((key) => {
      const p = containSubset(actual[key], expected[key]);
      return p;
    });
    return pass;
  }

  return actual === expected;
};

expect.extend({
  toContainSubset(received, expected) {
    const options = {
      comment: 'Object.is equality',
      isNot: this.isNot,
      promise: this.promise,
    };

    const pass = containSubset(received, expected);
    if (pass) {
      return {
        pass,
        message: () =>
          `${this.utils.matcherHint('toBe', undefined, undefined, options)
          }\n\n` +
        `Expected: not ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}`,
      };
    }

    return {
      pass,
      message: () =>
        `${this.utils.matcherHint('toContainSubset', undefined, undefined, options)
        }\n\n${
          this.utils.printDiffOrStringify(
            expected,
            received,
            'Expected',
            'Received',
            this.expand !== false,
          )}`,
    };
  },
});

jest.setTimeout(30000);
