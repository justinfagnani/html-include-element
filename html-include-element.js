import { getPrimaryHtmlNodes } from './src/InjectRemoteHtmlInline/utils/manage-html/fetchRemoteHtmlAndPrepareFragments/getHeadAndBodyNodes'
import { prepareAllFragments } from './src/InjectRemoteHtmlInline/utils/manage-html/fetchRemoteHtmlAndPrepareFragments/prepareAllFragments'

const LINK_LOAD_SUPPORTED = 'onload' in HTMLLinkElement.prototype

/**
 * Firefox may throw an error when accessing a not-yet-loaded cssRules property.
 * @param {HTMLLinkElement} link - foo
 * @return {boolean}
 */
function isLinkAlreadyLoaded(link) {
  try {
    return !!(link.sheet && link.sheet.cssRules)
  } catch (error) {
    if (
      error.name === 'InvalidAccessError' ||
      error.name === 'SecurityError'
    )
      return false
    else throw error
  }
}

/**
 * Resolves when a `<link>` element has loaded its resource.
 * Gracefully degrades for browsers that don't support the `load` event on links.
 * in which case, it immediately resolves, causing a FOUC, but displaying content.
 * resolves immediately if the stylesheet has already been loaded.
 * @param  {HTMLLinkElement} link
 * @return {Promise<StyleSheet>}
 */
async function linkLoaded(link) {
  return new Promise((resolve, reject) => {
    if (!LINK_LOAD_SUPPORTED) resolve()
    else if (isLinkAlreadyLoaded(link)) resolve(link.sheet)
    else {
      link.addEventListener('load', () => resolve(link.sheet), {
        once: true,
      })
      link.addEventListener('error', reject, { once: true })
    }
  })
}

/**
 * Embeds HTML into a document.
 *
 * The HTML is fetched from the URL contained in the `src` attribute, using the
 * fetch() API. A 'load' event is fired when the HTML is updated.
 *
 * The request is made using CORS by default. This can be chaned with the `mode`
 * attribute.
 *
 * By default, the HTML is embedded into a shadow root. If the `no-shadow`
 * attribute is present, the HTML will be embedded into the child content.
 *
 */
export class HTMLIncludeElement extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'mode', 'no-shadow']
  }

  /**
   * The URL to fetch an HTML document from.
   *
   * Setting this property causes a fetch the HTML from the URL.
   */
  get src() {
    return this.getAttribute('src')
  }

  set src(value) {
    this.setAttribute('src', value)
  }

  /**
   * The fetch mode to use: "cors", "no-cors", or "same-origin".
   * See the fetch() documents for more information.
   *
   * Setting this property does not re-fetch the HTML.
   */
  get mode() {
    return this.getAttribute('mode')
  }

  set mode(value) {
    this.setAttribute('mode', value)
  }

  /**
   * If true, replaces the innerHTML of this element with the text response
   * fetch. Setting this property does not re-fetch the HTML.
   */
  get noShadow() {
    return this.hasAttribute('no-shadow')
  }

  set noShadow(value) {
    if (!!value) {
      this.setAttribute('no-shadow', '')
    } else {
      this.removeAttribute('no-shadow')
    }
  }

  constructor() {
    super()
    this.attachShadow({
      mode: 'open',
      delegatesFocus: this.hasAttribute('delegates-focus'),
    })
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
    `
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src') {
      let text = ''
      try {
        const mode = this.mode || 'cors'
        // Later on, to support streaming SSR: https://developer.chrome.com/articles/fetch-streaming-requests/#previously-on-the-exciting-adventures-of-fetch-streams
        const response = await fetch(newValue, {
          mode,
          method: 'GET', // mimic a browser
          cache: 'no-store', // never cache, never store, don't even think about caching it. This is html.
          credentials: 'include', // Customize for the user if they are logged in? or use 'omit' or 'same-origin'? https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        })
        if (!response.ok) {
          throw new Error(
            `html-include fetch failed: ${response.statusText}`,
          )
        }
        text = await response.text()
        if (this.src !== newValue) {
          // the src attribute was changed before we got the response, so bail
          return
        }
      } catch (e) {
        console.error(e)
      }
      // Don't destroy the light DOM if we're using shadow DOM, so that slotted content is respected
      // if (this.noShadow) this.innerHTML = text
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
        </style>
      `

      // append nodes: scripts and the like.
      const preparedFragments = prepareAllFragments({
        nodes: getPrimaryHtmlNodes(text),
        htmlUrl: newValue,
      })

      this.shadowRoot.appendChild(preparedFragments.headFragment)
      this.shadowRoot.appendChild(preparedFragments.bodyFragment)
      this.shadowRoot.appendChild(
        preparedFragments.scriptsFragment,
      )

      if (this.noShadow) {
        // If we're not using shadow DOM, then the consuming root
        // is responsible to load its own resources.
        // We therefore don't care about waiting for all resources to finish loading.
      } else {
        await Promise.all([
          Promise.all(
            Array.from(
              this.shadowRoot.querySelectorAll('link'),
            ).map(linkLoaded),
          ).then(() => {
            this.dispatchEvent(new Event('stylesheets-loaded'))
          }),
          Promise.all(
            Array.from(
              this.shadowRoot.querySelectorAll('script'),
            ).map(scriptLoaded),
          ).then(() => {
            this.dispatchEvent(new Event('scripts-loaded'))
          }),
          Promise.all(
            Array.from(
              this.shadowRoot.querySelectorAll('img'),
            ).map(imageLoaded),
          ).then(() => {
            this.dispatchEvent(new Event('images-loaded'))
          }),
        ])
      }

      this.dispatchEvent(new Event('load'))
    }
  }
}
customElements.define('html-include', HTMLIncludeElement)
