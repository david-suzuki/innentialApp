import React from 'react'
import { generateInitialsAvatar, generateSpecialAvatar } from '$/utils'
import { Link, useParams } from 'react-router-dom'
import pastEventStyle from '$/styles/pastEventStyle'
import { ReactComponent as IconClock } from '$/static/clock.svg'
import { ReactComponent as IconSend } from '$/static/send-icon.svg'
import { ReactComponent as IconHeart } from '$/static/heart.svg'
import { ReactComponent as IconShare } from '$/static/share-icon.svg'
import { fetchEventById } from '../../api'
import { useQuery } from '@apollo/react-hooks'
import { captureFilteredError, LoadingSpinner } from '../general'

const DUMMY_FILES = [
  {
    _id: 10,
    type: 'Video',
    duration: '7 min',
    paid: false,
    price: null,
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: { _id: 21, firstName: 'John', lastName: 'Krasinsky' },
    description:
      'Blinkist summarizes deep work into five key ideas that you can easily listen to or read.',
    imageLink: null
  },
  {
    _id: 11,
    type: 'Video',
    duration: '7 min',
    paid: false,
    price: null,
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: { _id: 22, firstName: 'John', lastName: 'Krasinsky' },
    description:
      'Blinkist summarizes deep work into five key ideas that you can easily listen to or read.',
    imageLink: null
  }
]

const EventFile = ({ file }) => {
  const imgSrc =
    file.imageLink === null
      ? require('$/static/learning-path-picture.png')
      : file.imageLink

  return (
    <div className='file__container'>
      <div className='file__card'>
        <div className='file__info'>
          <div className='file__info-left'>
            <div className='file__info-left__type'>{file.type}</div>
            <div className='file__info-left__duration'>
              <IconClock className='file__info-icon__clock' />
              <span>{file.duration}</span>
            </div>
          </div>
          <div className='file__info-right'>
            <div className='file__info-right__price-tag'>
              {file.paid === false && file.price !== null && (
                <span>{file.price}</span>
              )}
              {file.paid === false && <span>FREE</span>}
            </div>
          </div>
        </div>
        <div className='file__summary'>
          <div className='file__title'>{file.title}</div>
          <div className='file__author'>
            <span>Author:</span>{' '}
            <Link to={`/users/${file.author._id}`}>
              {file.author.firstName} {file.author.lastName}
            </Link>
          </div>
          <div className='file__description'>
            <div className='file__description-text'>{file.description}</div>
          </div>
          <div className='file__buttons'>
            <button className='el-button el-button--primary file__buttons-start__button'>
              <IconSend className='file__buttons-icon__send' />
              <span>Get Started</span>
            </button>
            <div className='file__buttons-save'>
              <IconHeart className='file__buttons-icon__save' />
              Save for Later
            </div>
            <div className='file__buttons-share'>
              <IconShare className='file__buttons-icon__share' />
              Share
            </div>
          </div>
        </div>
      </div>
      <div
        className='file__image'
        style={{
          backgroundImage: `url(${imgSrc})`
        }}
      />
    </div>
  )
}

const PastEvent = ({ currentUser, eventFiles = DUMMY_FILES }) => {
  let { eventId } = useParams()

  const { data, loading, error } = useQuery(fetchEventById, {
    variables: {
      eventId
    }
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const event = (data && data.fetchEventById) || {}

  const currentUserInvitation = event.invitations.find(
    invitation => invitation._id === currentUser._id
  )

  const imgSrc = !event.imageLink
    ? require('$/static/learning-path-picture.png')
    : data.imageLink

  return (
    <div className='component-block--paths'>
      <Link to='/events'>
        <div className='back__button'>
          <i className='icon icon-small-right icon-rotate-180' />
          Back
        </div>
      </Link>

      <div className='event-container'>
        <div className='event-panel'>
          <div className='event-panel__info'>
            <div className='event-panel__info-top'>
              <div className='info__main-title'>{event.title}</div>
              <div className='info__main-description'>{event.description}</div>
            </div>
            <div className='event-panel__info-bottom'>
              <div className='info__skills'>
                <span className='info__skills-title'>Related Skills:</span>
                <div className='info__skills-skills'>
                  {event.skills.map(skill => (
                    <div key={skill._id} className='info__skills-skills__skill'>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <img
            className='event-panel__background'
            src={imgSrc}
            alt='background'
          />
        </div>
        <div className='event-files'>
          <div className='event-files__title'>Event Files:</div>
          <div className='event-files__list'>
            {eventFiles.map(e => (
              <EventFile key={e._id} file={e} />
            ))}
          </div>
        </div>
        <style jsx>{pastEventStyle}</style>
      </div>
    </div>
  )
}

export default PastEvent
