export class JestAssertionError extends Error {
  public matcherResult: any

  constructor(
    result: { message: string | (() => string | undefined) | undefined },
    callsite: Function | undefined
  ) {
    super(typeof result.message === 'function' ? result.message() : result.message)

    this.matcherResult = result

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite)
    }
  }
}
