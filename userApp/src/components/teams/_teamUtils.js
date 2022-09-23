import React from 'react'
import { generateInitialsAvatar } from '$/utils'
import userPlaceholder from '$/static/nobody.jpg'

export const deltaToIcon = delta => {
  if (delta > 0) {
    return 'icon-diag-top-right'
  } else if (delta < 0) {
    return 'icon-diag-bottom-right'
  } else {
    return ''
  }
}

export const remapTeamsForUI = (teams, isUserAdmin = false) => {
  return teams.map(team => {
    return {
      id: team._id,
      department: team.teamName,
      // engagement:
      //   team.stageResultInfo.engagement === 0
      //     ? 'Not available yet'
      //     : team.stageResultInfo.engagement,
      // engagementArrow:
      //   team.stageResultInfo.engagement === 0
      //     ? '  '
      //     : deltaToIcon(team.stageResultInfo.engagementDelta),
      // stage: !team.stageResultInfo.stage
      //   ? 'Not available yet'
      //   : team.stageResultInfo.stage.split(' ')[1],
      count: team.totalMembers + 1,
      children: isUserAdmin ? <i className='icon icon-menu-dots' /> : undefined
    }
  })
}

export const remapEmployeesForUI = employees => {
  return employees.map(employee => {
    return {
      id: employee._id,
      label: employee.teamInfo,
      name: employee.firstName
        ? `${employee.firstName} ${
            employee.lastName ? employee.lastName : `(${employee.email})`
          }`
        : employee.email,
      profession: employee.roleAtWork,
      email: employee.email,
      img: employee.imageLink
        ? employee.imageLink
        : generateInitialsAvatar({
            firstName: employee.firstName,
            lastName: employee.lastName,
            _id: employee._id
          }),
      status: employee.status,
      roles: employee.roles,
      isActive: employee.status === 'active',
      isDisabled: employee.status === 'inactive',
      location: employee.location,
      userDropdownOptions: employee.userDropdownOptions || [],
      children: employee.children,
      // children: employee.children ? (
      //   employee.children
      // ) : (
      //   <i className='icon icon-menu-dots' />
      // ),
      // neededSkills: employee.neededSkills,
      skills: employee.selectedSkills
    }
  })
}

export const findImageLinkInTeam = (uid, team) => {
  if (team.leader._id === uid) {
    if (team.leader.imageLink) return team.leader.imageLink
    else return generateInitialsAvatar(team.leader)
  }
  const member = team.members.find(m => m._id === uid)
  if (member) {
    if (member.imageLink) return member.imageLink
    else return generateInitialsAvatar(member)
  } else return userPlaceholder
}

export const findImageLinkInEmployees = (uid, employees) => {
  const empl = employees.find(e => e._id === uid)
  if (empl?.imageLink) return empl.imageLink
  else if (empl) {
    return generateInitialsAvatar(empl)
  } else return userPlaceholder
}

export const sortSkillGapItems = items => {
  /* Unavailable but needed skills */
  const unavailableItems = items.reduce((acc = [], curr) => {
    if (!curr.skillAvailable) return [...acc, curr]
    else return acc
  }, [])

  unavailableItems.sort((a, b) => {
    if (a.skillNeeded > b.skillNeeded) return -1
    else return 1
  })

  /* Available but not needed skills */
  const availableItems = items.reduce((acc = [], curr) => {
    if (curr.skillAvailable && !curr.skillNeeded) return [...acc, curr]
    else if (curr.skillAvailable > curr.skillNeeded) return [...acc, curr]
    else return acc
  }, [])

  availableItems.sort((a, b) => {
    if (a.skillNeeded && b.skillNeeded) {
      const aDiff = a.skillNeeded - a.skillAvailable
      const bDiff = b.skillNeeded - b.skillAvailable
      if (aDiff > bDiff) return -1
      else if (aDiff === bDiff) {
        if (a.skillAvailable > b.skillAvailable) return -1
        else if (a.skillAvailable === b.skillAvailable) {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        } else return 1
      } else return 1
    } else if (a.skillNeeded && !b.skillNeeded) {
      return -1
    } else if (!a.skillNeeded && b.skillNeeded) {
      return 1
    } else if (a.skillAvailable > b.skillAvailable) {
      return -1
    } else return 1
  })

  /* Available and Needed skills */
  const availableAndNeeded = items.reduce((acc = [], curr) => {
    if (
      curr.skillAvailable &&
      curr.skillNeeded &&
      (curr.skillAvailable < curr.skillNeeded ||
        curr.skillAvailable === curr.skillNeeded)
    )
      return [...acc, curr]
    else return acc
  }, [])

  // OLD SORT
  // MOST NEEDED SKILLS > diff
  // availableAndNeeded.sort((a, b) => {
  //   const aDiff = a.skillNeeded - a.skillAvailable
  //   const bDiff = b.skillNeeded - b.skillAvailable
  //   if (a.skillNeeded > b.skillNeeded) return -1
  //   else if (a.skillNeeded === b.skillNeeded) {
  //     if (aDiff > 0) {
  //       if (bDiff > 0) {
  //         if (aDiff > bDiff) return -1
  //         else return 1
  //       } else {
  //         return -1
  //       }
  //     } else {
  //       if (bDiff > 0) return 1
  //       else if (a.skillAvailable > b.skillAvailable) return -1
  //       else return 1
  //     }
  //   }
  // })

  availableAndNeeded.sort((a, b) => {
    const aDiff = a.skillNeeded - a.skillAvailable
    const bDiff = b.skillNeeded - b.skillAvailable
    if (aDiff > bDiff) return -1
    else if (aDiff === bDiff) {
      if (a.skillAvailable > b.skillAvailable) return -1
      else if (a.skillAvailable === b.skillAvailable) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      } else return 1
    } else return 1
  })

  return [...unavailableItems, ...availableAndNeeded, ...availableItems]
}
