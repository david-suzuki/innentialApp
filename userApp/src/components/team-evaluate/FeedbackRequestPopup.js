import React, { useState, useEffect } from 'react'
import { Button, Input, Notification, Dialog, Switch } from 'element-react'
import { UserItems, List, Statement, BodyPortal } from '../ui-components'
import { useMutation, useQuery } from 'react-apollo'
import {
  generateUserFeedbackLinks,
  requestUserFeedback,
  fetchUserPeerFeedbackRequests,
  generateTeamFeedbackLinks,
  fetchCurrentUserEmployeesWithoutImage
} from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { remapEmployeesForUI } from '../teams/_teamUtils'

const filterUsers = (users, searchString) => {
  const regex = new RegExp(
    `${searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, //eslint-disable-line
    'i'
  )
  const filteredUsers = users
    .map(({ name, profession, email, ...user }) => {
      let points = 0
      if (regex.test(name)) points++
      if (regex.test(profession)) points++
      if (regex.test(email)) points++
      return {
        ...user,
        name,
        profession,
        email,
        points
      }
    })
    .filter(({ points }) => points > 0)

  filteredUsers.sort((a, b) => b.points - a.points)

  return filteredUsers
}

const RequestButton = ({ handleClick }) => {
  const [disabled, setDisabled] = useState(false)
  return (
    <Button
      type='text'
      disabled={disabled}
      onClick={() => {
        handleClick()
        setDisabled(true)
      }}
    >
      {disabled ? (
        <span>
          <i className='icon icon-check-small' /> Requested
        </span>
      ) : (
        'Request'
      )}
    </Button>
  )
}

export default ({
  publicLink,
  // initialExternalLink,
  visible,
  setVisible,
  teamId,
  currentUser = {}
}) => {
  // const [feedbackLink, setFeedbackLink] = useState(initialLink)
  const [searchString, setSearchString] = useState('')
  // const [externalLink, setExternalLink] = useState(currentUser.publicLink)

  const mutationDoc = teamId
    ? generateTeamFeedbackLinks
    : generateUserFeedbackLinks
  // const mutationName = teamId
  //   ? 'generateTeamFeedbackLinks'
  //   : 'generateUserFeedbackLinks'

  const [mutate, { loading: linkLoading }] = useMutation(mutationDoc, {
    variables: teamId ? { teamId } : null
    // refetchQueries: ['currentUser']
  })

  useEffect(() => {
    if (!publicLink?.link && !linkLoading)
      mutate()
        // .then(({ data: { [mutationName]: result } }) => {
        //   setFeedbackLink(result)
        // })
        .catch(err => {
          captureFilteredError(err)
        })
  }, [linkLoading, publicLink])

  const { data, loading: employeesLoading, error } = useQuery(
    fetchCurrentUserEmployeesWithoutImage
  )

  if (error) captureFilteredError(error)

  const employees =
    !error && data && data.fetchCurrentUserOrganization
      ? data.fetchCurrentUserOrganization.employees.map(employee => {
          return { ...employee, imageLink: null }
        })
      : []
  const filteredEmployees = employees.filter(
    ({ _id }) => _id !== currentUser._id
  )

  const [request] = useMutation(requestUserFeedback, {
    update: (proxy, { data: { requestUserFeedback: employees } }) => {
      try {
        proxy.writeQuery({
          query: fetchUserPeerFeedbackRequests,
          ...(teamId && {
            variables: {
              userId: teamId
            }
          }),
          data: {
            fetchUserPeerFeedbackRequests: employees
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  })

  const handleRequesting = userId => {
    request({
      variables: {
        userId,
        teamId
      }
    })
      .then(() => {
        Notification({
          type: 'success',
          message: 'Request sent!',
          duration: 2500,
          offset: 90
        })
      })
      .catch(err => {
        captureFilteredError(err)
        Notification({
          type: 'warning',
          message: 'Oops! Something went wrong',
          duration: 2500,
          offset: 90
        })
      })
  }

  const copyToClipboard = (e, link) => {
    if (link) {
      e.target.select()
      const clipboard = window.navigator.clipboard
      clipboard &&
        clipboard
          .writeText(link)
          .then(() => {
            Notification({
              type: 'info',
              message: 'Link copied to clipboard',
              duration: 2500,
              offset: 90,
              iconClass: 'el-icon-info'
            })
          })
          .catch(() => {
            // IF NOT HTTPS OR LOCALHOST, THIS LINK COPYING WILL NOT WORK
          })
    }
  }

  const uiTeammates = remapEmployeesForUI(
    filteredEmployees.filter(({ status }) => status === 'active')
  ).map(item => ({
    ...item,
    children: <RequestButton handleClick={() => handleRequesting(item.id)} />
  }))

  const filteredTeammates = filterUsers(uiTeammates, searchString)

  return (
    <BodyPortal>
      <Dialog
        visible={visible}
        onCancel={() => setVisible(false)}
        className='generate-feedback__dialog'
        lockScroll
      >
        <Dialog.Body>
          <div className='align-left'>
            <h4 className='generate-feedback__header'>Shareable link: </h4>
            {publicLink?.link && (
              <Input
                value={publicLink.link}
                name='externalLink'
                icon={linkLoading ? 'loading' : ''}
                readOnly
                onFocus={e => copyToClipboard(e, publicLink.link)}
              />
            )}
            {/* <input
                className='generate-feedback__link-input'
                name='feedbackLink'
                type='text'
                value={feedbackLink}
                readOnly
              /> */}
            <br />
            <br />
            <h4 className='generate-feedback__header'>Direct request: </h4>
            <Input
              placeholder='Search for employees...'
              value={searchString}
              onChange={value => setSearchString(value)}
              icon='search'
              className='generate-feedback__input'
            />
            {employeesLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <Statement content='Oops! Something went wrong' />
            ) : (
              <div
                style={{
                  maxHeight: '600px',
                  minHeight: '120px',
                  overflowY: 'auto'
                }}
              >
                <List noBoxShadow>
                  <UserItems items={filteredTeammates} />
                  {filteredTeammates.length === 0 && (
                    <Statement content='No employees found' />
                  )}
                </List>
              </div>
            )}
          </div>
        </Dialog.Body>
        {/* <Dialog.Footer>
          {feedbackLink ? (
            <div>
              <div className="generate-feedback__footer-text">
                If you want this link to be valid no longer, click the button to
                generate a different link for feedback.
                </div>
              <Button
                type="primary"
                onClick={() => {
                  mutate()
                    .then(({ data: { generateUserFeedbackLinks: result } }) => {
                      setFeedbackLink(result)
                    })
                    .catch(err => {
                      captureFilteredError(err)
                    })
                }}
                loading={loading}
              >
                Generate another link
                </Button>
            </div>
          ) : (
              <>
                <h4 className="generate-feedback__header">
                  Click the button below to generate your unique feedback link:
            </h4>
                <Button
                  type="primary"
                  onClick={() => {
                    mutate()
                      .then(({ data: { generateUserFeedbackLinks: result } }) => {
                        setFeedbackLink(result)
                      })
                      .catch(err => {
                        captureFilteredError(err)
                      })
                  }}
                  loading={loading}
                  size="large"
                >
                  Generate feedback link
            </Button>
              </>
            )}
        </Dialog.Footer> */}
      </Dialog>
    </BodyPortal>
    // <div className="generate-feedback__content">

    // </div>
  )
}
