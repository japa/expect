/*
 * @japa/expect
 *
 * (c) Japa.dev
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { PluginFn } from '@japa/runner'
import { jestExpectWithMessage } from './src/with_message/index'
import { PluginOptions } from './src/types'

/**
 * Jest expect type
 */
export type Expect = ReturnType<typeof jestExpectWithMessage>

/**
 * Expect plugin for "@japa/runner"
 */
export function expect(options?: PluginOptions): PluginFn {
  const jestExpect = jestExpectWithMessage(options?.messages)

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
