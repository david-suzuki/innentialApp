import React, { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import TextEditor from './TextEditor'
import developmentPlanRecommendationStyle from '../../styles/developmentPlanRecommendationStyle'
import learningItemNewStyle from '../../styles/learningItemNewNewStyle'
import callToActionStyle from '../../styles/callToActionStyle'
import { generateInitialsAvatar } from '$/utils'
import certificateStar from '../../static/certificate-star.svg'
import certificateRibbon from '../../static/certificate-ribbon.svg'
import Tooltip from 'react-simple-tooltip'
import { ReactComponent as IconClock } from '../../static/clock.svg'
import { ReactComponent as EditIcon } from '../../static/edit-icon.svg'
import { UserContext } from '../../utils'

// const IconClock = () => (
//   <img src={clock} style={{ verticalAlign: 'bottom', marginRight: '4px' }} />
// )

// const courseLevels = [
//   'BEGINNER',
//   'BEGINNER',
//   'INTERMEDIATE',
//   'ADVANCED',
//   'EXPERT'
// ]

export default ({
  _id: contentId,
  // shareInfo, // {}
  recommendedBy, // {}
  durationText,
  priceTag,
  skillTags = [], // [ {} ]
  // goalInfo, // {}
  url, // "" (URL)
  title, // ""
  // icon, // "" (ICON CLASS)
  type, // ""
  sourceInfo, // {}
  author, // ""
  // options = [], // [ [ {} ] ]
  courseLevel, // ""
  // source: { name: sourceName, iconSource: contentSourceIcon },
  // title: content,
  details,
  // author,
  // price: { value },
  // type,
  selected,
  onSelect = function() {},
  onEdit = function() {},
  onLinkClick = function() {},
  // relatedPrimarySkills,
  inManagement,
  // url,
  borderBottom,
  // goalName,
  // mainTags = [],
  // secondaryTags = [],
  status,
  endDate,
  certified,
  isAwinException, // ADDED SO AWIN SCRIPT DOES NOT OVERRIDE LINKS NOT FROM OUR AWIN CAMPAIGN (E.G. UDEMY)
  // contentStartedAt,
  // recommendedBy,
  // recommendedAt
  // goalId
  isMobile,
  uploadedBy,
  isOnGoalSetting,
  setOrder,
  index,
  totalItems,
  draggable,
  handleChangingNote,
  note,
  inOnboarding
}) => {
  const currentUser = useContext(UserContext)

  const isUsersOwnContent =
    currentUser && uploadedBy && currentUser?._id === uploadedBy?._id

  const capitalize = s =>
    (s && s[0].toUpperCase() + s.slice(1).toLowerCase()) || ''

  useEffect(() => {
    // NECESSARY FOR IMPACT LINK TRACKING
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])

  const mainClassName = borderBottom
    ? 'dev-item border-bottom'
    : `dev-item ${status !== 'COMPLETED' &&
        !inManagement &&
        `dev-item--selectable ${!selected && 'not-selected'}`} ${
        inOnboarding ? 'dev-item--onboarding' : ''
      }`

  return (
    <>
      {draggable ? (
        <>
          <div
            className='goal-item__list-item__order-icon'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div className='order-icon_container order-icon_container--order'>
              <i className='el-icon-minus'></i>
              <i className='el-icon-minus'></i>
              <i className='el-icon-minus'></i>
            </div>
          </div>
          <div className={`${mainClassName} item-mobile-${isMobile}`}>
            <div
              style={{
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div className='learning-item-new__content--order'>
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
                <div className='learning-item-new__title'>
                  <a
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={() => {
                      onLinkClick(contentId)
                      window.analytics &&
                        window.analytics.track('click', {
                          contentId
                        })
                    }}
                    {...(!isAwinException && { 'data-awinignore': true })}
                    // rel="noopener noreferrer"
                  >
                    {title}
                  </a>
                </div>
                <div className='learning-item-new__author'>{author}</div>
              </div>
              <div className='dev-item__icons-wrapper__set--delete__drag'>
                <i
                  className='el-icon-close'
                  onClick={() => {
                    onSelect()
                    window.analytics &&
                      window.analytics.track('add_to_plan', {
                        contentId
                      })
                  }}
                />
              </div>
            </div>
            <style jsx>{callToActionStyle}</style>
            <style jsx>{developmentPlanRecommendationStyle}</style>
            <style jsx>{learningItemNewStyle}</style>
          </div>
        </>
      ) : (
        <div className={`${mainClassName} item-mobile-${isMobile}`}>
          {certified && (
            <div className='learning-item-new__certified'>
              <Tooltip
                content={(sourceInfo && sourceInfo.certText) || 'Certified'}
                zIndex={11}
                fontSize='11px'
                padding={3}
              >
                <img src={certificateStar} />
                <img
                  className='learning-item-new__certified__ribbon'
                  src={certificateRibbon}
                />
              </Tooltip>
            </div>
          )}
          <div style={{ width: '100%', position: 'relative' }}>
            <div className='learning-item__new__number'>{index + 1}</div>
            <div className='learning-item-new__content'>
              {recommendedBy && (
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
              <div className='learning-item-new__label-tags'>
                <div className='learning-item-new__label-tags-wrapper'>
                  {certified && (
                    <div className='learning-item-new__certified--small'>
                      <Tooltip
                        className='learning-item-new__certified--small-tooltip'
                        content={
                          (sourceInfo && sourceInfo.certText) || 'Certified'
                        }
                        zIndex={11}
                        fontSize='11px'
                        padding={3}
                      >
                        <img
                          className='learning-item-new__certified__ribbon-small'
                          src={certificateRibbon}
                        />
                      </Tooltip>
                    </div>
                  )}
                  <div className='learning-item-new__type'>
                    <span
                      className='learning-item-new__label-tag'
                      style={{
                        color: '#152540',
                        backgroundColor: '#d9e1ee',
                        borderRadius: '4px'
                      }}
                    >
                      {capitalize(type)}
                    </span>
                  </div>
                  {durationText && (
                    <div className='learning-item-new__duration'>
                      <i className='el-icon-time clock-icon' />
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
                <div
                  className='learning-item-new__price'
                  style={{ color: priceTag.color }}
                  // style={{ color: '#128945' }}
                >
                  {priceTag.text}
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
                {/* USER REVIEWS */}
              </div>
              {courseLevel && (
                <div className='learning-item-new__level'>{courseLevel}</div>
              )}
              <div className='learning-item-new__title'>
                <a
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => {
                    onLinkClick(contentId)
                    window.analytics &&
                      window.analytics.track('click', {
                        contentId
                      })
                  }}
                  {...(!isAwinException && { 'data-awinignore': true })}
                  // rel="noopener noreferrer"
                >
                  {title}
                </a>
              </div>
              <div className='learning-item-new__author'>{author}</div>
            </div>
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
            <div className='learning-item-new__input'>
              <TextEditor
                placeholder='Add short explanation why this content is in the learning path '
                value={note}
                handleChange={value => {
                  handleChangingNote(contentId, value)
                }}
              />
            </div>
            {isUsersOwnContent && (
              <div
                className='learning-item-new__options'
                style={{
                  justifyContent: 'space-between',
                  padding: '18px 24px 24px 20px',
                  borderTop: '1px solid #D9E1EE'
                }}
              >
                <div
                  className='call-to-action__option call-to-action__option--active'
                  style={{ color: '#E89C36' }}
                  onClick={() => onEdit(contentId)}
                >
                  <EditIcon className='edit__icon' />
                  <p>Edit Item</p>
                </div>
                {uploadedBy && (
                  <div className='upload-person'>
                    Uploaded by:{' '}
                    <span>{`${uploadedBy.firstName} ${uploadedBy.lastName}`}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {status && status === 'COMPLETED' ? (
            <div className='dev-item__icons' style={{ cursor: 'default' }}>
              <p>
                Completed
                {endDate ? `: ${new Date(endDate).toDateString()}` : ''}
              </p>
            </div>
          ) : (
            <div className='dev-item__icons'>
              <div
                className='dev-item__icons-wrapper'
                onClick={() => {
                  onSelect()
                  window.analytics &&
                    window.analytics.track('add_to_plan', {
                      contentId
                    })
                }}
              >
                {/* {isOnGoalSetting && selected && (
              <>
                {index !== 0 ? (
                  <i
                    className={`icon icon-small-down icon-rotate-180`}
                    onClick={() => {
                      setOrder(index, -1)
                    }}
                  />
                ) : (
                  <div />
                )}
              </>
            )} */}
                <div
                  className={
                    selected
                      ? 'dev-item__icons-wrapper__set dev-item__icons-wrapper__set--delete'
                      : 'dev-item__icons-wrapper__set'
                  }
                >
                  <i
                    className={`icon ${
                      selected ? 'el-icon-close' : 'el-icon-plus'
                    }`}
                  />
                </div>
                {/* {isOnGoalSetting && selected && (
              <>
                {index !== totalItems - 1? (
                  <i
                    className={`icon icon-small-down`}
                    onClick={() => {
                      setOrder(index, 1)
                    }}
                  />
                ) : (
                  <div />
                )}
              </>
            )} */}
              </div>
            </div>
          )}
          <style jsx>{callToActionStyle}</style>
          <style jsx>{developmentPlanRecommendationStyle}</style>
          <style jsx>{learningItemNewStyle}</style>
        </div>
      )}
    </>
    // <div className={mainClassName}>
    //   <div className="dev-item__wrapper">
    //     <div className="dev-item__content">
    //       {recommendedBy && (
    //         <div className="dev-item__recommended">
    //           <img
    //             className="dev-item__recommended-image"
    //             src={recommendedBy.imageLink || userPlaceholder}
    //             alt="Profile picture"
    //           />
    //           Recommended by:
    //           <strong>
    //             {'  '}
    //             {recommendedBy.firstName} {recommendedBy.lastName}
    //           </strong>
    //         </div>
    //       )}
    //       {/* {goalName && <div className="dev-item__goal-name">{goalName}</div>} */}
    //       <div className="dev-item__label">
    //         {contentIcon}
    //         <div className="dev-item__label-name">
    //           {contentLabel}
    //           {sourceName && ': '}
    //           {sourceName && <strong>{sourceName}</strong>}
    //         </div>
    //         {contentSourceIcon && (
    //           <div className="dev-item__label-source-img">
    //             <img src={contentSourceIcon} alt="source icon" />
    //           </div>
    //         )}
    //         <div className="dev-item__paid">{isPaid && 'Paid'}</div>

    //         {status && status === 'IN PROGRESS' && contentStartedAt && (
    //           <div className="dev-item__inProgress">
    //             In Progress Since: {new Date(contentStartedAt).toDateString()}
    //           </div>
    //         )}
    //       </div>
    //       {courseLevel && (
    //         <div className="dev-item__sophistication">{courseLevel}</div>
    //       )}
    //       <div className={`dev-item__text ${teamClass}`}>
    //         <a href={url} target="_bblank">
    //           {content}
    //         </a>
    //       </div>
    //       {details && <div className="dev-item__details">{details}</div>}
    //       {author && (
    //         <div className="dev-item__author">{author.split(',')[0]}</div>
    //       )}
    //     </div>
    //     <div className="dev-item__caption">
    //       {mainTags.length > 0 &&
    //         mainTags.map((skill, ix) => (
    //           <div
    //             key={`maintag${ix}`}
    //             className="dev-item__skill-tag dev-item__skill-tag--main"
    //           >
    //             {skill.name}
    //           </div>
    //         ))}
    //       {secondaryTags.length > 0 &&
    //         secondaryTags.map((skill, ix) => (
    //           <div key={`secondtag${ix}`} className="dev-item__skill-tag">
    //             {skill.name}
    //           </div>
    //         ))}
    //     </div>
    //   </div>
    //   {/* {selected ? (
    //       <div className="dev-item__completed-img">
    //         <img src={require('../../static/check.svg')} alt="" />
    //       </div>
    //     ) : ( */}

    //   {status && status === 'COMPLETED' ? (
    //     <div className="dev-item__icons" style={{ cursor: 'default' }}>
    //       <p>
    //         Completed{endDate ? `: ${new Date(endDate).toDateString()}` : ''}
    //       </p>
    //     </div>
    //   ) : (
    //     <div className="dev-item__icons" onClick={onSelect}>
    //       <i
    //         className={`icon ${selected ? 'el-icon-minus' : 'el-icon-plus'}`}
    //       />
    //     </div>
    //   )}
    //   <style jsx>{developmentPlanRecommendationStyle}</style>
    // </div>
  )
}
