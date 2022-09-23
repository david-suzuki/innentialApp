import React from 'react'
import { SkillItemAdmin, List, Statement } from './'
import skillItemStyle from '../../styles/skillItemStyle'
import userPlaceholder from '$/static/nobody.jpg'
import history from '../../history'

const SkillItemsAdmin = props => {
  const skillList = props.items.map((skill, index) => {
    return (
      <SkillItemAdmin
        key={`${props.teamId}:${skill.skillId}`}
        id={skill.skillId || skill.id}
        name={skill.name}
        usersForTooltip={skill.usersForTooltip}
        users={skill.users}
        usersInOrganization={skill.usersInOrganization}
        onlyAvailableSkills={props.onlyAvailableSkills}
        onOrganizationTab={props.onOrganizationTab}
        availableInOrganization={skill.usersInOrganization > 0}
        userImage={skill.userImage}
        skillAvailable={skill.skillAvailable}
        skillNeeded={skill.skillNeeded}
        isUnavailable={skill.skillAvailable === 0}
        teamId={props.teamId}
        withLink={props.withLink}
        isAdmin={props.isAdmin}
        displayUser={props.displayUser}
        displayEvaluated={
          props.displayEvaluated ||
          (skill.users.length > 0 &&
            props.viewingUser &&
            skill.users[0].id === props.viewingUser._id)
        }
        evaluatedLevel={skill.evaluatedLevel}
        displayRequired={props.displayRequired}
        tooltip={props.tooltip}
      />
    )
  })
  return (
    <div>
      {props.teamName && (
        <div className='list__section-title list__section-title--margin-bottom align-left skills-title-wrapper'>
          <h3>{props.teamName}</h3>
          <a
            className='skills-evaluate-button'
            onClick={e => {
              e.preventDefault()
              history.push('/evaluate', {
                teamId: props.teamId,
                forceEval: true,
                redirect: `/organization/skills`
              })
            }}
          >
            Set Required Skills <span>&#8594;</span>
          </a>
        </div>
      )}
      <List noPadding noBoxShadow noBackground>
        <div className='skills__list'>{skillList}</div>
        {skillList.length === 0 && (
          <Statement content='No skills matching criteria' />
        )}
      </List>
      <style jsx>{skillItemStyle}</style>
    </div>
  )
}

SkillItemsAdmin.defaultProps = {
  items: [
    {
      id: 1,
      name: 'UX',
      skillAvailable: 1,
      skillNeeded: 4,
      userImage: userPlaceholder,
      users: [
        {
          id: 1,
          image: userPlaceholder,
          url: ''
        },
        {
          id: 2,
          image: userPlaceholder,
          url: ''
        }
      ]
    },
    {
      id: 2,
      name: 'Video production',
      skillAvailable: 0,
      skillNeeded: 4,
      users: [
        {
          id: 1,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        },
        {
          id: 2,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        },
        {
          id: 3,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        },
        {
          id: 4,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        }
      ]
    },
    {
      id: 3,
      name: 'Video production',
      skillAvailable: 4,
      skillNeeded: 5,
      users: [
        {
          id: 1,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        },
        {
          id: 2,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        }
      ]
    },
    {
      id: 4,
      name: 'Video production',
      skillAvailable: 3,
      skillNeeded: 4,
      users: [
        {
          id: 1,
          image: userPlaceholder,
          url: ''
        },
        {
          id: 2,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        },
        {
          id: 3,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        },
        {
          id: 4,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        },
        {
          id: 5,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        },
        {
          id: 6,
          name: 'John Doe',
          image: userPlaceholder,
          url: ''
        }
      ]
    }
  ]
}

export default SkillItemsAdmin
