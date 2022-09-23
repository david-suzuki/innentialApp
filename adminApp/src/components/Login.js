import React from 'react'
import { compose, withHandlers, withState } from 'recompose'
import { graphql, useApolloClient } from 'react-apollo'
import Alert from 'react-s-alert'
import { loginMutation } from '../api'
import { hashString } from '../utils'

const withLoginMutation = graphql(loginMutation)

const recomposeStates = compose(
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', '')
)

const recomposeHandlers = withHandlers({
  submitLogin: ({ mutate, email, password, history }) => e => {
    e.preventDefault()
    if (email !== 'kris@waat.eu') return
    mutate({
      variables: {
        UserCredentials: {
          email,
          password: hashString(password).digest
        }
      }
    })
      .then(() => {
        history.push('/')
        Alert.success('Login successful', {
          position: 'top',
          effect: 'stackslide',
          timeout: 1500
        })
      })
      .catch(e =>
        Alert.error('The credentials combination is wrong', {
          position: 'bottom'
        })
      )
  }
})

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  submitLogin,
  history
}) => {
  const client = useApolloClient()
  client.resetStore()
  return (
    <div className='login-wrapper'>
      <h1>Login</h1>
      <form className='login-form' onSubmit={submitLogin}>
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type='submit'
          className={`submit-button ${
            email === '' || password === '' ? 'disabled' : ''
          }`}
        >
          Submit
        </button>
      </form>
      <style jsx>{`
        .login-wrapper {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .login-form > input {
          font-size: 1.5em;
          margin-top: 1em;
          border-radius: 0.45em;
          height: 3.5em;
          width: 20em;
          max-width: 300px;
          border: 1px solid silver;
          padding-left: 0.45em;
        }
        input:focus {
          outline: none;
          border-color: #719ece;
          box-shadow: 0 0 10px #719ece;
        }
        .submit-button {
          margin-top: 3.5em;
          background-color: steelblue;
          border-radius: 1.5em;
          width: 15em;
          max-width: 200px;
          height: 2em;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .submit-button.disabled {
          background-color: silver;
          opacity: 0.5;
          pointer-events: none;
        }

        .submit-button > span {
          color: #fff;
        }
      `}</style>
    </div>
  )
}

export default compose(
  withLoginMutation,
  recomposeStates,
  recomposeHandlers
)(Login)
