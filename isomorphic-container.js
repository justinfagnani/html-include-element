// isomorphic-container:
//  1. Checks if we are running client side or server side
//  2. If we are running server side, will pre-fetch html and define a `globalThis.bacn.initialHtml` string and `globalThis.bacn.initialHtmlUrl`
//  3. If we are running client side, let things proceed normally.
