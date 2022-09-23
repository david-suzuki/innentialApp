import { hot } from 'react-hot-loader/root'

import React from 'react'
import ReactDOM from 'react-dom'

import { Helmet } from 'react-helmet'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'
import apolloClient from './apollo'
import App from './App'
import { Login } from './components'
import { ErrorBoundary, ErrorPage } from './components/general'
import { unregister } from './registerServiceWorker'
import { i18n } from 'element-react'
import locale from 'element-react/src/locale/lang/en'

// Changing Element's language to English
i18n.use(locale)

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props => (
//       <Authenticate>
//         <Component {...props} />
//       </Authenticate>
//     )}
//   />
// )

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ErrorBoundary>
      <Router>
        <div className='container'>
          <Helmet>
            <title>Innential</title>
          </Helmet>
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/error-page/:error' component={ErrorPage} />
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
            html {
              height: 100%;
            }
            body {
              min-height: 100%;
              display: flex;
              font-family: Helvetica;
            }
            #root,
            .container {
              min-height: 100%;
              min-width: 100%;
              display: flex;
              justify-content: space-between;
            }
            .button + .button {
              margin-left: 20px;
            }
            .footer {
              margin: 2em auto;
            }
          `}</style>
        </div>
      </Router>
    </ErrorBoundary>
  </ApolloProvider>,
  document.getElementById('root')
)

unregister()
