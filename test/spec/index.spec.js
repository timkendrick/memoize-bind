const { expect } = require('chai');

const bind = require('../..');

describe('memoize-bind', () => {
  it('Should export a function', () => {
    expect(bind).to.be.a('function');
  });
});
