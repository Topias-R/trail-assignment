import React, { useEffect } from 'react'
import * as Redux from 'react-redux'
import { AppProps } from 'next/app'
import { CssBaseline } from '@material-ui/core'

import store from '../store'

import * as URQL from 'urql'

const client = URQL.createClient({
  url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
})

const CustomApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <CssBaseline />
      <Redux.Provider store={store}>
        <URQL.Provider value={client}>
          <Component {...pageProps} />
        </URQL.Provider>
      </Redux.Provider>
    </>
  )
}

export default CustomApp
