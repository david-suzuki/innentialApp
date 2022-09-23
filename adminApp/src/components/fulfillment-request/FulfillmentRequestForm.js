import { useMutation } from '@apollo/react-hooks'
import { Button, Input, Loading, Message, MessageBox } from 'element-react'
import React, { useEffect, useState } from 'react'
import {
  generateCredentialsForLearning,
  fetchFulfillmentRequest,
  completeFulfillmentRequest
} from '../../api'
import { TextEditor } from '../misc'

const selectAndCopyToClipboard = async (e, value) => {
  e.target.select()
  if (value) {
    try {
      await window.navigator.clipboard.writeText(value)
      Message({
        type: 'info',
        message: 'Copied to clipboard'
      })
    } catch (e) {
      console.error('Could not copy to clipboard')
    }
  }
}

const handleCompletingRequest = async ({ requestId, note, mutate }) => {
  if (!note) {
    try {
      await MessageBox.confirm(
        'Are you sure you want to complete this request without a note?',
        'No note added',
        {
          type: 'warning',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }
      )
    } catch (e) {
      // CANCELLED
      return
    }
  }
  try {
    await mutate({
      variables: {
        requestId,
        note
      }
    })
    Message({
      type: 'success',
      message: 'Request fulfilled!'
    })
  } catch (e) {
    Message({
      type: 'error',
      message: e.message
    })
  }
}

const awinWhitelist = ['www.edx.org']

const checkAwinException = url => {
  return awinWhitelist.includes(new URL(url).hostname)
}

const FulfillmentRequestForm = ({ request, history }) => {
  const {
    _id: requestId,
    fulfilled,
    content: { title, url },
    user,
    learningCredentials,
    note: initialNote
  } = request

  const isAwinException = checkAwinException(url)

  const [note, setNote] = useState(initialNote)

  const [mutate, { loading }] = useMutation(generateCredentialsForLearning, {
    variables: {
      user: user._id
    },
    update: (proxy, { data: { generateCredentialsForLearning: result } }) => {
      try {
        const { fetchFulfillmentRequest: prevRequest } = proxy.readQuery({
          query: fetchFulfillmentRequest,
          variables: { requestId }
        })

        proxy.writeQuery({
          query: fetchFulfillmentRequest,
          variables: { requestId },
          data: {
            fetchFulfillmentRequest: {
              ...prevRequest,
              learningCredentials: result
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  })

  const [completeMutation, { loading: loadingComplete }] = useMutation(
    completeFulfillmentRequest
  )

  useEffect(() => {
    if (!learningCredentials && !loading) {
      ;(async () => {
        try {
          await mutate()
        } catch (err) {
          console.error(err)
        }
      })()
    }
  }, [learningCredentials, loading])

  useEffect(() => {
    // IMPACT TRANSFORM LINKS
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])

  if (fulfilled) {
    return (
      <div>
        <h4>Request for item:</h4>
        <h1>{title}</h1>
        <h4>for:</h4>
        <h1>
          {user.firstName} {user.lastName} ({user.email})
        </h1>
        <div style={{ maxWidth: '700px', margin: '40px 0' }}>
          <h4>Credentials: </h4>
          {learningCredentials && (
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <Input
                value={learningCredentials.email}
                readOnly
                onFocus={e =>
                  selectAndCopyToClipboard(e, learningCredentials.email)
                }
              />
              <Input
                value={learningCredentials.password}
                readOnly
                onFocus={e =>
                  selectAndCopyToClipboard(e, learningCredentials.password)
                }
              />
            </div>
          )}
          {initialNote && (
            <>
              <h4>Instructions for user: </h4>
              <div
                className='fulfillment-request__note'
                dangerouslySetInnerHTML={{
                  __html: initialNote
                }}
              />
            </>
          )}
        </div>
        <Button size='large' onClick={history.goBack}>
          Go back
        </Button>
        <style>{`
          h4 {
            margin-bottom: 12px;
          }

          h1 {
            margin-bottom: 20px;
          }

          .fulfillment-request__note {
            padding: 20px;
            border: 1px solid black;
          }

          .fulfillment-request__note > ul {
            padding-left: 20px;
          }

          .fulfillment-request__note > ol {
            padding-left: 20px;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      <h4>Reviewing request for item:</h4>
      <h1>{title}</h1>
      <h4>for:</h4>
      <h1>
        {user.firstName} {user.lastName} ({user.email})
      </h1>
      <div style={{ maxWidth: '700px', margin: '40px 0' }}>
        <h4>Affiliate (if existing) URL: </h4>
        <a
          href={url}
          {...(!isAwinException && { 'data-awinignore': true })}
          target='_blank'
        >
          <Button type='primary' size='large'>
            Click here to open in new tab
          </Button>
        </a>
        <br />
        <br />
        <h4>Use these credentials: </h4>
        {learningCredentials && (
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <Input
              value={learningCredentials.email}
              readOnly
              onFocus={e =>
                selectAndCopyToClipboard(e, learningCredentials.email)
              }
            />
            <Input
              value={learningCredentials.password}
              readOnly
              onFocus={e =>
                selectAndCopyToClipboard(e, learningCredentials.password)
              }
            />
          </div>
        )}
        {loading && (
          <div style={{ height: '40px' }}>
            <Loading />
          </div>
        )}
        <h4>
          Add instructions for user how to access the new item (will be shown in
          email & the app)
        </h4>
        <TextEditor value={note} handleChange={setNote} />
      </div>
      <Button size='large' onClick={history.goBack}>
        Go back
      </Button>
      <Button
        size='large'
        type='success'
        onClick={() =>
          handleCompletingRequest({
            requestId,
            note,
            mutate: completeMutation
          })
        }
        loading={loadingComplete}
      >
        Complete request
      </Button>
      <style>{`
        h4 {
          margin-bottom: 12px;
        }

        h1 {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  )
}

export default FulfillmentRequestForm
