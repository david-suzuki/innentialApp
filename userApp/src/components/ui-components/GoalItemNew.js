import { Button } from 'element-react'
import styles from '../../styles/goalItemNewStyle'

import Ribbon from '../ui-components/ribbon'

import Clock from '../../static/clock.svg'
import Video from '../../static/video.svg'
import Article from '../../static/article.svg'
import Lock from '../../static/lock.svg'
import Loader_learning from '../../static/loader-learning.svg'
import Course from '../../static/course.svg'
import Send from '../../static/send.svg'
import Loader from '../../static/loader.svg'
import Certificate from '../../static/certificate.svg'
import { remapLearningContentForUI } from '../ui-components'

const GoalItem = props => {
  const {
    approved,
    request,
    fulfillmentRequest,
    content: { author, title, type, source, imageLink },
    status,
    durationText,
    note: description
  } = props
  const { priceTag } = remapLearningContentForUI(props)
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
      <div className='goal-item__completed-button'>
        {type === 'E-LEARNING' &&
          (status === 'NOT STARTED' ||
            (approved === null && request !== null)) && (
            <svg
              width='32'
              height='32'
              viewBox='0 0 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='15.75' cy='15.75' r='15.75' fill='#FEBB5B' />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10.5 15C10.0858 15 9.75 15.3358 9.75 15.75V21C9.75 21.4142 10.0858 21.75 10.5 21.75H21C21.4142 21.75 21.75 21.4142 21.75 21V15.75C21.75 15.3358 21.4142 15 21 15H10.5ZM8.25 15.75C8.25 14.5074 9.25736 13.5 10.5 13.5H21C22.2426 13.5 23.25 14.5074 23.25 15.75V21C23.25 22.2426 22.2426 23.25 21 23.25H10.5C9.25736 23.25 8.25 22.2426 8.25 21V15.75Z'
                fill='white'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M15.75 8.25C14.9544 8.25 14.1913 8.56607 13.6287 9.12868C13.0661 9.69129 12.75 10.4544 12.75 11.25V14.25C12.75 14.6642 12.4142 15 12 15C11.5858 15 11.25 14.6642 11.25 14.25V11.25C11.25 10.0565 11.7241 8.91193 12.568 8.06802C13.4119 7.22411 14.5565 6.75 15.75 6.75C16.9435 6.75 18.0881 7.22411 18.932 8.06802C19.7759 8.91193 20.25 10.0565 20.25 11.25V14.25C20.25 14.6642 19.9142 15 19.5 15C19.0858 15 18.75 14.6642 18.75 14.25V11.25C18.75 10.4544 18.4339 9.69129 17.8713 9.12868C17.3087 8.56607 16.5456 8.25 15.75 8.25Z'
                fill='white'
              />
            </svg>
          )}
        {(type === 'ARTICLE' || type === 'BOOK' || type === 'PODCAST') &&
          (status === 'NOT STARTED' || approved === true) && (
            <svg
              width='32'
              height='32'
              viewBox='0 0 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='15.75' cy='15.75' r='15.75' fill='#347EB6' />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M23.0303 8.46967C23.3232 8.76256 23.3232 9.23744 23.0303 9.53033L14.7803 17.7803C14.4874 18.0732 14.0126 18.0732 13.7197 17.7803C13.4268 17.4874 13.4268 17.0126 13.7197 16.7197L21.9697 8.46967C22.2626 8.17678 22.7374 8.17678 23.0303 8.46967Z'
                fill='white'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M23.0303 8.46969C23.2341 8.67342 23.3031 8.97584 23.2079 9.24778L17.9579 24.2478C17.8563 24.538 17.5878 24.7369 17.2806 24.7494C16.9733 24.7619 16.6895 24.5856 16.5646 24.3046L13.6818 17.8182L7.1954 14.9354C6.91439 14.8105 6.73809 14.5267 6.75063 14.2194C6.76316 13.9122 6.96199 13.6437 7.25224 13.5421L22.2522 8.29213C22.5242 8.19695 22.8266 8.26596 23.0303 8.46969ZM9.53331 14.333L14.5546 16.5647C14.7243 16.6401 14.86 16.7757 14.9354 16.9454L17.167 21.9667L21.2775 10.2225L9.53331 14.333Z'
                fill='white'
              />
            </svg>
          )}
        {type === 'VIDEO' && status === 'NOT STARTED' && (
          <svg
            width='32'
            height='32'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle cx='15.75' cy='15.75' r='15.25' stroke='#4ACF89' />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M22.2803 10.2197C22.5732 10.5126 22.5732 10.9874 22.2803 11.2803L14.0303 19.5303C13.7374 19.8232 13.2626 19.8232 12.9697 19.5303L9.21967 15.7803C8.92678 15.4874 8.92678 15.0126 9.21967 14.7197C9.51256 14.4268 9.98744 14.4268 10.2803 14.7197L13.5 17.9393L21.2197 10.2197C21.5126 9.92678 21.9874 9.92678 22.2803 10.2197Z'
              fill='#4ACF89'
            />
          </svg>
        )}
        {status === 'IN PROGRESS' && (
          <svg
            width='32'
            height='32'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle cx='15.75' cy='15.75' r='15.25' stroke='#4ACF89' />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M22.2803 10.2197C22.5732 10.5126 22.5732 10.9874 22.2803 11.2803L14.0303 19.5303C13.7374 19.8232 13.2626 19.8232 12.9697 19.5303L9.21967 15.7803C8.92678 15.4874 8.92678 15.0126 9.21967 14.7197C9.51256 14.4268 9.98744 14.4268 10.2803 14.7197L13.5 17.9393L21.2197 10.2197C21.5126 9.92678 21.9874 9.92678 22.2803 10.2197Z'
              fill='#4ACF89'
            />
          </svg>
        )}
        {status === 'COMPLETED' && (
          <svg
            width='32'
            height='32'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              cx='15.75'
              cy='15.75'
              r='15.25'
              fill='#4ACF89'
              stroke='#1CB55C'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M22.2803 10.7197C22.5732 11.0126 22.5732 11.4874 22.2803 11.7803L14.0303 20.0303C13.7374 20.3232 13.2626 20.3232 12.9697 20.0303L9.21967 16.2803C8.92678 15.9874 8.92678 15.5126 9.21967 15.2197C9.51256 14.9268 9.98744 14.9268 10.2803 15.2197L13.5 18.4393L21.2197 10.7197C21.5126 10.4268 21.9874 10.4268 22.2803 10.7197Z'
              fill='white'
            />
          </svg>
        )}
      </div>
    )
  }

  const generateButton = () => {
    if (type === 'VIDEO') {
      return (
        <Button className='goal-item__watching'>
          <img src={Video} alt='Video' />
          {status === 'IN PROGRESS' && <>Continue Watching</>}
          {status === 'NOT STARTED' && <>Watch Video</>}
          {status === 'COMPLETED' && <>Completed</>}
        </Button>
      )
    }
    if (type === 'ARTICLE') {
      return (
        <Button
          className={`goal-item__watching ${type.toLowerCase()} ${status
            .toLowerCase()
            .replaceAll(' ', '-')}`}
        >
          {status === 'NOT STARTED' && <img src={Send} alt='send' />}
          {status === 'AWAITING FULFILLMENT' && (
            <img src={Loader} alt='loader' />
          )}
          {(status === 'IN PROGRESS' || status === 'COMPLETED') && (
            <img src={Article} alt='article' />
          )}
          {status === 'AWAITING FULFILLMENT' && fulfillmentRequest === null && (
            <>Request Delivery</>
          )}
          {status === 'AWAITING FULFILLMENT' && fulfillmentRequest !== null && (
            <>Waiting for Delivery</>
          )}
          {status === 'IN PROGRESS' && <>Continue Reading</>}
          {approved === true && <>Start Reading</>}
          {status === 'COMPLETED' && <>Completed</>}
        </Button>
      )
    }
    if (type === 'E-LEARNING') {
      return (
        <Button
          className={`goal-item__watching ${type.toLowerCase()} ${status
            .toLowerCase()
            .replaceAll(' ', '-')}`}
        >
          {status === 'NOT STARTED' &&
            (approved !== null || request === null) && (
              <img src={Lock} alt='send' />
            )}
          {approved === null && request !== null && (
            <img src={Loader_learning} alt='loader' />
          )}
          {(status === 'IN PROGRESS' || status === 'COMPLETED') && (
            <img src={Course} alt='article' />
          )}
          {approved === null && request === null && <>Request Approval</>}
          {approved === null && request !== null && <>Waiting for Approval</>}
          {status === 'IN PROGRESS' && <>Back to Course</>}
          {approved === true && <>Go to Course</>}
          {status === 'COMPLETED' && <>Completed</>}
        </Button>
      )
    }
    return <Button className='goal-item__watching'>Start Watching</Button>
  }

  return (
    <>
      <style>{styles}</style>
      <div className='goal-item__cardContainer'>
        <div className='goal-item__cardBody'>
          <div className='goal-item__header'>
            <div className='goal-item__tags'>
              <Ribbon
                text={
                  <>
                    <span
                      className={`goal-item__status-icon ${status
                        .toLowerCase()
                        .replaceAll(' ', '-')}`}
                    />
                    <b style={{ paddingLeft: '18px' }}>
                      {status.toLowerCase()}
                    </b>
                  </>
                }
                customStyle={{
                  padding: '4px 6px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  lineHeight: '18px',
                  color:
                    approved === null
                      ? '#FEBB5B'
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
              />
              {type === 'E-LEARNING' && (
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
            </div>
            <div className='goal-item__tags'>
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
              {priceTag && (
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
              )}
              {durationText && (
                <span className='goal-item__duration'>
                  <img src={Clock} alt='duration' />
                  {durationText}
                </span>
              )}
              {source && (
                <div className='goal-item__source'>
                  {source.iconSource ? (
                    <img src={source.iconSource} alt='source' />
                  ) : (
                    source.name
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='goal-item__title'>
            {generateTitleIcon()}
            {title}
          </div>
          {author && <div className='goal-item__author'>{updatedAuthor}</div>}
          {description && (
            <div
              className='goal-item__description'
              dangerouslySetInnerHTML={{
                __html: description
              }}
            />
          )}
          <div className='goal-item__footer'>
            {generateButton()}
            <Button className='goal-item__skip'>Skip</Button>
          </div>
        </div>
        {imageLink && <img src={imageLink} alt='Card Background' />}
      </div>
    </>
  )
}

export default GoalItem
