# `<html-include>`

Easily include external HTML into your pages.

## Overview

`<html-include>` is a web component that fetches HTML and includes it into your page.

```html
<html-include src="./my-local-file.html"></html-include>
```

`<html-include>` works with any framework, or no framework at all.

By default `<html-include>` renders the HTML in a shadow root, so it's isolated from the rest of the page. This can be configured with the `no-shadow` attribute.

## Installation 

Install from npm:

```bash
npm i html-include-element
```

Or load from a CDN like unpkg.com: `https://unpkg.com/html-include-element`

## Usage

`<html-include>` is distributed as standard JS modules, which are supported in all current major browsers.

You can load it into a page with a `<script>` tag:

```html
<head>
  <script type="module" src='https://unpkg.com/html-include-element'></script>
</head>
<body>
  <html-include src="./my-local-file.html"></html-include>
</body>
```

Or import into a JavaScript module:

```js
import {HTMLIncludeElement} from 'html-include-element';
```

`<html-include>` fires a `load` even when the included file has been loaded. When including into shadow DOM (the default behavior) the `load` event is fired after any `<link>` elements in the included file have loaded as well.

This allows you to hide the `<html-include>` element and show it after the `load` event fires to avoid flashes of unstyled content.

### Same-origin policy and CORS

`<html-include>` uses the `fetch()` API to load the HTML. This means it uses the same-origin security model and supports CORS. In order to load an external resource it must either be from the same origin as the page, or send CORS headers. You can control the fetch mode with the `mode` attribute.

### Styling included HTML

When included into shadow DOM, the HTML and its styles are isolated from the rest of the page. Main page selectors will not select into the content, and the included HTML can have `<style>` tags which will be scoped and not leak to the rest of the page.

The content can be styled with CSS custom variables and other inheritable properties, like `color` and `font-family`. If the HTML includes elements with `part` attributes, those elements can be styled with the `::part()` selector.

Included HTML can also have `<slot>` elements, which will allow children of `<html-include>` to be projected into the HTML. These can be styled from within the included HTML with the `::slotted()` selector.

If the `no-shadow` attribute is present, then the included HTML can by styled with global styles. Beware though, styles in the included HTML will apply to the whole page.

## Attributes

### `src`

The URL to fetch an HTML document from.

### `mode`

The fetch mode to use: "cors", "no-cors", or "same-origin". See the fetch() documents for more information.

### `no-shadow`

A boolean attribute, which if present, causes the element to include the fetched HTML into its light DOM children.

### `delegates-focus`

A boolean attribute, which if present, causes the element to [delegate focus](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus) to the first focusable element in the shadow root.

## Browser Support

Web components are supported by Chrome, Safari, Firefox, Opera and other Chromium-based browsers including the next version of Edge.

Other browsers, like current versions Edge and older but recent versions of Chrome, Safari, and Firefox, will require the web components polyfills.

IE11 *may* work with the polyfills if this library is compiled, but that would be accidental: IE is explicitly not supported.

The web component polyfills can be loaded from unpkg.com:

```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
```

Or locally:

```bash
npm i @webcomponents/webcomponentsjs
```

```html
<script src="./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js></script>
```

## Support, Maintenance, and Contributions

This is a personal side-project and published basically "as-is". I will try to get CI running, add more tests, and improve the documentation as time permits. PRs welcome, but if I'm not responsive, please feel free to fork.

And no, I will not publish an ES5 version 🤨. Applications can compile to the language level their target browsers support. Bundlers can and should be configured to compile packages in `node_modules` as necessary. 

## Alternate Approaches

I made this project after seeing this blog post on using iframes to implement HTML-include behavior: https://www.filamentgroup.com/lab/html-includes/

That approach uses an iframe to load the external HTML document, then inline script to move the nodes into the main document. I believe the web component approach is far better for a few reasons:

### CSP Compliant 

`onload` attributes are blocked by CSP most policies.

### CORS compatibility

By using `fetch()` we can make a CORS request for the content. A cross-origin iframe will not allow its contents to be accessed from the main page.

For the web components, more options from `fetch()` can be exposed as well, such as `method`, `body`, `integrety`, and `cache`.

### Scripts don't execute

iframes will execute scripts. Cross-origin documents won't be moved into the main page, so their scripts will run to completion. I'm not exactly sure what will happen with same-origin script when they are moved into the main document. It may depend on the presence of other scripts or external resources. Either way, it's a feature that `<html-include>` will not run scripts due to using `innerHTML`.

### Consistent styling

iframes completely isolate the styles of content document from those of the host document. This means that the iframe approach has two completely different styling modes: fully isolated, or absolutely no isolation. Neither is desirable, and the styling behavior will change based on CSP, cross-origin documents, or whether script is enabled.

This web component requires JavaScript, like all web components, but the styling behavior is consistent.

### Controlled styling

Shadow DOM prevents any styles inside the shadow root from applying to the main page, so the included HTML can't pollute the page. The iframe-replacement approach will allow styles in the external document to style anything in the main page.

Shadow DOM allows inherited CSS properties, such as `color`, `font-family`, and all custom variables, to pierce the shadow boundary, so basic content will be consistent with the page. HTML annotated with `part` attributes can be styled from the host page with `::part()` selectors.

### Declarative and self-contained

Having the implementation of the include be re-written for every instance will make the iframe approach difficult to maintain. The web component is self-contained and the implementation can be updated across usages.

### Composition

Since the included HTML is rendered in a shadow root, it can contain `<slot>` elements, allowing the included content to project children from the `<html-include>` into itself. This may be a fringe case, but imaging a CMS system where the content can control where certain host-provided blocks go. I'm very curious to see how this might be used.

Main page:
```html
<html-include>
  <div slot="suggested-articles">...</div>
</html-include>
```

Content:
```html
<article>
  <header>...</header>
  <main>...</main>
  <!-- render suggested articles here -->
  <slot name="suggested-articles"></slot>
  <footer>...</footer>
</article>
```
