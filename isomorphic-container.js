// isomorphic-container:
//  1. Checks if we are running client side or server side
//  2. If we are running server side, will pre-fetch html and define a `globalThis.bacn.initialHtml` string and `globalThis.bacn.initialHtmlUrl`
//  3. If we are running client side, let things proceed normally.
import { DefineHtmlIncludeElement } from './html-include-element'

if (
  typeof HTMLElement !== 'undefined' &&
  typeof customElements !== 'undefined'
) {
  // Seems to be client side:
  DefineHtmlIncludeElement()
} else {
  console.warn('we appear to be running server side.')
  console.warn(
    'somehow, we need to get the app name and url: <html-include appName="bacon" url="">',
  )
}
