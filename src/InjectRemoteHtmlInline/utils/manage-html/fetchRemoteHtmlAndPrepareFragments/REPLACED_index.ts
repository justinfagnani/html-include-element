import { constructUrl } from '../../../../utils/function/constructUrl'

import { getPrimaryHtmlNodes } from './getHeadAndBodyNodes'
import { prepareAllFragments } from './prepareAllFragments'
import type { PreparedFragments } from './types/PreparedFragments'

/**
 * Fetches the html from the given url,
 * parses it,
 * filters out some tags from <head> which are meant only for a "hosted site",
 * transforms relative urls to absolute urls in script src + link href attributes,
 * and returns the <head> and <body> tags as DocumentFragments to be appended to the current document.
 */
export const fetchRemoteHtmlAndPrepareFragments = async (
  htmlUrl: string,
): Promise<PreparedFragments> => {
  // validate it:
  constructUrl(htmlUrl)
  console.log('fetching ', htmlUrl)
  const response = await fetch(htmlUrl, {
    method: 'GET', // mimic a browser
    mode: 'cors',
    cache: 'no-store', // never cache, never store, don't even think about caching it. This is html.
    credentials: 'include', // Customize for the user if they are logged in? or use 'omit' or 'same-origin'?
  })
  const html = await response.text()
  console.log('html', html.slice(0, 100) + '...')

  return prepareAllFragments({
    nodes: getPrimaryHtmlNodes(html),
    htmlUrl,
  })
}
