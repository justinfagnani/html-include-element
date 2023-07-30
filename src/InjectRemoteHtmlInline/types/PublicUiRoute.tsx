/**
 * Mostly the same as UiRoute, but jsdoc comments
 * are written for a different audience, our merchants
 */
export type PublicUiRoute = {
  origin: string
  /**
   * Should start with a leading `'/'`
   *
   * TODO: Use tanstack router to give full union of all known routes?
   */
  pathname: string
  /** Don't pass `initialUiRoute` here - `pathname` becomes the `?initialUiRoute=` query param. */
  params?: Record<string, string>
}
