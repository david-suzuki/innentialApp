import React, { useEffect } from 'react'
import styles from './style.js'

import Ribbon from '../ribbon'

import Clock from '../../../static/clock.svg'

const awinWhitelist = ['www.edx.org']

const checkAwinException = url => {
  return awinWhitelist.includes(new URL(url).hostname)
}

const StepCard = props => {
  const {
    _id: contentId,
    url,
    author,
    type,
    priceTag,
    durationText,
    sourceInfo,
    title,
    description,
    imageLink
  } = props

  useEffect(() => {
    // NECESSARY FOR IMPACT LINK TRACKING
    if (typeof window.impactStat === 'function') {
      window.impactStat('transformLinks')
      window.impactStat('trackImpression')
    }
  }, [url])

  const isAwinException = checkAwinException(url)

  let updatedAuthor = ''
  if (author) {
    const lastChar = author.slice(-1)
    if (lastChar === ',') {
      updatedAuthor = author.slice(0, -1)
      updatedAuthor = updatedAuthor.replaceAll(',', ', ')
    } else updatedAuthor = author
  }
  return (
    <>
      <style>{styles}</style>
      <div className='step-card__cardContainer'>
        <div className='step-card__cardBody'>
          <div className='step-card__header'>
            <div className='step-card__tags'>
              <Ribbon
                text={type}
                customStyle={{
                  padding: '4px 6px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: 'RGB(26, 37, 61)',
                  background: 'RGB(219, 225, 237)',
                  marginRight: '16px',
                  borderRadius: '4px'
                }}
              />
              <Ribbon
                text={priceTag.text}
                customStyle={{
                  padding: '4px 6px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: priceTag.color,
                  border: '1px solid #D1F2E1',
                  marginRight: '16px',
                  borderRadius: '4px'
                }}
              />
              {durationText && (
                <span className='step-card__duration'>
                  <img src={Clock} alt='duration' />
                  {durationText}
                </span>
              )}
            </div>
            <div className='step-card__source'>
              {sourceInfo.icon ? (
                <img src={sourceInfo.icon} alt='source' />
              ) : (
                sourceInfo.name
              )}
            </div>
          </div>
          <div className='step-card__title'>
            <a
              href={url}
              target='_blank'
              // rel="noopener noreferrer"
              onClick={() => {
                window.analytics &&
                  window.analytics.track('click', {
                    contentId
                  })
                window.analytics &&
                  window.analytics.track('bump_content', {
                    contentId
                  })
              }}
              {...(!isAwinException && { 'data-awinignore': true })}
            >
              {title}
            </a>
          </div>
          {author && <div className='step-card__author'>{updatedAuthor}</div>}
          {description && (
            <div
              className='step-card__description'
              dangerouslySetInnerHTML={{
                __html: description
              }}
            />
          )}
        </div>
        {imageLink && <img src={imageLink} alt='Card Background' />}
      </div>
    </>
  )
}

export default StepCard
