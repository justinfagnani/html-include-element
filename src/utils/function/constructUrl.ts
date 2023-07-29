/**
 * Wrapper around `new URL` to provide better error messages.
 */
export const constructUrl = (
  url: string,
  baseUrl?: string,
): URL => {
  try {
    return baseUrl ? new URL(url, baseUrl) : new URL(url)
  } catch (e) {
    let errorMessage = `Invalid url: ${url}`
    if (baseUrl) {
      errorMessage += ` baseUrl: ${baseUrl}`
    }
    // TODO: modify tsconfig.json and build step to add support for `cause` in Error.
    // @ts-expect-error - wip
    throw new Error(errorMessage, { cause: e })
  }
}
