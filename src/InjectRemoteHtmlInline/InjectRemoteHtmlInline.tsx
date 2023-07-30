import React, { useEffect, useState } from 'react'

import ErrorCard from '../components/ErrorCard/ErrorCard'
import {
  BCO_INITIAL_URL_QUERY_PARAM_KEY,
  BCO_WIDGET_INJECTION_ID_ATTR,
} from '../ssrCapableEmbed/constants'
import type { ALL_ENV } from '../utils/constants'
import { concatUrlStrict } from '../utils/concatUrlStrict'
import { generateHtmlInjectionSiteElement } from '../widget-wrapper/remoteOptumBCOWidgetInitializer/generateHtmlInjectionSiteId'

import type { PublicUiRoute } from './types/PublicUiRoute'
import { fetchRemoteHtmlAndPrepareFragments } from './utils/manage-html/fetchRemoteHtmlAndPrepareFragments/REPLACED_index'
import { noShadowAppendHtmlFragments } from './utils/manage-html/fetchRemoteHtmlAndPrepareFragments/DEAD_noShadowAppendHtmlFragments'
import { removeInjectedFragments } from './utils/manage-html/DEAD_noShadowRemoveInjectedFragments'
import { findMicroFrontendsOrigin } from './utils/getMicroFrontendsOrigin'

// TODO: remove react dependency? or just reduce dependency on react?

/**
 * Think of this like an iframe,
 * but it doens't actually use `<iframe>` html tag.
 *
 * It's a "react-shim" for the inject-html script.
 * Both shims call `fetchRemoteHtmlAndPrepareFragments`
 */
export const InjectRemoteHtmlInline = React.memo(
  ({
    explicitEnv,
    providedOrigin,
    pathname = '/',
    params: _params,
  }: Omit<PublicUiRoute, 'origin'> & {
    explicitEnv?: ALL_ENV | undefined
    providedOrigin?: string
  }) => {
    const [htmlInjectionSiteId] = useState(
      generateHtmlInjectionSiteElement(),
    )
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error>()

    const params = { ..._params }

    const { env: finalEnv, origin: finalOrigin } =
      findMicroFrontendsOrigin({
        explicitEnv: explicitEnv || params.appEnv,
        explicitlyProvidedOrigin: providedOrigin,
        loadedFrom: undefined,
      })

    if (finalEnv) {
      params.appEnv = finalEnv
    }

    if (params[BCO_INITIAL_URL_QUERY_PARAM_KEY]) {
      throw new Error(
        `"${BCO_INITIAL_URL_QUERY_PARAM_KEY}" should not be passed in via 'params'`,
      )
    }

    const appUrl = concatUrlStrict({
      origin: finalOrigin,
      pathname,
      orderedParams: [...Object.entries(params)],
    })

    useEffect(() => {
      // TODO? Pass in htmlInjectionSiteId? to unique mark the head tags? then can remove BCO_HEAD_TAG_ATTR_VALUE
      fetchRemoteHtmlAndPrepareFragments(appUrl)
        .then((preparedFragments) => {
          noShadowAppendHtmlFragments({
            ...preparedFragments,
            htmlInjectionSiteId,
          })
        })
        .catch(() => {
          setError(
            new Error(`failed to get html from "${appUrl}"`),
          )
        })
        .finally(() => {
          setIsLoading(false)
        })

      // TODO: put this in a proper "unmount" hook?
      return () => {
        console.log(
          'InjectRemoteHtmlInline was unmounted, removing all injected html tags.',
        )

        removeInjectedFragments({ htmlInjectionSiteId })
      }
    }, [])

    return (
      <div data-name="InjectRemoteHtmlInline-container">
        {isLoading ? (
          <div>
            Fetching html from{' '}
            <a target="_blank" href={appUrl} rel="noreferrer">
              {appUrl}
            </a>
            ...
          </div>
        ) : error ? (
          <ErrorCard
            title={error.message}
            description={error.stack}
          />
        ) : (
          <div>Widget should be rendering below:</div>
        )}
        <div
          {...{
            [BCO_WIDGET_INJECTION_ID_ATTR]: htmlInjectionSiteId,
          }}
        />
      </div>
    )
  },
)
