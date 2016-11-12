const { expect } = require('chai');
const { spy } = require('sinon');

const bind = require('../../lib/bind');

describe('bind', () => {
  it('SHOULD return a function', () => {
    const actual = bind(() => {});
    const expected = Function;
    expect(actual).to.be.an.instanceOf(expected);
  });

  it('SHOULD throw an error if no function is specified', () => {
    const actual = () => bind();
    const expected = Error;
    expect(actual).to.throw(expected);
  });

  it('SHOULD throw an error if the first argument is not a function', () => {
    const actual = () => bind({});
    const expected = Error;
    expect(actual).to.throw(expected);
  });

  describe('GIVEN a bound function that expects no arguments', () => {
    const context = {
      name: 'context',
      method: spy(function method() {
        return [this.name, 'foo'];
      }),
    };
    let boundFn;
    before(() => {
      boundFn = bind(context.method, context);
    });

    describe('AND the bound function is called', () => {
      let result;
      before(() => {
        result = boundFn();
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = context.method.firstCall.args;
        const expected = [];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = result;
        const expected = ['context', 'foo'];
        expect(actual).to.deep.equal(expected);
      });

      describe('AND another bound function is created with the same arguments', () => {
        let boundFn2;
        before(() => {
          boundFn2 = bind(context.method, context);
        });

        it('SHOULD return the first bound function', () => {
          const actual = boundFn2;
          const expected = boundFn;
          expect(actual).to.equal(expected);
        });

        describe('AND another bound function is created with different arguments', () => {
          let boundFn3;
          before(() => {
            boundFn3 = bind(context.method, { name: 'bar' });
          });

          it('SHOULD return a different bound function', () => {
            const actual = boundFn3;
            const expected = boundFn;
            expect(actual).not.to.equal(expected);
          });

          describe('AND the second bound function is called', () => {
            let result2;
            before(() => {
              result2 = boundFn3();
            });

            it('SHOULD return the correct result', () => {
              const actual = result2;
              const expected = ['bar', 'foo'];
              expect(actual).to.deep.equal(expected);
            });
          });
        });
      });
    });
  });

  describe('GIVEN a bound function that expects multiple arguments', () => {
    const context = {
      name: 'context',
      method: spy(function method(...args) {
        return [this.name, args];
      }),
    };
    let boundFn;
    before(() => {
      boundFn = bind(context.method, context);
    });

    describe('AND the bound function is called with multiple arguments', () => {
      let result;
      before(() => {
        result = boundFn('foo', 'bar', 'baz');
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = context.method.firstCall.args;
        const expected = ['foo', 'bar', 'baz'];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = result;
        const expected = ['context', ['foo', 'bar', 'baz']];
        expect(actual).to.deep.equal(expected);
      });
    });
  });

  describe('GIVEN a partially-applied bound function that expects no additional arguments', () => {
    const context = {
      name: 'context',
      method: spy(function method(...args) {
        return [this.name, args];
      }),
    };
    let boundFn;
    before(() => {
      boundFn = bind(context.method, context, 'foo', 'bar', 'baz');
    });

    describe('AND the bound function is called with no arguments', () => {
      let result;
      before(() => {
        result = boundFn();
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = context.method.firstCall.args;
        const expected = ['foo', 'bar', 'baz'];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = result;
        const expected = ['context', ['foo', 'bar', 'baz']];
        expect(actual).to.deep.equal(expected);
      });

      describe('AND another bound function is created with the same arguments', () => {
        let boundFn2;
        before(() => {
          boundFn2 = bind(context.method, context, 'foo', 'bar', 'baz');
        });

        it('SHOULD return the first bound function', () => {
          const actual = boundFn2;
          const expected = boundFn;
          expect(actual).to.equal(expected);
        });

        describe('AND another bound function is created with different arguments', () => {
          let boundFn3;
          before(() => {
            boundFn3 = bind(context.method, context, 'foo', 'bar', 'baz', 'qux');
          });

          it('SHOULD return a different bound function', () => {
            const actual = boundFn3;
            const expected = boundFn;
            expect(actual).not.to.equal(expected);
          });

          describe('AND the second bound function is called', () => {
            let result2;
            before(() => {
              result2 = boundFn3();
            });

            it('SHOULD return the correct result', () => {
              const actual = result2;
              const expected = ['context', ['foo', 'bar', 'baz', 'qux']];
              expect(actual).to.deep.equal(expected);
            });
          });
        });
      });
    });
  });

  describe('GIVEN a partially-applied bound function that expects additional arguments', () => {
    const context = {
      name: 'context',
      method: spy(function method(...args) {
        return [this.name, args];
      }),
    };
    let boundFn;
    before(() => {
      boundFn = bind(context.method, context, 'foo', 'bar', 'baz');
    });

    describe('AND the bound function is called with multiple arguments', () => {
      let result;
      before(() => {
        result = boundFn(1, 2, 3);
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = context.method.firstCall.args;
        const expected = ['foo', 'bar', 'baz', 1, 2, 3];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = result;
        const expected = ['context', ['foo', 'bar', 'baz', 1, 2, 3]];
        expect(actual).to.deep.equal(expected);
      });
    });
  });
});
