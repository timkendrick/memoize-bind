# memoize-bind
[![npm version](https://img.shields.io/npm/v/memoize-bind.svg)](https://www.npmjs.com/package/memoize-bind)
![Stability](https://img.shields.io/badge/stability-stable-brightgreen.svg)
[![Build Status](https://travis-ci.org/timkendrick/memoize-bind.svg?branch=master)](https://travis-ci.org/timkendrick/memoize-bind)

> Memoized function binding

`memoize-bind` performs the same job as [`Function.prototype.bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), however it memoizes the result for future reference.

This ensures that calling `memoize-bind` repeatedly with the same arguments will always return the same bound function, which can be particularly useful within React.js render methods (see below).

## Installation

```bash
npm install memoize-bind
```

## Usage

### `bind(fn, [context], [...args])`

Create a new function that, when called, will invoke `fn` with the `this` keyword set to `context`.

If any `args` are specified, they will be prepended to the list of arguments supplied when calling the newly-created function.

## Example

```js
import bind from 'memoize-bind';
import assert from 'assert';

const context = { name: 'foo' };
const fn = (...args) => [this.name, ...args];
const args = ['bar', 'baz']

const boundFn = bind(fn, context, ...args); // Identical to fn.bind(context, ...args)
const boundFn2 = bind(fn, context, ...args); // Returns the same function
assert(boundFn === boundFn2);

boundFn('qux'); // Returns ['foo', 'bar', 'baz', 'qux']
```

## Why `memoize-bind`?

[`Function.prototype.bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)` is often used within React components, where callbacks need to be bound to the current component instance (optionally with arguments pre-applied).

While convenient, using `.bind()` within a render function can be problematic for React's dirty-checking algorithm, seeing as a new function instance would be returned on each render, leaving the React reconciler unable to tell that two functions generated during subsequent renders are indeed identical.

`memoize-bind` fixes this problem by always returning the same bound function when called with the same arguments, allowing bound functions to be used within straightforward equality checks in the component's `shouldComponentUpdate` method (as used by `PureComponent` / `PureRenderMixin`).

This means that you can keep all the convenience of the `.bind()` method, without having to worry about affecting performance.

## React Example

```js
import bind from 'memoize-bind';
import React, { PropTypes, PureComponent } from 'react';

class TodoList extends PureComponent {
  render() {
    const { items } = this.props;
    return (
      <ul>
        {items.map((item, index) => (
          <li onClick={bind(this.handleItemClicked, this, item)} key={item.id}>{item.label}</li>
        ))}
      </ul>
    );
  }

  handleItemClicked(item) {
    if (!item.isCompleted) { this.props.onComplete(item); }
  }

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      isCompleted: PropTypes.bool,
    })),
    onComplete: PropTypes.func.isRequired,
  };
}
```

## Using `memoize-bind` in ES5 applications

`memoize-bind` uses [`memoize-weak`](https://www.npmjs.com/package/memoize-weak) internally to ensure that any memoized arguments and values can be properly garbage-collected.

`memoize-weak` requires that `Map` and `WeakMap` are globally available. This means that these will have to be polyfilled for use in an ES5 environment.

Some examples of `Map` and `WeakMap` polyfills for ES5:

- [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/)
- [CoreJS](https://github.com/zloirock/core-js)
- [`es6-map`](https://www.npmjs.com/package/es6-map) and [`es6-weak-map`](https://www.npmjs.com/package/es6-weak-map)
