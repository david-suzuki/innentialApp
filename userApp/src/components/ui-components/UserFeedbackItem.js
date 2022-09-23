import React, { useContext } from 'react'
import { UserHeading, SkillsFrameworkListStars, PostFinanceLevel } from './'
import feedbackItemStyle from '../../styles/feedbackItemStyle'
import { UserContext } from '../../utils'

export default ({
  evaluatedBy,
  evaluatedAt,
  content,
  skills,
  evaluated,
  given
}) => {
  const userToDisplay = given ? evaluated : evaluatedBy

  const user = useContext(UserContext)

  const corporate = user?.corporate

  const headingProps = userToDisplay
    ? {
        name: userToDisplay.firstName
          ? `${userToDisplay.firstName} ${userToDisplay.lastName} ${
              given || userToDisplay.isPlatformUser
                ? ''
                : `(${userToDisplay.email})`
            }`
          : userToDisplay.email,
        date: new Date(evaluatedAt).toDateString(),
        imageLink: userToDisplay.imageLink,
        _id: given || userToDisplay.isPlatformUser ? userToDisplay._id : null
      }
    : {
        date: new Date(evaluatedAt).toDateString(),
        name: given ? 'User deleted' : 'Anonymous',
        imageLink: null,
        _id: null
      }

  return (
    <div className='feedback-item'>
      <UserHeading {...headingProps}>
        {given ? <span style={{ marginRight: '8px' }}>Sent to: </span> : null}
      </UserHeading>
      {content && (
        <div
          className='feedback-item__feedback-wrapper'
          dangerouslySetInnerHTML={{
            __html: content
          }}
        />
      )}
      {skills.length > 0 && (
        <div
          className='feedback-item__skills-wrapper'
          style={{ borderTop: content ? '1px solid #ececec' : 'none' }}
        >
          {skills.map(({ _id, name, level }) => (
            <div key={_id} className='feedback-item__skill'>
              <span style={{ maxWidth: '75%' }}>{name}:</span>
              {corporate ? (
                <PostFinanceLevel level={level} />
              ) : (
                <SkillsFrameworkListStars level={level} />
              )}
            </div>
          ))}
        </div>
      )}
      <style>{feedbackItemStyle}</style>
    </div>
  )
}
