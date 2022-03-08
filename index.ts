/*
 * @japa/expect
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { default as jestExpect } from 'expect'
import type { PluginFn } from '@japa/runner'

/**
 * Jest expect type
 */
export type Expect = typeof jestExpect

/**
 * Expect plugin for "@japa/runner"
 */
export function expect(): PluginFn {
  return function (_, __, { TestContext, Test }) {
    TestContext.getter('expect', () => jestExpect, true)

    Test.dispose(function (___, hasError) {
      if (hasError) {
        return
      }

      const jestErrors = jestExpect.extractExpectedAssertionsErrors()
      if (jestErrors.length) {
        throw jestErrors[0].error
      }
    })
  }
}

declare module '@japa/runner' {
  interface TestContext {
    expect: Expect
  }
}
