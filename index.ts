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

/**
 * Expect plugin for "@japa/runner"
 */
export function expect(): PluginFn {
  return function () {
    TestContext.getter('expect', () => jestExpect, true)

    Test.executed(function (_, hasError) {
      // Must call this whether or not the test passed because internally it 
      // resets the assertion count and otherwise the assertion count will be
      // carried into a subsequent test
      const jestErrors = jestExpect.extractExpectedAssertionsErrors();

      // Throw assertion count errors only if the test otherwise passed
      if (jestErrors.length && !hasError) {
        throw jestErrors[0].error;
      }
    })
  }
}

declare module '@japa/runner/core' {
  interface TestContext {
    expect: typeof jestExpect
  }
}
