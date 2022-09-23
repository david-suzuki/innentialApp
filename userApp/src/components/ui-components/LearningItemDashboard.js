import React, { useEffect, useState } from 'react'
import Tooltip from 'react-simple-tooltip'
import { Button, Input, MessageBox, Notification } from 'element-react'
import { captureFilteredError } from '../general'
import styles from '../../styles/goalItemNewStyle'
import Ribbon from '../ui-components/ribbon'
// import clock from '../../static/clock.svg'
import Clock from '../../static/clock.svg'
import CheckGreen from '../../static/check-circle-green.svg'
import Certificate from '../../static/certificate.svg'
import learningItemNewStyle from '../../styles/learningItemNewNewStyle'

// const IconPadlock = () => {
//   return (
//     <svg
//       width='32'
//       height='32'
//       viewBox='0 0 32 32'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'
//     >
//       <circle cx='15.75' cy='15.75' r='15.75' fill='#FEBB5B' />
//       <path
//         fillRule='evenodd'
//         clipRule='evenodd'
//         d='M10.5 15C10.0858 15 9.75 15.3358 9.75 15.75V21C9.75 21.4142 10.0858 21.75 10.5 21.75H21C21.4142 21.75 21.75 21.4142 21.75 21V15.75C21.75 15.3358 21.4142 15 21 15H10.5ZM8.25 15.75C8.25 14.5074 9.25736 13.5 10.5 13.5H21C22.2426 13.5 23.25 14.5074 23.25 15.75V21C23.25 22.2426 22.2426 23.25 21 23.25H10.5C9.25736 23.25 8.25 22.2426 8.25 21V15.75Z'
//         fill='white'
//       />
//       <path
//         fillRule='evenodd'
//         clipRule='evenodd'
//         d='M15.75 8.25C14.9544 8.25 14.1913 8.56607 13.6287 9.12868C13.0661 9.69129 12.75 10.4544 12.75 11.25V14.25C12.75 14.6642 12.4142 15 12 15C11.5858 15 11.25 14.6642 11.25 14.25V11.25C11.25 10.0565 11.7241 8.91193 12.568 8.06802C13.4119 7.22411 14.5565 6.75 15.75 6.75C16.9435 6.75 18.0881 7.22411 18.932 8.06802C19.7759 8.91193 20.25 10.0565 20.25 11.25V14.25C20.25 14.6642 19.9142 15 19.5 15C19.0858 15 18.75 14.6642 18.75 14.25V11.25C18.75 10.4544 18.4339 9.69129 17.8713 9.12868C17.3087 8.56607 16.5456 8.25 15.75 8.25Z'
//         fill='white'
//       />
//     </svg>
//   )
// }

// const IconDelivery = () => {
//   return (
//     <svg
//       width='32'
//       height='32'
//       viewBox='0 0 32 32'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'
//     >
//       <circle cx='15.75' cy='15.75' r='15.75' fill='#347EB6' />
//       <path
//         fillRule='evenodd'
//         clipRule='evenodd'
//         d='M23.0303 8.46967C23.3232 8.76256 23.3232 9.23744 23.0303 9.53033L14.7803 17.7803C14.4874 18.0732 14.0126 18.0732 13.7197 17.7803C13.4268 17.4874 13.4268 17.0126 13.7197 16.7197L21.9697 8.46967C22.2626 8.17678 22.7374 8.17678 23.0303 8.46967Z'
//         fill='white'
//       />
//       <path
//         fillRule='evenodd'
//         clipRule='evenodd'
//         d='M23.0303 8.46969C23.2341 8.67342 23.3031 8.97584 23.2079 9.24778L17.9579 24.2478C17.8563 24.538 17.5878 24.7369 17.2806 24.7494C16.9733 24.7619 16.6895 24.5856 16.5646 24.3046L13.6818 17.8182L7.1954 14.9354C6.91439 14.8105 6.73809 14.5267 6.75063 14.2194C6.76316 13.9122 6.96199 13.6437 7.25224 13.5421L22.2522 8.29213C22.5242 8.19695 22.8266 8.26596 23.0303 8.46969ZM9.53331 14.333L14.5546 16.5647C14.7243 16.6401 14.86 16.7757 14.9354 16.9454L17.167 21.9667L21.2775 10.2225L9.53331 14.333Z'
//         fill='white'
//       />
//     </svg>
//   )
// }

// const IconCheckmarkEmpty = () => {
//   return (
//     <Tooltip
//       content='Mark as completed'
//       zIndex={11}
//       fontSize='11px'
//       padding={3}
//       className='tooltip-body'
//     >
//       <svg
//         width='32'
//         height='32'
//         viewBox='0 0 32 32'
//         fill='none'
//         xmlns='http://www.w3.org/2000/svg'
//         className='title-completed-icon'
//       >
//         <circle cx='15.75' cy='15.75' r='15.25' stroke='#4ACF89' />
//         <path
//           fillRule='evenodd'
//           clipRule='evenodd'
//           d='M22.2803 10.2197C22.5732 10.5126 22.5732 10.9874 22.2803 11.2803L14.0303 19.5303C13.7374 19.8232 13.2626 19.8232 12.9697 19.5303L9.21967 15.7803C8.92678 15.4874 8.92678 15.0126 9.21967 14.7197C9.51256 14.4268 9.98744 14.4268 10.2803 14.7197L13.5 17.9393L21.2197 10.2197C21.5126 9.92678 21.9874 9.92678 22.2803 10.2197Z'
//           fill='#4ACF89'
//         />
//       </svg>
//     </Tooltip>
//   )
// }

// const IconCheckmarkCompleted = () => {
//   return (
//     <svg
//       width='32'
//       height='32'
//       viewBox='0 0 32 32'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'
//     >
//       <circle cx='15.75' cy='15.75' r='15.25' fill='#4ACF89' stroke='#1CB55C' />
//       <path
//         fillRule='evenodd'
//         clipRule='evenodd'
//         d='M22.2803 10.7197C22.5732 11.0126 22.5732 11.4874 22.2803 11.7803L14.0303 20.0303C13.7374 20.3232 13.2626 20.3232 12.9697 20.0303L9.21967 16.2803C8.92678 15.9874 8.92678 15.5126 9.21967 15.2197C9.51256 14.9268 9.98744 14.9268 10.2803 15.2197L13.5 18.4393L21.2197 10.7197C21.5126 10.4268 21.9874 10.4268 22.2803 10.7197Z'
//         fill='white'
//       />
//     </svg>
//   )
// }

// const IconForStatus = {
//   'NOT STARTED': <IconCheckmarkEmpty />,
//   'IN PROGRESS': <IconCheckmarkEmpty />,
//   COMPLETED: <IconCheckmarkCompleted />,
//   'AWAITING FULFILLMENT': <IconDelivery />
// }

// const RibbonText = ({ text }) => {
//   return (
//     <>
//       <span
//         className={`goal-item__status-icon ${text
//           .toLowerCase()
//           .replaceAll(' ', '-')}`}
//       ></span>
//       <b style={{ paddingLeft: '18px' }}>{text}</b>
//     </>
//   )
// }

// const IconClock = () => (
//   <img src={clock} style={{ verticalAlign: 'bottom', marginRight: '4px' }} />
// )

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
      <style jsx>{learningItemNewStyle}</style>
    </div>
  )
}

const ApprovalNote = ({ note, url, isAwinException }) => {
  useEffect(() => {
    // NECESSARY FOR IMPACT LINK TRACKING
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])

  return (
    <div>
      <i>{note}</i>
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
      <style jsx>{learningItemNewStyle}</style>
    </div>
  )
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

const displayApprovalNote = async (note, reviewedBy, url, isAwinException) => {
  return MessageBox.alert(
    <ApprovalNote note={note} url={url} isAwinException={isAwinException} />,
    `Note from ${reviewedBy?.firstName || 'reviewer'}`,
    {
      customClass: 'learning-item-new__delivery-box',
      showConfirmButton: false,
      showCancelButton: false,
      showClose: true
    }
  )
}

export default props => {
  const {
    _id: contentId,
    url, // "" (URL)
    title, // ""
    price,
    priceTag,
    type, // ""
    sourceInfo, // {}
    author, // ""
    certified,
    duration,
    durationText,
    // isOnBoarding, //ADDED TO USE DIFFERENT LOGIC IN CASE THE COMPONENT IS RENDERED IN THE ONBOARDNING
    isAwinException, // ADDED SO AWIN SCRIPT DOES NOT OVERRIDE LINKS NOT FROM OUR AWIN CAMPAIGN (E.G. UDEMY)
    approved,
    request,
    fulfillmentRequest,
    imageLink,
    setInProgress = () => {},
    setCompleted = () => {},
    cta,
    ctaIcon,
    status,
    handleSkip,
    handleRequesting,
    handleRequestingFulfillment,
    idx,
    contentStatus,
    note: description,
    notHighlight
  } = props

  useEffect(() => {
    // NECESSARY FOR IMPACT LINK TRACKING
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])

  const [statusLoading, setStatusLoading] = useState(false)

  const { note, reviewedBy } = request

  const isRequested = !!request._id

  const {
    fulfilled,
    // reviewedAt: deliveryReviewedAt,
    note: deliveryNote,
    learningCredentials
    // createdAt: requestedAt
  } = fulfillmentRequest

  const deliveryRequested = !!fulfillmentRequest._id

  let updatedAuthor = ''
  if (author) {
    const lastChar = author.slice(-1)
    if (lastChar === ',') {
      updatedAuthor = author.slice(0, -1)
      updatedAuthor = updatedAuthor.replaceAll(',', ', ')
    } else updatedAuthor = author
  }

  const generateTitleIcon = () => {
    return (
      <Button
        type='primary'
        className='goal-item_mark-complete'
        disabled={ctaIsDisabled}
        onClick={() => {
          if (['IN PROGRESS', 'NOT STARTED'].indexOf(status) !== -1) {
            setStatusLoading(true)
            return setCompleted(contentId, { duration }).then(() => setStatusLoading(false))
          }
        }}
      >
        <img src={CheckGreen} alt='Check Green' />
        {statusLoading && <i className={'el-icon-loading'} /> }
        {!statusLoading && ctaIsDisabled ? 'Completed' : 'Mark Complete'}
      </Button>
    )
  }

  const onTitleClick = async e => {
    if (status !== 'AWAITING FULFILLMENT' && approved) {
      window.analytics &&
        window.analytics.track('click', {
          contentId
        })
      window.analytics &&
        window.analytics.track('bump_content', {
          contentId
        })
    }

    if (['IN PROGRESS', 'NOT STARTED'].indexOf(status) !== -1 && approved) {
      status === 'NOT STARTED' && setInProgress(contentId, { duration })
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
      } else if (approved && note) {
        e.preventDefault()
        try {
          await displayApprovalNote(note, reviewedBy, url, isAwinException)
        } catch (err) {}
      }
    }
  }

  const onButtonClick = async e => {
    if (!approved) {
      e.preventDefault()
      !isRequested && handleRequesting(contentId, { price: { value: price } })
      return
    }

    if (status === 'AWAITING FULFILLMENT') {
      e.preventDefault()
      !deliveryRequested &&
        handleRequestingFulfillment(contentId, { price: { value: price } })
      return
    }

    if (status !== 'COMPLETED') {
      status === 'NOT STARTED' && setInProgress(contentId, { duration })
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
      } else if (approved && note) {
        e.preventDefault()
        try {
          await displayApprovalNote(note, reviewedBy, url, isAwinException)
        } catch (err) {}
      }
    } else {
      e.preventDefault()
    }
  }

  const ctaIsDisabled = status === 'COMPLETED'

  const buttonClassName = `el-button el-button--${
    isRequested || deliveryRequested ? 'secondary' : 'primary'
  } ${approved ? status.toLowerCase().replaceAll(' ', '-') : 'not-approved'} ${
    ctaIsDisabled ? 'is-disabled' : ''
  }`

  return (
    <>
      <div>
        <style>{styles}</style>
        <div
          className={`goal-item__cardContainer ${contentStatus} ${
            idx === 0 && !ctaIsDisabled && !notHighlight ? 'active' : ''
          }`}
        >
          <div
            className={`goal-item__cardBody ${
              sourceInfo && sourceInfo.icon ? 'withIcon' : ''
            }`}
          >
            <div className='goal-item__header'>
              <div className='goal-item__tags'>
                {/* <Ribbon
                  text={
                    <RibbonText
                      text={
                        approved === null
                          ? 'Awaiting approval'
                          : approved === false
                          ? 'Not approved'
                          : status.toLowerCase()
                      }
                    />
                  }
                  customStyle={{
                    padding: '4px 6px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    lineHeight: '18px',
                    color:
                      approved === null
                        ? '#FEBB5B'
                        : approved === false
                        ? '#ba0913'
                        : status === 'AWAITING FULFILLMENT'
                        ? '#5296CA'
                        : status === 'IN PROGRESS'
                        ? '#8C88C4'
                        : status === 'COMPLETED'
                        ? '#2FC373'
                        : '#556685',
                    background: 'white',
                    border: '1px solid',
                    borderColor:
                      approved === null
                        ? '#FEBB5B'
                        : approved === false
                        ? '#ba0913'
                        : status === 'AWAITING FULFILLMENT'
                        ? '#5296CA'
                        : status === 'IN PROGRESS'
                        ? '#8C88C4'
                        : status === 'COMPLETED'
                        ? '#2FC373'
                        : '#556685',
                    marginRight: '16px',
                    borderRadius: '4px',
                    textTransform: 'capitalize',
                    position: 'relative'
                  }}
                /> */}
                <Ribbon
                  text={type.toLowerCase()}
                  customStyle={{
                    padding: '4px 6px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    lineHeight: '18px',
                    color: 'RGB(26, 37, 61)',
                    background: 'RGB(219, 225, 237)',
                    marginRight: '16px',
                    borderRadius: '4px',
                    textTransform: 'capitalize'
                  }}
                />
                {durationText && (
                  <span className='goal-item__duration'>
                    <img src={Clock} alt='duration' />
                    {durationText}
                  </span>
                )}
                {sourceInfo && (
                  <div className='goal-item__source'>
                    {sourceInfo.icon ? (
                      <img src={sourceInfo.icon} alt='source' />
                    ) : (
                      sourceInfo.name
                    )}
                  </div>
                )}
              </div>
              <div className='goal-item__tags right'>
                {certified && (
                  <Ribbon
                    text={
                      <>
                        <img src={Certificate} alt='Certificate' />
                        <b style={{ paddingLeft: '8px' }}>Certificate</b>
                      </>
                    }
                    customStyle={{
                      padding: '4px 6px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      lineHeight: '18px',
                      color: '#5A55AB',
                      background: 'white',
                      border: '1px solid #5A55AB',
                      marginRight: '16px',
                      borderRadius: '4px',
                      textTransform: 'capitalize',
                      position: 'relative',
                      display: 'flex'
                    }}
                  />
                )}
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
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  className={`goal-item__title ${
                    sourceInfo && sourceInfo.icon ? 'withIcon' : ''
                  }`}
                >
                  <a
                    href={url}
                    target='_blank'
                    // rel="noopener noreferrer"
                    onClick={async e => {
                      onTitleClick(e)
                    }}
                    onMouseDown={async e => {
                      if (e.button === 1) {
                        onTitleClick(e)
                      }
                    }}
                    {...(!isAwinException && { 'data-awinignore': true })}
                  >
                    {title}
                  </a>
                </div>
                {author && (
                  <div className='goal-item__author'>{updatedAuthor}</div>
                )}
                {description && (
                  <div
                    className='goal-item__description'
                    dangerouslySetInnerHTML={{
                      __html: description
                    }}
                  />
                )}
              </div>
              <div className='goal-item__footer'>
                {['IN PROGRESS', 'COMPLETED'].indexOf(status) !== -1 &&
                  generateTitleIcon()}
                {!ctaIsDisabled && (
                  <>
                    <a
                      href={url}
                      target='_blank'
                      // rel="noopener noreferrer"
                      {...(!isAwinException && { 'data-awinignore': true })}
                    >
                      <button
                        className={buttonClassName}
                        onClick={async e => {
                          onButtonClick(e)
                        }}
                        onMouseDown={async e => {
                          if (e.button === 1) {
                            onButtonClick(e)
                          }
                        }}
                      >
                        <span>
                          {ctaIcon}
                          {cta}
                        </span>
                      </button>
                      {/* <Button
                        type='primary'
                        className={`${
                          approved
                            ? status.toLowerCase().replaceAll(' ', '-')
                            : 'not-approved'
                        } ${ctaIsDisabled ? 'is-disabled' : ''}`}
                        // disabled={ctaIsDisabled}
                        onClick={async e => onButtonClick(e)}
                      >
                        {ctaIcon}
                        {cta}
                      </Button> */}
                    </a>
                    <Button
                      className='goal-item__skip'
                      onClick={() => handleSkip(contentId, approved !== false)}
                    >
                      Skip
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          {imageLink && (
            <div className='img' style={{ background: `url(${imageLink})` }} />
          )}
        </div>
      </div>
    </>
  )
}
