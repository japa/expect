/*
 * @japa/expect
 *
 * (c) Japa.dev
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { expect as jestExpect } from 'expect'
import type { PluginFn } from '@japa/runner/types'
import { Test, TestContext } from '@japa/runner/core'
import { Expect } from './src/types.js'

/**
 * Expect plugin for "@japa/runner"
 */
export function expect(): PluginFn {
  return function () {
    TestContext.getter('expect', () => jestExpect, true)

    Test.executed(function (_, hasError) {
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

declare module '@japa/runner/core' {
  interface TestContext {
    expect: Expect
  }
}
