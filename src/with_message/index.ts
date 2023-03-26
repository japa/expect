import { default as baseJestExpect } from 'expect'
import type { JestExpectWithMessageOptions } from '../types'
import { MatcherWrapper } from './matcher_wrapper'

export function jestExpectWithMessage(options: JestExpectWithMessageOptions = {}) {
  const baseConfig = {
    showMatcherMessage: options.showMatcherMessage ?? true,
    showPrefix: options.showPrefix ?? false,
    showStack: options.showStack ?? true,
  }

  let expectProxy = Object.assign(
    (actual: unknown, customMessage?: string, proxyOptions?: JestExpectWithMessageOptions) => {
      const config = { ...baseConfig, ...(proxyOptions || {}) }

      // partially apply expect to get all matchers and chain them
      let matchers = baseJestExpect(actual)
      if (customMessage) {
        // only pay the cost of proxying matchers if we received a customMessage
        matchers = MatcherWrapper.wrapMatchers(matchers, customMessage, config)
      }

      return matchers
    },
    baseJestExpect // clone additional properties on expect
  )

  expectProxy.extend = (o) => {
    baseJestExpect.extend(o) // add new matchers to expect
    expectProxy = Object.assign(expectProxy, baseJestExpect) // clone new asymmetric matchers
  }

  return expectProxy
}
