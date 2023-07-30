import type { HeadAndBodyNodes } from './types/HeadAndBodyNodes'

const validateElement = (
  node: Element | null,
  tagName: string,
): node is Element => {
  if (!node) {
    throw new Error(`No ${tagName} in html`)
  }
  if (node.tagName.toLowerCase() !== tagName.toLowerCase()) {
    throw new Error(
      `Expected ${tagName}Node's .tagName property should be ${tagName.toLowerCase()} but is ${node.tagName.toLowerCase()}`,
    )
  }

  return true
}

export const getPrimaryHtmlNodes = (
  html: string,
): HeadAndBodyNodes => {
  const fullDoc = document.createElement('html')

  // We could explore alternate approaches here: https://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements
  //
  // Regarding security:
  //   We could use DOMPurify or chrome's new `.setHTML` api to sanitize the html,
  //   but we are straight-up executing all scripts.
  //   (Additionally, we'd need to parse the html for scripts before sanitizing, so we can execute them later.)
  //   If an attacker can inject some `<img src="" onerror="alert('xss')">` into the html,
  //   they can also inject `<script>alert('xss')</script>`.
  //
  //   TL;DR: The point _is to execute arbitrary scripts from the micro-frontend_.
  //   If you don't trust the micro-frontend, don't load it.
  fullDoc.innerHTML = html

  const headNode = fullDoc.querySelector('head')
  const bodyNode = fullDoc.querySelector('body')

  validateElement(headNode, 'head')
  validateElement(bodyNode, 'body')
  if (!(headNode instanceof HTMLHeadElement)) {
    throw new Error(
      'headNode is not an instanceof HTMLHeadElement',
    )
  }

  if (!(bodyNode instanceof HTMLBodyElement)) {
    throw new Error(
      'bodyNode is not an instanceof HTMLBodyElement',
    )
  }

  return { headNode, bodyNode }
}
