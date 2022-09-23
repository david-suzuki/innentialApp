import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

// Internet Explorer polyfills
// import 'core-js/fn/symbol'

import { ApolloProvider } from 'react-apollo'
import { Route, Router, Switch, withRouter } from 'react-router-dom'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'
import apolloClient from './apollo'
import App from './App'
import {
  Login,
  Logout,
  PasswordGetLink,
  PasswordSetPassword,
  PublicRegistration,
  BadLinkPage,
  InvitationLanding
} from './components'
import {
  captureFilteredError,
  ErrorBoundary,
  ErrorPage
} from './components/general'
import { unregister } from './registerServiceWorker'
import history from './history'
import elementStyle from './styles/elementStyle'
import globalStyle from './styles/globalStyle'
import './styles/icons/iconFontface.css'
import './styles/icons/iconFontface2.css'
import './styles/icons/iconFontface3.css'

import {
  EmployeeAcceptInvitation,
  PublicAcceptInvitation,
  OnboardingManager
} from './components/user-onboarding'

import Container from './globalState'

import * as Sentry from '@sentry/browser'
// import ReactPiwik from 'react-piwik'
import ReactGA from 'react-ga'
import GA4React from 'ga-4-react'
import FeedbackLanding from './components/_publicFeedbackLanding'
import { monkeyPatchGoogleTranslate } from './utils'

const staging = process.env.REACT_APP_STAGING
const development = process.env.NODE_ENV !== 'production'

if (module.hot) {
  module.hot.accept()
}

monkeyPatchGoogleTranslate()

if (!development && !staging)
  Sentry.init({
    dsn: 'https://f154667b8ec143fba55a765d4b75c77d@sentry.io/1429360'
  })

if (!development) {
  ;(async () => {
    // UNIVERSAL ANALYTICS (OLD VERSION)
    // const trackingId = staging ? 'UA-107489291-3' : 'UA-107489291-4'

    // INITIALIZE ANALYTICS
    // ReactGA.initialize(trackingId)
    // IP ANONYMIZATION
    // ReactGA.set({ anonymizeIp: true })

    // GA4 (NEW VERSION)
    const measurementId = staging ? 'G-0PFR9QH9P5' : 'G-MB9BLYNGLV'

    const ga4React = new GA4React(measurementId)

    let ga4

    // INITIALIZE ANALYTICS 4
    try {
      ga4 = await ga4React.initialize()
      ga4.gtag('config', measurementId, { anonymize_ip: true })
    } catch (err) {
      captureFilteredError(`Could not initialize GA4: ${err.message}`)
    }
    // ga4React.initialize().then(
    //   ga4 => {
    //     // CONNECT TO ROUTER
    //     history.listen(location => {
    //       ReactGA.pageview(location.pathname)
    //       ga4.pageview(location.pathname)
    //     })
    //   },
    //   err => captureFilteredError(`Could not initialize new analytics: ${err}`)
    // )
  })()
}

//  // uncomment these for local tests

// piwik = new ReactPiwik({
//   url: 'https://innential.matomo.cloud',
//   siteId: 2 // staging
// })

// track the initial pageview

const ScrollToTop = withRouter(function({ history }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [])

  return null
})

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ErrorBoundary>
      <Container.Provider
        initialState={{ viewingPeople: false, activeProfileTab: 'Skills' }}
      >
        <Router history={history}>
          <div className='container'>
            <ScrollToTop />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/logout' component={Logout} />
              <Route exact path='/register' component={PublicRegistration} />
              <Route
                exact
                path='/reset-password/:resetId'
                component={PasswordSetPassword}
              />
              <Route
                exact
                path='/forgot-password'
                component={PasswordGetLink}
              />
              <Route
                exact
                path='/accept-invitation/:pendingInvitation'
                component={EmployeeAcceptInvitation}
              />
              <Route
                exact
                path='/acceptinvitation/:pendingInvitation'
                component={PublicAcceptInvitation}
              />
              <Route path='/public-feedback'>
                <FeedbackLanding />
              </Route>
              <Route path='/invite'>
                <InvitationLanding />
              </Route>
              <Route path='/bad-aws-link' component={() => <BadLinkPage />} />
              <Route path='/onboarding' component={OnboardingManager} />
              <Route exact path='/error-page/:error' component={ErrorPage} />
              <Route path='/' component={hot(App)} />
            </Switch>
            <Alert stack={{ limit: 3 }} />

            <style jsx global>{`
              *,
              *::before,
              *::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                display: flex;
                font-family: Helvetica;
                overflow-x: hidden;
              }
              #root,
              .container {
                min-width: 100%;
                display: flex;
                flex: 1;

                flex-direction: column;
                flex-basis: 100%;
              }
              .footer {
                margin: 2em auto;
              }
            `}</style>
            <style jsx global>
              {elementStyle}
            </style>
            <style jsx global>
              {globalStyle}
            </style>
          </div>
        </Router>
      </Container.Provider>
    </ErrorBoundary>
  </ApolloProvider>,
  document.getElementById('root')
)

unregister()
