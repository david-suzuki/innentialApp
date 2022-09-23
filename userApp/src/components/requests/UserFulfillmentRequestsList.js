import { Button, Input, MessageBox, Notification } from 'element-react'
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { fetchUserFulfillmentRequests } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import {
  List,
  ListSort,
  LearningItemNew,
  remapLearningContentForUI,
  Statement
} from '../ui-components'

const PasswordInput = ({
  value,
  onFocus: handleFocus,
  icon,
  onIconClick: handleIconClick,
  type
}) => {
  return (
    <div className='el-input'>
      <i
        className={`icon ${icon}`}
        style={{ cursor: 'pointer' }}
        onClick={handleIconClick}
      />
      <input
        className='el-input__inner'
        type={type}
        readOnly
        onFocus={handleFocus}
        value={value}
      />
    </div>
  )
}

const selectAndCopyToClipboard = async (e, value) => {
  e.target.select()
  if (value) {
    try {
      await window.navigator.clipboard.writeText(value)
      Notification({
        type: 'info',
        message: 'Copied to clipboard',
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-info'
      })
    } catch (err) {
      // COULD NOT COPY TO CLIPBOARD
    }
  }
}

const DeliveryCredentials = ({ email, password }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Input
        value={email}
        readOnly
        onFocus={e => selectAndCopyToClipboard(e, email)}
      />
      <PasswordInput
        value={password}
        type={visible ? 'text' : 'password'}
        icon={visible ? 'icon icon-b-preview' : 'icon icon-eye-17'}
        onFocus={e => selectAndCopyToClipboard(e, password)}
        onIconClick={() => setVisible(!visible)}
      />
    </div>
  )
}

const displayDeliveryNote = async credentials => {
  const { email, password } = credentials

  return MessageBox.alert(
    <DeliveryCredentials email={email} password={password} />,
    'Your learning credentials',
    {
      showConfirmButton: false,
      showCancelButton: false,
      showClose: true
    }
  )
}

const sortOptions = [
  {
    label: 'Requested at (newest)',
    callback: (a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
  },
  {
    label: 'Requested at (oldest)',
    callback: (a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt)
    }
  },
  {
    label: 'Status',
    callback: (a, b) => {
      if (a.fulfilled === null && b.fulfilled !== null) {
        return -1
      }
      return a.fulfilled - b.fulfilled
    }
  }
]

// const filterOptions = [
//   {
//     label: 'All',
//     callback: () => true
//   },
//   {
//     label: 'Pending',
//     callback: ({ approved }) => approved === null
//   },
//   {
//     label: 'Reviewed',
//     callback: ({ approved }) => approved !== null
//   }
// ]

const UserFulfillmentRequestsList = () => {
  const [sortMethod, setSortMethod] = useState(sortOptions[0])

  const { data, loading, error } = useQuery(fetchUserFulfillmentRequests, {
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Redirect to='/error-page/500' />
  }

  const requests = data?.fetchUserFulfillmentRequests || []

  if (requests.length === 0) {
    return <Statement content='No requests to show' />
  }

  requests.sort(sortMethod.callback)

  const credentials = requests[0]?.learningCredentials

  return (
    <div>
      <ListSort
        sortMethod={sortMethod.label}
        sortMethodList={sortOptions}
        // filter={filter.label}
        // filterList={filterOptions}
        // filterLabel='Show'
        changeSortMethod={setSortMethod}
        // changeFilter={setFilter}
      />
      {credentials && (
        <Button
          type='primary'
          style={{ position: 'absolute', top: '-10px', right: '0px' }}
          onClick={() => {
            try {
              displayDeliveryNote(credentials)
            } catch (e) {}
          }}
        >
          <i
            className='icon icon-eye-17'
            style={{ fontWeight: 'bold', fontSize: '16px', marginRight: '4px' }}
          />
          See learning credentials
        </Button>
      )}
      <List noBoxShadow noPadding overflow>
        {requests.map(({ content, ...request }) => {
          return (
            <LearningItemNew
              {...remapLearningContentForUI({
                content: {
                  ...content,
                  fulfillmentRequest: request
                }
              })}
              showUndeliveredStatus
            />
          )
        })}
      </List>
    </div>
  )
}

export default UserFulfillmentRequestsList
