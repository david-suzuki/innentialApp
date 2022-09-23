import React from 'react'
import { Page } from './ui-components'
import { Link } from 'react-router-dom'

export default () => (
  <Page>
    <img
      className='logo--bad-link'
      alt='Innential Logo'
      src={require('../static/innential-logo.svg')}
    />
    <br />
    <div
      style={{
        margin: 'auto',
        height: 90,
        width: 360,
        fontSize: '13px',
        textAlign: 'center'
      }}
    >
      <h1>Not found</h1>
      The item you're looking for no longer exists <br />
      We apologize for any inconvenience <br />
      <br />
      <Link to='/'>
        <a>Back to home page</a>
      </Link>
    </div>
  </Page>
)
