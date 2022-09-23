import React, { useEffect, useState } from 'react'
import learningItemNewStyle from '../../styles/learningItemNewNewStyle'
import callToActionStyle from '../../styles/callToActionStyle'
import { Link } from 'react-router-dom'
import { generateInitialsAvatar } from '$/utils'
import certificateStar from '../../static/certificate-star.svg'
import certificateRibbon from '../../static/certificate-ribbon.svg'
import clock from '../../static/clock.svg'
import IconCheck from '../../static/check-green.svg'
import Tooltip from 'react-simple-tooltip'
import variables from '../../styles/variables'
import { Button, Input, MessageBox, Notification } from 'element-react'
import IconPackage from '../../static/package.svg'
import { captureFilteredError } from '../general'

const IconClock = () => (
  <img src={clock} style={{ verticalAlign: 'bottom', marginRight: '4px' }} />
)

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
    } catch (e) {
      // COULD NOT COPY TO CLIPBOARD
    }
  }
}

const DeliveryCredentials = ({
  email,
  password,
  note,
  url,
  isAwinException
}) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // NECESSARY FOR IMPACT LINK TRACKING
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])

  return (
    <div>
      {note && (
        <div
          className='learning-item-new__delivery-note-box'
          dangerouslySetInnerHTML={{
            __html: note
          }}
        />
      )}
      <h4>Use these credentials: </h4>
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
      <div className='learning-item-new__delivery-box__footer'>
        <a
          href={url}
          target='_blank'
          {...(!isAwinException && { 'data-awinignore': true })}
        >
          <Button type='primary'>
            <strong className='learning-item-new__cta__button'>
              Start learning!
            </strong>
          </Button>
        </a>
      </div>
    </div>
  )
}

const displayNote = async (note, name) => {
  return MessageBox.alert(note, `Note from ${name}: `, {
    customClass: 'learning-item-new__note-box'
  })
}

const displayDeliveryNote = async (note, credentials, url, isAwinException) => {
  if (!credentials) {
    captureFilteredError(`No credentials to log in to item: ${url}`)
    Notification({
      type: 'error',
      message:
        "There's been a problem with accessing the item. Please try again later",
      duration: 2500,
      offset: 90,
      iconClass: 'el-icon-error'
    })
    return
  }

  const { email, password } = credentials

  return MessageBox.alert(
    <DeliveryCredentials
      email={email}
      password={password}
      note={note}
      url={url}
      isAwinException={isAwinException}
    />,
    `How to access your learning item`,
    {
      customClass: 'learning-item-new__delivery-box',
      showConfirmButton: false,
      showCancelButton: false,
      showClose: true
    }
  )
}

export default ({
  _id: contentId,
  shareInfo, // {}
  recommendedBy, // {}
  labels = [], // [ {} ]
  skillTags = [], // [ {} ]
  goalInfo, // {}
  url, // "" (URL)
  title, // ""
  icon, // "" (ICON CLASS)
  priceTag,
  type, // ""
  sourceInfo, // {}
  // source, //ONBOARDING
  author, // ""
  options = [], // [ [ {} ] ]
  courseLevel, // ""
  onLinkClick = () => {}, // () => {} (MUTATOR)
  relevanceRating,
  certified,
  noBoxShadow = false,
  durationText,
  // isOnBoarding, //ADDED TO USE DIFFERENT LOGIC IN CASE THE COMPONENT IS RENDERED IN THE ONBOARDNING
  isAwinException, // ADDED SO AWIN SCRIPT DOES NOT OVERRIDE LINKS NOT FROM OUR AWIN CAMPAIGN (E.G. UDEMY)
  approved,
  request,
  fulfillmentRequest,
  price,
  imageLink,
  path,
  customCertStyle,
  children,
  updateStatus = () => {},
  cta,
  showUndeliveredStatus,
  endDate,
  subscriptionAvailable,
  pathInfo
  // reviewedBy,
  // reviewedAt,
  // approved,
  // note
}) => {
  useEffect(() => {
    // NECESSARY FOR IMPACT LINK TRACKING
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])
  const { reviewedBy, reviewedAt, note } = request
  const {
    fulfilled,
    reviewedAt: deliveryReviewedAt,
    note: deliveryNote,
    learningCredentials,
    createdAt: requestedAt
  } = fulfillmentRequest
  return (
    <div
      className={`list-item learning-item-new ${
        noBoxShadow ? 'learning-item-new--no-box' : ''
      }`}
    >
      {certified && (
        <div className='learning-item-new__certified' style={customCertStyle}>
          <Tooltip
            content={(sourceInfo && sourceInfo.certText) || 'Certified'}
            zIndex={11}
            fontSize='11px'
            padding={3}
            placement='right'
          >
            <img src={certificateStar} />
            <img
              className='learning-item-new__certified__ribbon'
              src={certificateRibbon}
            />
          </Tooltip>
        </div>
      )}
      <div className='learning-item-new__wrapper'>
        <div className='learning-item-new__content'>
          {endDate && (
            <div className='learning-item-new__share-wrapper'>
              <img src={IconCheck} style={{ marginRight: '8px' }} />
              <div className='learning-item-new__share-info'>
                <span
                  style={{
                    color: variables.apple
                  }}
                >
                  Completed
                </span>{' '}
                <span>on {new Date(endDate).toDateString()}</span>
              </div>
            </div>
          )}
          {fulfilled && (
            <div className='learning-item-new__share-wrapper'>
              <img src={IconPackage} style={{ marginRight: '8px' }} />
              <div className='learning-item-new__share-info'>
                <span
                  style={{
                    color: variables.brandPrimary
                  }}
                >
                  Delivered
                </span>{' '}
                <span>on {new Date(deliveryReviewedAt).toDateString()}</span>
              </div>
            </div>
          )}
          {!fulfilled && requestedAt && showUndeliveredStatus && (
            <div className='learning-item-new__share-wrapper'>
              <i
                className='icon icon-time-clock'
                style={{
                  color: variables.lightMustard,
                  fontSize: '21px'
                }}
              />
              <div className='learning-item-new__share-info'>
                <span
                  style={{
                    color: variables.lightMustard
                  }}
                >
                  Awaiting delivery
                </span>
              </div>
            </div>
          )}
          {reviewedBy && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className='learning-item-new__share-wrapper'>
                <img
                  src={
                    reviewedBy.imageLink || generateInitialsAvatar(reviewedBy)
                  }
                  alt='reviewer'
                  className='learning-item-new__share-info--img'
                />
                <div className='learning-item-new__share-info'>
                  <span
                    style={{
                      color: approved ? variables.avocado : variables.fadedRed
                    }}
                  >
                    {approved ? 'Approved' : 'Rejected'}{' '}
                  </span>
                  <span>by</span>
                  <Link to={`/profiles/${reviewedBy._id}`}>
                    {` ${reviewedBy.firstName} ${reviewedBy.lastName} `}
                  </Link>
                  <span>on {new Date(reviewedAt).toDateString()}</span>{' '}
                </div>
              </div>
              {note && (
                <div
                  className='link-button'
                  style={{ marginLeft: '5%' }}
                  onClick={() => displayNote(note, reviewedBy.firstName)}
                >
                  See note
                </div>
              )}
            </div>
          )}
          {!reviewedBy && recommendedBy && (
            <div className='learning-item-new__share-wrapper'>
              <img
                src={
                  recommendedBy.imageLink ||
                  generateInitialsAvatar(recommendedBy)
                }
                alt=''
                className='learning-item-new__share-info--img'
              />
              <div className='learning-item-new__share-info'>
                <span>Recommended by</span>
                <Link to={`/profiles/${recommendedBy._id}`}>
                  {` ${recommendedBy.firstName} ${recommendedBy.lastName} `}
                </Link>
              </div>
            </div>
          )}
          {!reviewedBy && shareInfo && (
            <div className='learning-item-new__share-wrapper'>
              {shareInfo.sharedBy && (
                <>
                  <img
                    src={
                      shareInfo.sharedBy.imageLink ||
                      generateInitialsAvatar(shareInfo.sharedBy)
                    }
                    alt=''
                    className='learning-item-new__share-info--img'
                  />
                  <div className='learning-item-new__share-info'>
                    <span>Shared by</span>
                    <Link to={`/profiles/${shareInfo.sharedBy._id}`}>
                      {` ${shareInfo.sharedBy.firstName} ${shareInfo.sharedBy.lastName} `}
                    </Link>
                    <div className='learning-item-new__share-info--teams'>
                      {`(${shareInfo.sharedTeams})`}
                    </div>
                  </div>
                </>
              )}
              {shareInfo.sharedIn && shareInfo.sharedIn.length && (
                <div className='learning-item-new__share-info--teams'>
                  {`(${shareInfo.sharedIn.join(', ')})`}
                </div>
              )}
            </div>
          )}
          {/* <p style={{ color: 'grey', fontSize: '12px' }}>{contentId}</p> */}
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
              {durationText && (
                <div className='learning-item-new__duration'>
                  <IconClock />
                  {durationText}
                </div>
              )}

              {/* {labels.map((label, i) => (
                <div
                  key={`${contentId}:label-tag:${i}`}
                  className="learning-item-new__label-tag"
                  style={
                    label.name === 'FREE'
                      ? {
                          color: '#128945',
                          backgroundColor: '#d1f2e1',
                          borderRadius: '4px'
                        }
                      : label.name === 'PAID'
                      ? {
                          color: '#BF7817',
                          backgroundColor: '#ffecd1',
                          borderRadius: '4px'
                        }
                      : label.name === 'FRESH'
                      ? {
                          color: '#BA0913',
                          backgroundColor: '#FFDAD8',
                          borderRadius: '4px'
                        }
                      : null
                  }
                >
                  {label.name}
                </div>
              ))} */}
            </div>
            {priceTag?.hover ? (
              <Tooltip
                content={priceTag.hover}
                zIndex={11}
                fontSize='11px'
                padding={3}
                placement='top'
                style={{ cursor: 'pointer' }}
              >
                <div
                  className='learning-item-new__price'
                  style={{ color: priceTag ? priceTag.color : 'unset' }}
                >
                  {priceTag.icon}
                  {priceTag ? priceTag.text : ''}
                </div>
              </Tooltip>
            ) : (
              priceTag && (
                <div
                  className='learning-item-new__price'
                  style={{ color: priceTag ? priceTag.color : 'unset' }}
                >
                  {priceTag.icon}
                  {priceTag ? priceTag.text : ''}
                </div>
              )
            )}
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
            {/* USER REVIEWS */}
          </div>
          {courseLevel && (
            <div className='learning-item-new__level'>{courseLevel}</div>
          )}
          <div className='learning-item-new__title'>
            <a
              href={url}
              target='_blank'
              // rel="noopener noreferrer"
              onClick={async e => {
                updateStatus(contentId)
                window.analytics &&
                  window.analytics.track('click', {
                    contentId
                  })
                window.analytics &&
                  window.analytics.track('bump_content', {
                    contentId
                  })
                if (fulfilled) {
                  e.preventDefault()
                  try {
                    await displayDeliveryNote(
                      deliveryNote,
                      learningCredentials,
                      url,
                      isAwinException
                    )
                  } catch (err) {}
                }
              }}
              {...(!isAwinException && { 'data-awinignore': true })}
            >
              {title}
            </a>
          </div>
          <div className='learning-item-new__author'>{author}</div>
        </div>
        {imageLink && path && (
          <div className='learning-item-new__image'>
            <img src={imageLink} alt='' />
          </div>
        )}
      </div>
      {children}
      {skillTags.length > 0 && (
        <div className='learning-item-new__skills'>
          {skillTags.slice(0, 4).map((tag, i) => (
            <div
              key={`${contentId}:skill-tag:${i}`}
              className={`learning-item-new__skill-tag ${tag.main &&
                'learning-item-new__skill-tag--main'}`}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
      {(options.length > 0 || cta) && (
        <div className='learning-item-new__action'>
          {cta ? (
            <div className='learning-item-new__cta'>
              <a
                href={url}
                target='_blank'
                // rel="noopener noreferrer"
                {...(!isAwinException && { 'data-awinignore': true })}
              >
                <Button
                  type='primary'
                  onClick={async e => {
                    updateStatus(contentId)
                    window.analytics &&
                      window.analytics.track('click', {
                        contentId
                      })
                    window.analytics &&
                      window.analytics.track('bump_content', {
                        contentId
                      })
                    if (fulfilled) {
                      e.preventDefault()
                      try {
                        await displayDeliveryNote(
                          deliveryNote,
                          learningCredentials,
                          url,
                          isAwinException
                        )
                      } catch (err) {}
                    }
                  }}
                >
                  <strong className='learning-item-new__cta__button'>
                    {cta}
                  </strong>
                </Button>
              </a>
            </div>
          ) : (
            <div />
          )}
          {Array.isArray(options) && options.length > 0 && (
            <div className='learning-item-new__options'>
              {options.map((option, i) => (
                <div
                  key={`${contentId}:option:${i}`}
                  name={`cta:${option.text.toLowerCase()}`}
                  className={`call-to-action__option ${!option.disabled &&
                    'call-to-action__option--active'}`}
                  style={{ color: option.color }}
                  onClick={() =>
                    !option.disabled &&
                    option.onClick(
                      contentId,
                      type,
                      price,
                      subscriptionAvailable
                    )
                  }
                >
                  <i className={`icon ${option.icon}`} />
                  <p>{option.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <style jsx>{callToActionStyle}</style>
      <style jsx>{learningItemNewStyle}</style>
    </div>
  )
}
