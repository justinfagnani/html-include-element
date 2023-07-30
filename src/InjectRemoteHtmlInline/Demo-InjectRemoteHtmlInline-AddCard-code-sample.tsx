// Add card as a plain component:
import React from 'react'

// import InjectRemoteHtmlInline from '@optum-mf/src/InjectRemoteHtmlInline'
import { InjectRemoteHtmlInline } from './InjectRemoteHtmlInline'

export default function demo() {
  return (
    <InjectRemoteHtmlInline
      pathname="/add-payment-method-v2"
      explicitEnv={'dev' as const}
      // url="BCO_ORIGIN/add-card.html"
      // onComplete={() => setState? navigate(/?) }
    />
  )
}

// import AddCard from '@optum-mf/src/components/AddCard'

// <AddCard onComplete={() => setState? navigate(/?) } />

// onComplete will always save to backend, but regarding callback can determine (or override) ui flow)

// For CDN:

// Need “react wrapper” - bundles react and react-dom

// Already have <CheckoutContainerWrapper

// React props need to be overridable/settable via global function call:

// renderToDom(window.mf.AddCard, domNode, componentProps) ???
