import React from 'react'
import teamHeadingStyle from '../../styles/teamHeadingStyle'
import history from '../../history'
// import { Button } from 'element-react'

const TeamHeading = ({
  /* engagement, stage, chart, teamId, */

  teamName
  // userIsTeamsLeader,
  // teamId
}) => {
  return (
    <div className='team-heading'>
      <div className='team-heading__department-wrapper'>
        <i className='icon icon-small-right' onClick={e => history.goBack()} />
        <div className='team-heading__title-wrapper'>
          <div className='list-item__label'>Team</div>
          <div className='list-item__title'>{teamName}</div>
        </div>
      </div>
      {/* {stage && engagement ? (
        <div className="team-heading__data-wrapper">
          <div>
            Stage <span>{stage}</span>
          </div>
          <div>
            Engagement <span>{engagement}</span>
          </div>
        </div>
      ) : null} */}
      {/* {userIsTeamsLeader && (
        <Button
          type="primary"
          onClick={e => history.push('/create/reviews', { teamId }) }
        >
          Open Review for Team
        </Button>
      )} */}
      <style jsx>{teamHeadingStyle}</style>
    </div>
  )
}

export default TeamHeading
