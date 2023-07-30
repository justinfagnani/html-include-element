import { constructUrl } from '../../../utils/function/constructUrl'

import { doesHostMatchMicroFrontendsTLD } from './doesHostMatchMicroFrontendsTLD'

export const findMicroFrontendsOrigin = ({
  loadedFrom,
  MF_LOCALHOST,
  MF_TLD,
  MF_PROD_ORIGIN,
}: {
  /**
   * `loadedFrom` is only available for script/cdn embeds.
   *
   * This would typically be something like:
   * ```tsx
   * const scriptSrc = document.getElementById(BCO_WIDGET_SCRIPT_ID)?.getAttribute('src');
   *
   * someFunctionCall({
   *   loadedFrom: scriptSrc ? new URL(scriptSrc, appUrl) : undefined,
   * });
   * ```
   */
  loadedFrom: string | undefined
  MF_LOCALHOST: string
  MF_TLD: string
  MF_PROD_ORIGIN: string
}): string => {
  // Prefer getting origin from loadedFrom, to reduce the chance of bugs due to mis-matched expectations when environments have different code
  if (loadedFrom) {
    if (
      loadedFrom.startsWith('/') &&
      !loadedFrom.startsWith('http')
    ) {
      // Typically a merchant would not use a relative url, but we may use one in demos
      console.warn(
        '`loadedFrom` is not a fully qualified url, and cant be used to determine origin.',
      )
    } else {
      return constructUrl(loadedFrom).origin
    }
  }

  if (
    doesHostMatchMicroFrontendsTLD({
      ...window.location,
      MF_LOCALHOST,
      MF_TLD,
    })
  ) {
    return window.location.origin
  }

  console.warn(
    // TODO: Add more helpful suggestions here - and a link to some docs on "Setting MF origin/env"
    `Could not determine mf origin, using prod (${MF_PROD_ORIGIN})`,
  )
  return MF_PROD_ORIGIN
}
