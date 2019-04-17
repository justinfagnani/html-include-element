# `<html-include>`

Easily include external HTML into your pages.

## Overview

`<html-include>` is a web component that fetches HTML and includes it into your page.

```html
<html-include src="./my-local-file.html"></html-include>
```

`<html-include>` works with any framework, or no framework at all.

By default `<html-include>` renders the HTML in a shadow root, so it's isolated from the rest of the page. This can be configured with the `no-source` attribute.

## Instalattion 

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
import HTMLIncludeElement from 'html-include-element';
```

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

A boolean attribute, which if present, causes the element to include the fethed HTML into its light DOM children.

## Browser Support

Web components are supported by Chrome, Safari, Firefox, Opera and other Chromium-based browsers including the next version of Edge.

Other browsers, like current versions Edge and older but recent versions of Chrome, Safari, and Firefox, will require the web components polyfills.

IE11 *may* work with the polyfills if this libary is compiled, but that would be accidental: IE is explicitly not supported.

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
