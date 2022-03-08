# @japa/expect
> Assertion library built on top of jest-expect

[![github-actions-image]][github-actions-url] [![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

An assertion library built on top of [jest-expect](https://jestjs.io/docs/expect).

## Installation
Install the package from the npm registry as follows:

```sh
npm i @japa/expect

yarn add @japa/expect
```

## Usage
You can use the assertion package with the `@japa/runner` as follows.

```ts
import { expect } from '@japa/expect'
import { configure } from '@japa/runner'

configure({
  plugins: [expect()]
})
```

Once done, you will be able to access the `expect` property on the test context.

```ts
test('test title', ({ expect }) => {
  expect(100).toBeWithinRange(90, 110)
})
```

[github-actions-url]: https://github.com/japa/expect/actions/workflows/test.yml "github-actions"

[github-actions-image]: https://img.shields.io/github/workflow/status/japa/expect/test?style=for-the-badge

[npm-image]: https://img.shields.io/npm/v/@japa/expect.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@japa/expect "npm"

[license-image]: https://img.shields.io/npm/l/@japa/expect?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
