import { test } from '@japa/runner'
import { jestExpectWithMessage } from '../src/with_message/index'

function removeAnsiCodes(str: string) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\u001b\[[0-9;]*m/g, '')
}

test.group('With Message', () => {
  test('Throws a custom message when matcher fails', ({ assert }) => {
    assert.plan(1)
    const expect = jestExpectWithMessage()

    try {
      expect(2 + 2, 'Should be equal to 4 !!').toBe(5)
    } catch (e) {
      assert.include(e.message, 'Should be equal to 4 !!')
    }
  })

  test('Throws original matcher message when not custom message is provided', ({ assert }) => {
    assert.plan(1)
    const expect = jestExpectWithMessage()

    try {
      expect(2 + 2).toBe(5)
    } catch (e) {
      const message = removeAnsiCodes(e.message)
      assert.include(message, 'Expected: 5\nReceived: 4')
    }
  })

  test('show prefix when showPrefix is true', ({ assert }) => {
    assert.plan(2)
    const expect = jestExpectWithMessage({ showPrefix: true })

    try {
      expect(2 + 2, 'Should be equal to 4 !!').toBe(5)
    } catch (e) {
      assert.include(e.message, 'Custom message:\n')
      assert.include(e.message, 'Should be equal to 4 !!')
    }
  })

  test('config defined on test-level should override global config', ({ assert }) => {
    assert.plan(2)
    const expect = jestExpectWithMessage({ showPrefix: true })

    try {
      expect(2 + 2, 'Should be equal to 4 !!', { showPrefix: false }).toBe(5)
    } catch (e) {
      assert.notInclude(e.message, 'Custom message:\n')
      assert.include(e.message, 'Should be equal to 4 !!')
    }
  })

  test("shouldn't show stack when showStack is false", ({ assert }) => {
    assert.plan(1)
    const expect = jestExpectWithMessage({ showStack: false })

    try {
      expect(2 + 2, 'Should be equal to 4 !!').toBe(5)
    } catch (e) {
      assert.isUndefined(e.stack)
    }
  })
})
