export interface JestExpectWithMessageOptions {
  /**
   * If false will not show the `Custom message`: prefix.
   * @default true
   */
  showPrefix?: boolean

  /**
   * If false will not show the matchers original error message.
   * @default true
   */
  showMatcherMessage?: boolean

  /**
   * If false will not show the stack trace.
   * @default true
   */
  showStack?: boolean
}

/**
 * Types for @japa/expect plugin configuration
 */
export interface PluginOptions {
  messages?: JestExpectWithMessageOptions
}
