import type { PreparedFragments } from './types/PreparedFragments'

// This may be useful for a micro-frontend that is not using shadow dom.
export const noShadowAppendHtmlFragments = ({
  headFragment,
  bodyFragment,
  scriptsFragment,
  shadowRoot,
}: PreparedFragments & {
  shadowRoot: ShadowRoot
}): void => {
  if (document.head.firstElementChild) {
    // As a micro-frontend, outside of shadow dom, we're going to inject our stylesheets _before_ any others,
    // allowing the consuming/parent app to override our styles.
    //
    // While there could be an option to inject stylesheets _after_ others,
    document.head.insertBefore(
      headFragment,
      document.head.firstElementChild,
    )
  } else {
    document.head.appendChild(headFragment)
  }

  const bcoWidgetRootNode =
    shadowRoot /* getInjectionSiteElement({
    htmlInjectionSiteId,
  }) */
  bcoWidgetRootNode.appendChild(bodyFragment)
  bcoWidgetRootNode.appendChild(scriptsFragment)
}
