/*
 * @japa/expect
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { default as jestExpect } from 'expect'
import type { Test as TestContract, TestContext as TestContextContract } from '@japa/core'

/**
 * Jest expect type
 */
export type Expect = typeof jestExpect

/**
 * Expect plugin for japa/runner
 */
export function expect() {
  return function (Context: typeof TestContextContract, Test: typeof TestContract) {
    Context.getter('expect', () => jestExpect, true)

    Test.dispose(function (_, hasError) {
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
