import { JestExpectWithMessageOptions } from '../types'
import { JestAssertionError } from './assertion_error'

export class MatcherWrapper {
  private static rethrowWithMessage(
    error: any,
    customMessage: string,
    config: JestExpectWithMessageOptions,
    newMatcher: Function
  ) {
    if (!error.matcherResult) {
      throw error
    }
    const { matcherResult } = error

    if (typeof customMessage !== 'string' || customMessage.length < 1) {
      throw new JestAssertionError(matcherResult, newMatcher)
    }

    const matcherMessage =
      typeof error.matcherResult.message === 'function'
        ? error.matcherResult.message()
        : error.matcherResult.message

    const messagePrefix = config.showPrefix ? '\n    Custom message:\n      ' : ''

    const message = () =>
      messagePrefix + customMessage + (config.showMatcherMessage ? '\n\n' + matcherMessage : '')

    const e = new JestAssertionError({ ...matcherResult, message }, newMatcher)

    if (!config.showStack) {
      e.stack = undefined
    }

    throw e
  }

  /**
   * Return a wrapped version of a matcher that throws a custom message
   */
  private static wrapMatcher(
    matcher: any,
    customMessage: string,
    config: JestExpectWithMessageOptions
  ) {
    const newMatcher = (...args: any) => {
      try {
        const result = matcher(...args)

        if (!result || typeof result.then !== 'function') {
          return result
        }

        return result
          .catch((error: any) => this.rethrowWithMessage(error, customMessage, config, newMatcher))
          .catch(function handleError(error) {
            throw new JestAssertionError(error.matcherResult, handleError)
          })
      } catch (e) {
        this.rethrowWithMessage(e, customMessage, config, newMatcher)
      }
    }
    return newMatcher
  }

  /**
   * Replace all matchers with wrapped versions that throw a custom message
   */
  public static wrapMatchers(
    matchers: any,
    customMessage: string,
    config: JestExpectWithMessageOptions
  ): any {
    return Object.keys(matchers).reduce((acc, name) => {
      const matcher = matchers[name]

      if (typeof matcher === 'function') {
        acc[name] = this.wrapMatcher(matcher, customMessage, config)
      } else {
        acc[name] = this.wrapMatchers(matcher, customMessage, config) // recurse on .not/.resolves/.rejects
      }

      return acc
    }, {})
  }
}
