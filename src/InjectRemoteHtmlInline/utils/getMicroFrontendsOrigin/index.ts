import { findMicroFrontendsOrigin } from './findMicroFrontendsOrigin'

/**
 * `explicitlyProvidedOrigin` takes precedence over everything else,
 * but if it's not defined,
 * we'll make a best guess based on the current origin.
 *
 * If `loadedFrom` is provided, we'll parse the origin from that.
 */
export const getMicroFrontendsOrigin = ({
  explicitlyProvidedOrigin,
  loadedFrom,
  MF_LOCALHOST,
  MF_TLD,
  MF_PROD_ORIGIN,
}: {
  /** If not provided, we'll make our best guess */
  explicitlyProvidedOrigin: string
  /**
   * If `loadedFrom` is provided, it will be used to determine the origin.
   */
  loadedFrom?: string

  MF_LOCALHOST: string
  MF_TLD: string
  /** Fallback if no other methods work */
  MF_PROD_ORIGIN: string
}): {
  /** Like `https://dev-app.mf.com` */
  origin: string
} => {
  if (explicitlyProvidedOrigin) {
    return {
      origin: explicitlyProvidedOrigin,
    }
  }

  const finalOrigin = findMicroFrontendsOrigin({
    loadedFrom,
    MF_LOCALHOST,
    MF_TLD,
    MF_PROD_ORIGIN,
  })

  return {
    origin: finalOrigin,
  }
}
