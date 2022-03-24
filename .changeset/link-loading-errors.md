---
"html-include-element": patch
---

When included HTML files are loaded, their subresources (defined with `<link>`
elements) are loaded as well. If one of those `<link>` elements fails to load,
`<html-include>` will now gracefully fail, logging the failed url and
continuing to load the rest of the HTML file.
