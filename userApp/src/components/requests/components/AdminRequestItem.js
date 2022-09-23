import React, { useEffect, useState } from 'react'
import learningItemNewStyle from '../../../styles/learningItemNewNewStyle'
import requestItemStyle from '../../../styles/requestItemStyle'
// import callToActionStyle from '../../styles/callToActionStyle'
// import { Link } from 'react-router-dom'
// import { generateInitialsAvatar } from '$/utils'
// import variables from '../../../styles/variables'
import { Input, Button, Notification, MessageBox } from 'element-react'
import { useMutation } from 'react-apollo'
import { reviewContentRequest } from '../../../api'
// import certificateStar from '../../static/certificate-star.svg'
// import certificateRibbon from '../../static/certificate-ribbon.svg'
// import clock from '../../static/clock.svg'
// import Tooltip from 'react-simple-tooltip'

// const IconClock = () => (
//   <img src={clock} style={{ verticalAlign: 'bottom', marginRight: '4px' }} />
// )

const AdminRequestItem = ({
  _id: requestId,
  // approved,
  goal,
  content: {
    _id: contentId,
    url, // "" (URL)
    title, // ""
    type, // ""
    sourceInfo, // {}
    priceTag,
    author, // ""
    courseLevel, // ""
    onLinkClick = () => {}, // () => {} (MUTATOR)
    isAwinException, // ADDED SO AWIN SCRIPT DOES NOT OVERRIDE LINKS NOT FROM OUR AWIN CAMPAIGN (E.G. UDEMY)
    subscriptionAvailable
  },
  user: { _id: userId, firstName, lastName, imgLink },
  createdAt
}) => {
  const [approved, setApproved] = useState(null)
  const [note, setNote] = useState('')

  const [mutate, { loading }] = useMutation(reviewContentRequest)

  useEffect(() => {
    // NECESSARY FOR IMPACT LINK TRACKING
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])

  return (
    <div className='list-item learning-item-new'>
      {/* {approved !== null && (
        <div
          className='request-item__status-box'
          style={{ backgroundColor: status.color }}
        >
          {status.icon}
        </div>
      )} */}
      <div className='learning-item-new__wrapper'>
        <div className='learning-item-new__content'>
          {goal && (
            <div className='learning-item-new__goal'>
              <span>Requested on {new Date(createdAt).toDateString()} for</span>
              <img
                src={require('../../../static/goal.svg')}
                alt='goal'
                style={{ marginLeft: '14px' }}
              />{' '}
              <p>{goal.goalName}</p>
            </div>
          )}
          <div className='learning-item-new__label-tags'>
            <div className='learning-item-new__label-tags-wrapper'>
              <div className='learning-item-new__type'>
                <span
                  className='learning-item-new__label-tag'
                  style={{
                    color: '#152540',
                    backgroundColor: '#d9e1ee',
                    borderRadius: '4px'
                  }}
                >
                  {type}
                </span>
              </div>
            </div>
            <div
              className='learning-item-new__price'
              style={{ color: priceTag ? priceTag.color : 'unset' }}
            >
              {priceTag ? priceTag.text : ''}
            </div>
          </div>
          <div className='learning-item-new__label'>
            <div className='learning-item-new__logo'>
              {sourceInfo && sourceInfo.icon ? (
                <img
                  src={sourceInfo.icon}
                  alt='source icon'
                  className='learning-item-new__label-source-image'
                />
              ) : (
                <span>{sourceInfo.name}</span>
              )}
            </div>
          </div>
          {courseLevel && (
            <div className='learning-item-new__level'>{courseLevel}</div>
          )}
          <div className='learning-item-new__title'>
            <a
              href={url}
              target='_blank'
              // rel="noopener noreferrer"
              onClick={() => onLinkClick(contentId)}
              {...(!isAwinException && { 'data-awinignore': true })}
            >
              {title}
            </a>
          </div>
          <div className='learning-item-new__author'>{author}</div>
          {/* {(approved === null || note) ? (
            <div className="request-item__note">
              <p>{approved === null ? 'Send this link to your manager to review your request: ' : 'Note from reviewer: '}</p>
              <Input
                type="textArea"
                readOnly
                autosize={{ minRows: 1, maxRows: 3 }}
                style={{ marginBottom: '15px' }}
                value={approved === null ? 'http://placeholder-link.com' : note}
              />
            </div>
          ) : <div style={{ paddingBottom: '26px' }} />} */}
        </div>
      </div>
      <div className='request-item__options'>
        {approved === null ? (
          <>
            <Button type='danger' onClick={() => setApproved(false)}>
              Reject
            </Button>
            <Button type='success' onClick={() => setApproved(true)}>
              Approve
            </Button>
          </>
        ) : (
          <div style={{ width: '100%' }}>
            <Input
              type='textarea'
              autosize={{ minRows: 2, maxRows: 4 }}
              style={{ marginBottom: '15px' }}
              value={note}
              onChange={value => setNote(value)}
              placeholder={`Add a note for ${firstName} to give reasoning for your choice or leave instructions on how to acquire the item`}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type='text' onClick={() => setApproved(null)}>
                Cancel
              </Button>
              <Button
                type='primary'
                loading={loading}
                onClick={async () => {
                  try {
                    if (subscriptionAvailable && approved) {
                      const subscriptionLink = url.split('/course')[0]

                      try {
                        await MessageBox.alert(
                          <div>
                            If not or not sure, follow{' '}
                            <a
                              href={`${subscriptionLink}/organization-manage/users/`}
                              rel='noopener noreferrer'
                              target='blank'
                            >
                              <strong>this link</strong>
                            </a>{' '}
                            to assign the Udemy for Business license to the
                            user.
                          </div>,
                          'Does the user have access to the course?',
                          {
                            type: 'warning',
                            confirmButtonText: 'Done'
                          }
                        )
                      } catch (err) {}
                    }
                    await mutate({
                      variables: {
                        note,
                        approved,
                        requestId
                      }
                    })
                    Notification({
                      message: `Your decision has been submitted. ${firstName} will be notified of this.`,
                      type: 'success',
                      offset: 90,
                      duration: 2500
                    })
                  } catch (err) {
                    Notification({
                      message: `Oops! Something went wrong`,
                      type: 'warning',
                      offset: 90,
                      duration: 2500
                    })
                  }
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
      <style jsx>{learningItemNewStyle}</style>
      <style jsx>{requestItemStyle}</style>
    </div>
  )
}

export default AdminRequestItem
