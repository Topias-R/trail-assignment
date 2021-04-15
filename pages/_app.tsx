import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { AppProps } from 'next/app'
import { CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import store from '../store'

const useStyles = makeStyles({
  '@global': {
    'html, body, body > div:first-child, div#__next, div#__next > div': {
      height: '100%'
    }
  }
})

const CustomApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  useStyles()

  return (
    <>
      <CssBaseline />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default CustomApp
