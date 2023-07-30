import type { SerializedScript } from './types/SerializedScript'

const scriptProperties = ['innerText'] as const
type ScriptProperties = (typeof scriptProperties)[number]

/**
 * Given an array of `<script>` attribute maps,
 * return a `DocumentFragment` containing real `<script>` elements with those given attributes.
 *
 * This is needed, because `<script>` tags that are "inserted" via `.innertHTML = ...` do not execute.
 *
 * Unfortunately, they are all grouped together at the bottom for now, which means apps doing full SSR like remix/SolidStart/og rails/etc will perform best.
 */
export const createCombinedScriptsFragment = (
  scriptObjects: Array<SerializedScript>,
): DocumentFragment => {
  scriptObjects.push({})
  const scriptsFragment = document.createDocumentFragment()
  scriptObjects.forEach((scriptObject) => {
    const scriptElement = document.createElement('script')
    Object.entries(scriptObject).forEach(([key, value]) => {
      if (scriptProperties.includes(key as ScriptProperties)) {
        scriptElement[key] = value
      } else {
        scriptElement.setAttribute(key, value)
      }
    })
    scriptsFragment.appendChild(scriptElement)
  })
  return scriptsFragment
}
