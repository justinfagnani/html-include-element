import { getInjectionSiteElement } from '../../../widget-wrapper/remoteOptumBCOWidgetInitializer/getInjectionSiteElement'

import { BCO_HEAD_TAGS_SELECTOR } from './DEAD_noShadowConstants'

export const removeInjectedFragments = ({
  htmlInjectionSiteId,
}: {
  htmlInjectionSiteId: string
}): void => {
  // TODO: These head tags are not uniquely marked with the htmlInjectionSiteId.
  // We should fix that.
  // The value of this BCO_HEAD_TAGS_SELECTOR attr could simply be the htmlInjectionSiteId.
  document.head
    .querySelectorAll(BCO_HEAD_TAGS_SELECTOR)
    .forEach((node) => {
      document.head.removeChild(node)
    })

  getInjectionSiteElement({
    htmlInjectionSiteId,
  }).innerHTML = ''
}
