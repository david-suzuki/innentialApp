import React from 'react'
// import { Link } from 'react-router-dom'
import { Tag } from 'element-react'
import learningPathItemNewStyle from '../../../../styles/learningPathItemNewStyle'
import Clock from '../../../../static/clock.png'

const LearningPathItemOnboarding = ({
  _id: pathId,
  labels,
  skillTags,
  name = '',
  // level = '',
  // author = '',
  abstract = '',
  duration,
  targetGroup = '',
  // goalTemplates = [],
  imageLink,
  team,
  handleClick = () => {}
}) => {
  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className='learning-path-item-new'>
        <div className='learning-path-item-new__wrapper'>
          {/* {team && (
            <div className='learning-path-item-new__team'>
              <i className='icon icon-multiple' />
              Team: <span>{team.teamName}</span>
            </div>
          )} */}
          <div className='learning-path-item-new__image'>
            <img
              src={
                imageLink ||
                require('../../../../static/learning-path-picture.png')
              }
              alt=''
            />
            <div className='learning-path-item-new__preview-tag'>
              Preview{' '}
              <i
                style={{ verticalAlign: 'middle' }}
                className='icon icon-diag-top-right'
              />
            </div>
          </div>
          <div className='learning-path-item-new__content'>
            <Tag type='success'>LEARNING PATH</Tag>
            <div className='learning-path-item-new__heading'>{name}</div>
            {abstract && (
              <div className='learning-path-item-new__description'>
                {abstract}
              </div>
            )}
          </div>
        </div>
        {duration && (
          <div className='learning-path-item-new__timer'>
            <img src={Clock} alt='' />
            <span>{duration}</span>
          </div>
        )}
      </div>
      <style jsx>{learningPathItemNewStyle}</style>
    </div>
  )
}

export default React.memo(LearningPathItemOnboarding)
