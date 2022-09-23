import React, { useEffect } from 'react'
import learningItemNewStyle from '../../styles/learningItemNewNewStyle'
import requestItemStyle from '../../styles/requestItemStyle'
// import callToActionStyle from '../../styles/callToActionStyle'
// import { Link } from 'react-router-dom'
import { generateInitialsAvatar } from '$/utils'
import variables from '../../styles/variables'
import { Input, Notification } from 'element-react'
import { Link } from 'react-router-dom'
// import certificateStar from '../../static/certificate-star.svg'
// import certificateRibbon from '../../static/certificate-ribbon.svg'
// import clock from '../../static/clock.svg'
// import Tooltip from 'react-simple-tooltip'

// const IconClock = () => (
//   <img src={clock} style={{ verticalAlign: 'bottom', marginRight: '4px' }} />
// )

const LearningRequestItem = ({
  _id: requestId,
  approved,
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
    isAwinException // ADDED SO AWIN SCRIPT DOES NOT OVERRIDE LINKS NOT FROM OUR AWIN CAMPAIGN (E.G. UDEMY)
  },
  note,
  reviewedAt,
  reviewedBy,
  createdAt,
  requestURL
}) => {
  useEffect(() => {
    // NECESSARY FOR IMPACT LINK TRACKING
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])
  const status =
    approved === null
      ? { text: 'Awaiting approval', color: variables.warmGrey }
      : approved
      ? {
          text: 'Approved',
          color: variables.avocado,
          icon: (
            <img
              src={require('../../static/check.svg')}
              alt='status'
              width='20px'
            />
          )
        }
      : { text: 'Denied', color: variables.fadedRed, icon: '!' }

  return (
    <div className='list-item learning-item-new'>
      {approved !== null && (
        <div
          className='request-item__status-box'
          style={{ backgroundColor: status.color }}
        >
          {status.icon}
        </div>
      )}
      <div className='learning-item-new__wrapper'>
        <div className='learning-item-new__content'>
          {goal && (
            <div className='learning-item-new__goal'>
              <span>Requested on {new Date(createdAt).toDateString()} for</span>
              <img
                src={require('../../static/goal.svg')}
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
          <div className='request-item__wrapper'>
            <div className='learning-item-new__info'>
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
            </div>
            <div className='request-item__status-wrapper'>
              <div
                className='request-item__status'
                style={{ color: status.color }}
              >
                {status.text}
              </div>
              {reviewedBy && (
                <div className='learning-item-new__share-wrapper'>
                  <img
                    src={
                      reviewedBy.imageLink || generateInitialsAvatar(reviewedBy)
                    }
                    alt='reviewer'
                    className='learning-item-new__share-info--img'
                  />
                  <div className='learning-item-new__share-info align-right'>
                    <span>by</span>
                    <Link to={`/profiles/${reviewedBy._id}`}>
                      {` ${reviewedBy.firstName} ${reviewedBy.lastName} `}
                    </Link>
                    <br />
                    <span>on {new Date(reviewedAt).toDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {approved === null || note ? (
            <div className='request-item__note'>
              <p>
                {approved === null
                  ? 'Send this link to your manager to review your request: '
                  : 'Note from reviewer: '}
              </p>
              <Input
                type={approved === null ? undefined : 'textarea'}
                onFocus={e => {
                  if (approved === null) {
                    e.target.select()
                    window.navigator.clipboard
                      .writeText(requestURL)
                      .then(() => {
                        Notification({
                          type: 'info',
                          message: 'Link copied to clipboard',
                          duration: 2500,
                          offset: 90,
                          iconClass: 'el-icon-info'
                        })
                      })
                      .catch(() => {})
                  }
                }}
                readOnly
                autosize={{ minRows: 1, maxRows: 3 }}
                style={{ marginBottom: '15px' }}
                value={approved === null ? requestURL : note}
              />
            </div>
          ) : (
            <div style={{ paddingBottom: '26px' }} />
          )}
        </div>
      </div>
      <style jsx>{learningItemNewStyle}</style>
      <style jsx>{requestItemStyle}</style>
    </div>
  )
}

export default LearningRequestItem
