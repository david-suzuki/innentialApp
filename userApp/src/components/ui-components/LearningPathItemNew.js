import React from 'react'
import { Link } from 'react-router-dom'
import { Tag } from 'element-react'
import learningPathItemNewStyle from '../../styles/learningPathItemNewStyle'
import Clock from '../../static/clock.png'
import { currentUserProfile } from '../../api'

const LearningPathItemNew = ({
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
  firstTeamName,
  userProgress,
  title
}) => {
  // const nameOfTeam = title?.split(' ')[0]

  return (
    <div>
      <Link to={`/learning-path/${pathId}`}>
        <div className='learning-path-item-new'>
          <div className='learning-path-item-new__wrapper'>
            {/* {firstTeamName && (
              <div className='learning-path-item-new__team'>
                <i className='icon icon-multiple' />
                Team: <span>{firstTeamName}</span>
              </div>
            )}
            {(team && nameOfTeam!== team.teamName) && (
              <div className='learning-path-item-new__team'>
                <i className='icon icon-multiple' />
                Team: <span>{team.teamName}</span>
              </div>
            )} */}
            <div className='learning-path-item-new__image'>
              <img
                src={
                  imageLink || require('../../static/learning-path-picture.png')
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
              <div className='learning-path-item-new_tags'>
                <Tag type='success'>LEARNING PATH</Tag>
                {userProgress.status === 'IN PROGRESS' && (
                  <Tag type='progress'>IN PROGRESS</Tag>
                )}
                {userProgress.status === 'COMPLETED' && (
                  <Tag type='completed'>COMPLETED</Tag>
                )}
              </div>
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
      </Link>
      <style jsx>{learningPathItemNewStyle}</style>
    </div>
  )
}

export default React.memo(LearningPathItemNew)
