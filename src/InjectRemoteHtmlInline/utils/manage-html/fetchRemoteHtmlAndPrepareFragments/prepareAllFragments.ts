import { prepareHeadOrBodyFragment } from './prepareHeadOrBodyFragment'
import { prepareScriptsFragment } from './prepareScriptsFragment'
import type { PreparedFragments } from './types/PreparedFragments'
import type { HeadAndBodyNodes } from './types/HeadAndBodyNodes'

export const prepareAllFragments = ({
  nodes,
  htmlUrl,
}: {
  nodes: HeadAndBodyNodes
  htmlUrl: string
}): PreparedFragments => {
  const { headNode, bodyNode } = nodes

  const { fragment: headFragment, scripts: headScripts } =
    prepareHeadOrBodyFragment({
      isHead: true,
      node: headNode,
      htmlUrl,
    })
  const { fragment: bodyFragment, scripts: bodyScripts } =
    prepareHeadOrBodyFragment({
      isHead: false,
      node: bodyNode,
      htmlUrl,
    })

  return {
    headFragment,
    bodyFragment,
    scriptsFragment: prepareScriptsFragment([
      ...headScripts,
      ...bodyScripts,
    ]),
  }
}
