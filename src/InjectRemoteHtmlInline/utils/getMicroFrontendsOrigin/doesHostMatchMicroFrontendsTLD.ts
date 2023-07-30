/** Or the micro-frontend's localhost */
export const doesHostMatchMicroFrontendsTLD = ({
  host,
  protocol,
  MF_TLD,
  MF_LOCALHOST,
}: {
  /** current host we are executing on */
  host: string
  /** protocol of "page?" we are executing on */
  protocol: string | undefined
  /** Micro-frontend's TLD, where the micro-frontend will be deployed. */
  MF_TLD: string
  /**
   * Micro-frontend's (ideally) unique local `host` used for development
   *
   * Example: You are working on an alphabet app for kids, shortname "ABC", "ABC on a phone dial pad translates to `111`,
   * we can use localhost port `1110` for the micro-frontend's local development server.
   */
  MF_LOCALHOST: string
}): boolean => {
  if (host.endsWith(`.${MF_TLD}`) || host === MF_TLD) {
    if (protocol && protocol.endsWith('s:')) {
      reportError(
        new Error(
          `Warning: using insecure protocol for ${host}`,
        ),
      )
    }
    return true
  }

  // / eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (host === MF_LOCALHOST) {
    return true
  }

  return false
}
