import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Input, Select, Button, Message, Radio, Loading } from 'element-react'
import axios from 'axios'
import { fetchApiUrl } from '../../api'

const options = [
  { label: 'Question posted', value: 'QUESTIONPOSTED' },
  { label: 'Reply posted', value: 'REPLYPOSTED' },
  { label: 'Comment liked', value: 'COMMENTLIKED' },
  { label: 'First invitation', value: 'FIRSTINVITATION' },
  { label: 'Registration email', value: 'REGISTRATION' },
  { label: 'Learning Path Resource Started', value: 'LPPROGRESSSTARTED' },
  { label: 'Learning Path Resource Completed', value: 'LPPROGRESSCOMPLETED' },
  { label: 'Learning Path Assign', value: 'LEARNINGPATHASSIGN' },
  { label: 'Learning Path Progress (new)', value: 'USERPROGRESS' },
  { label: 'Goal approval', value: 'GOALSAPPROVED' },
  { label: 'Learning Delivery Fulfilled', value: 'LEARNINGDELIVERED' },
  { label: 'Learning approval', value: 'REQUESTSREVIEWED' },
  { label: 'Admin approval reminder', value: 'REQUESTSREMINDER' },
  { label: 'Team progress for leader', value: 'TEAMPROGRESS' },
  { label: 'Dev plan first setup reminder', value: 'DEVPLANREMINDER' },
  {
    label: 'Reminder to set goals as active and as ready for review',
    value: 'ACTIVATEGOALS'
  },
  {
    label: 'Request to reviewees to prepare draft goals and dev plans',
    value: 'PREPAREDRAFTS'
  },
  {
    label:
      'Notification to reviewer to schedule calendar events with reviewees',
    value: 'SCHEDULEREVIEW'
  },
  {
    label: 'Reminder to reviewer to set/review goals and close',
    value: 'CLOSEREVIEW'
  },
  { label: 'Weekly content email', value: 'WEEKLYCONTENT' },
  { label: 'Shared content notification', value: 'SHAREDCONTENT' },
  { label: 'Recommendation notification', value: 'RECOMMENDEDCONTENT' },
  { label: 'Reminder to onboard', value: 'ONBOARDINGREMINDER' },
  {
    label: 'Notification to leader that there are goals ready to review',
    value: 'LEADERGOALSREADY'
  },
  { label: 'Feedback notification', value: 'FEEDBACKNOTIFICATION' },
  // { label: 'Learning path request', value: 'LEARNINGPATHREQUEST' },
  { label: 'Team required skills change', value: 'TEAMREQUIREDSKILLSCHANGE' },
  { label: 'Team feedback notification', value: 'TEAMFEEDBACK' },
  { label: 'Feedback request', value: 'FEEDBACKREQUEST' }
]

// TODO update after adding new REAL templates in _mock-email.js
const realAvailableOptions = ['FIRSTINVITATION']

const TestPage = () => {
  const [email, setEmail] = useState('')
  const [type, setType] = useState(null)
  const [mock, setMock] = useState(true)

  const checkDisabled = () => {
    if (email.length === 0) return true
    if (type === null) return true
    return false
  }

  const { data, loading, error } = useQuery(fetchApiUrl)

  if (loading) return <Loading />
  if (error) return `Error! ${error.message}`

  const uri = data.fetchApiUrl

  return (
    <div style={{ display: 'block' }}>
      <Input
        onChange={value => setEmail(value)}
        value={email}
        placeholder='Type the email address here'
      />
      <br />
      <br />
      <Select
        value={type}
        onChange={value => setType(value)}
        placeholder='Select notification type'
      >
        {options.map(({ label, value }) => (
          <Select.Option
            key={value}
            label={label}
            value={value}
            disabled={!mock && !realAvailableOptions.includes(value)}
          />
        ))}
      </Select>
      <br />
      <br />
      <Radio.Group value={mock} onChange={value => setMock(value)}>
        <Radio value>Send mock email</Radio>
        <Radio value={false}>Send real email</Radio>
      </Radio.Group>
      <br />
      <br />
      <Button
        disabled={checkDisabled()}
        onClick={() => {
          axios
            .post(
              `${uri}/test/mock-email`,
              { email, type, mock },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
            .then(res => {
              if (res.status === 200) {
                Message({
                  type: 'success',
                  message: 'Email sent'
                })
              }
            })
            .catch(e => {
              Message({
                type: 'warning',
                message: `Error ${e.response.status}: ${e.response.data.message}`
              })

              return e.response
            })
        }}
      >
        Send email
      </Button>
    </div>
  )
}

export default TestPage
