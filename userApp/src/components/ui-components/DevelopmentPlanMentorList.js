import React from 'react'
import { DevelopmentPlanMentor, List, UserItemWithSkill } from './'

export default ({
  mentors = [],
  inManagement,
  onSelect = () => {},
  inSummary
  // selectedMentors = []
}) => {
  if (inManagement || inSummary) {
    return (
      <List noBoxShadow={inSummary} noPadding={inSummary}>
        {mentors.map(mentor => {
          return <UserItemWithSkill key={mentor._id} {...mentor} />
        })}
      </List>
    )
  } else {
    return mentors.map(mentor => {
      return (
        <DevelopmentPlanMentor
          key={mentor._id}
          {...mentor}
          // selected={selectedMentors.some(({ _id }) => _id === mentor._id)}
          onSelect={() => onSelect(mentor, 'selectedMentors')}
        />
      )
    })
  }
}
