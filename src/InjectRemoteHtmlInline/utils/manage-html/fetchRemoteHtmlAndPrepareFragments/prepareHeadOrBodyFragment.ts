import { constructUrl } from '../../../../utils/function/constructUrl'
import {
  BCO_HEAD_TAG_ATTR,
  BCO_HEAD_TAG_ATTR_VALUE,
} from '../DEAD_noShadowConstants'

import type { SerializedScript } from './types/SerializedScript'

export const prepareHeadOrBodyFragment = ({
  isHead,
  node,
  htmlUrl,
}: {
  isHead: boolean
  node: HTMLHeadElement | HTMLBodyElement
  /** Used as a basis for converting relative urls inside script src and link href attributes into absolute urls */
  htmlUrl: string
}): {
  fragment: DocumentFragment
  scripts: Array<SerializedScript>
} => {
  const fragment = document.createDocumentFragment()
  if (isHead) {
    fragment.appendChild(
      document.createComment(
        ` START <head> tags from ${htmlUrl} `,
      ),
    )
  }
  const scripts = [] as Array<SerializedScript>
  /** "hosted" only tags are tags meant the micro-frontend if it's loading as-is, i.e. via a browser popup or webview. */
  let amSkippingHostedOnlyTags = false
  node.childNodes.forEach((childNode) => {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const element = childNode as Element
      const tagName = element.tagName.toLowerCase()

      if (isHead) {
        if (tagName === 'meta') {
          const metaTagName = element
            .getAttribute('name')
            ?.toLowerCase()
          if (metaTagName === 'mf-hosted-only-tags-start') {
            amSkippingHostedOnlyTags = true
            return // Skip this meta tag.
          }
          if (metaTagName === 'mf-hosted-only-tags-end') {
            amSkippingHostedOnlyTags = false
            return // Skip this meta tag
          }
        }
        if (amSkippingHostedOnlyTags) return

        if (tagName === 'link') {
          const linkHref = element.getAttribute('href')
          if (linkHref && linkHref.indexOf('http') < 0) {
            element.setAttribute(
              'href',
              constructUrl(linkHref, htmlUrl).toString(),
            )
          }
        }

        // Mark all our head tags for easy removal later:
        // Only relevant for `noShadow` mode, which isn't supported right now.
        // element.setAttribute(
        //   BCO_HEAD_TAG_ATTR,
        //   BCO_HEAD_TAG_ATTR_VALUE,
        // )
      }

      if (tagName === 'script') {
        const scriptElement = element as HTMLScriptElement
        // Copy all attributes:
        const serializedScript: SerializedScript = {}
        scriptElement
          .getAttributeNames()
          .forEach((attributeName) => {
            const value =
              scriptElement.getAttribute(attributeName)
            if (value) {
              serializedScript[attributeName] = value
            }
          })

        const scriptSrc = serializedScript.src
        if (scriptSrc) {
          if (
            // appears to be relative
            !scriptSrc.startsWith('http') &&
            !scriptSrc.startsWith('://')
          ) {
            serializedScript.src = constructUrl(
              scriptSrc,
              htmlUrl,
            ).toString()
          }
          serializedScript.crossorigin = ''
        } else {
          serializedScript.innerText = scriptElement.innerText
        }

        scripts.push(serializedScript)
        // Don't append to fragment, browser won't execute these since it's derived from .innerHTML
        return
      }
    }

    // Simply append each node
    fragment.appendChild(childNode)
  })
  if (isHead) {
    fragment.appendChild(
      document.createComment(
        ` END <head> tags from ${htmlUrl} `,
      ),
    )
  }

  return {
    fragment,
    scripts,
  }
}
