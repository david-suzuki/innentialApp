import React from 'react'
import skillItemStyle from '../../styles/skillItemStyle'
import { NavLink } from 'react-router-dom'
import history from '../../history'
import { SkillBar } from './'
import variables from '../../styles/variables'

const SkillItemAdmin = ({
  id,
  name,
  users,
  usersInOrganization,
  usersForTooltip = [],
  skillAvailable,
  skillNeeded,
  evaluatedLevel,
  teamId,
  withLink,
  isAdmin,
  displayUser,
  userImage,
  isUnavailable,
  onlyAvailableSkills,
  onOrganizationTab,
  displayEvaluated,
  availableInOrganization,
  // displayRequired,
  tooltip
}) => {
  if (!usersInOrganization) usersInOrganization = 0
  if (onlyAvailableSkills) usersInOrganization = users

  const usersLevel =
    evaluatedLevel > 0 && displayEvaluated ? evaluatedLevel : skillAvailable

  return (
    <div className='list-item skill-item'>
      <div className='skill__name-wrapper'>
        <div className='skill-name'>{name}</div>
        <div className='level-bar__wrapper'>
          {usersLevel > 0 && (
            <div>
              <SkillBar
                value={usersLevel}
                tooltip={usersForTooltip}
                nOfUsers={users}
              />
            </div>
          )}
          {skillNeeded > 0 && (
            <div>
              <SkillBar value={skillNeeded} color={variables.brandSecondary} />
            </div>
          )}
        </div>
        <div className='skill__information-label'>
          People who have this skill
        </div>
        <div className='skill__users'>
          <div className='skill__users-item'>
            {withLink &&
              !isUnavailable &&
              !onlyAvailableSkills &&
              !onOrganizationTab && (
                <>
                  <NavLink
                    exact
                    to={{
                      pathname: `/skill/${id}`,
                      state: { teamId, skillName: name }
                    }}
                  >
                    <div className='skill__users-item-count'>{users}</div>
                  </NavLink>
                  <NavLink
                    exact
                    to={{
                      pathname: `/skill/${id}`,
                      state: { teamId, skillName: name }
                    }}
                  >
                    <div className='skill__users-item-count-label'>
                      {users > 1 ? 'People' : 'Person'}
                      {isAdmin ? ' in team' : ' in my team'}
                    </div>
                  </NavLink>
                </>
              )}
          </div>
          <div className='skill__users-item'>
            {isUnavailable && !availableInOrganization && (
              <a
                onClick={e => e.preventDefault()}
                style={{ cursor: 'not-allowed' }}
              >
                Unavailable in the organization
              </a>
            )}
            {((isAdmin && availableInOrganization) || onOrganizationTab) && (
              <>
                <NavLink
                  exact
                  to={{
                    pathname: `/skill/${id}`,
                    state: { excludedTeam: teamId, skillName: name }
                  }}
                >
                  <div className='skill__users-item-count'>
                    {onOrganizationTab ? users : usersInOrganization}
                  </div>
                </NavLink>
                <NavLink
                  exact
                  to={{
                    pathname: `/skill/${id}`,
                    state: { excludedTeam: teamId, skillName: name }
                  }}
                >
                  <div className='skill__users-item-count-label'>
                    {onOrganizationTab
                      ? users > 1
                        ? 'People'
                        : 'Person'
                      : usersInOrganization > 1
                      ? 'People'
                      : 'Person'}
                    {' In the organization'}
                  </div>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx>{skillItemStyle}</style>
    </div>
  )
}

export default SkillItemAdmin
