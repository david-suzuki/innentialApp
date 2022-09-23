import React from 'react'
import { UserItem, UserItemWithSkill } from './'
import userPlaceholder from '$/static/nobody.jpg'

const UserItems = props =>
  props.items.map((user, index) => {
    if (props.withSkills) {
      return (
        <UserItemWithSkill
          key={user.id}
          uuid={user.id}
          label={user.label}
          name={user.name}
          profession={user.profession}
          img={user.img}
          status={user.status}
          isActive={user.isActive}
          isDisabled={user.isDisabled}
          children={
            user.children ||
            (user.userDropdownOptions.length > 0 ? (
              <i className='icon icon-menu-dots' />
            ) : null)
          }
          dropdownOptions={user.userDropdownOptions}
          location={user.location}
          roles={user.roles}
          neededSkills={user.neededSkills}
          skills={user.skills}
        />
      )
    }
    return (
      <UserItem
        key={user.id}
        uuid={user.id}
        label={user.label}
        name={user.name}
        profession={user.profession}
        img={user.img}
        status={user.status}
        isActive={user.isActive}
        isDisabled={user.isDisabled}
        children={
          user.children ||
          (user.userDropdownOptions.length > 0 ? (
            <i className='icon icon-menu-dots' />
          ) : null)
        }
        dropdownOptions={user.userDropdownOptions}
        location={user.location}
        roles={user.roles}
      />
    )
  })

UserItems.defaultProps = {
  items: [
    {
      id: 1,
      label: 'Marketing',
      name: 'John Doe',
      profession: 'Marketing Manager',
      img: userPlaceholder,
      status: 'active',
      isActive: true,
      children: 'test'
    },
    {
      id: 2,
      label: 'Marketing',
      name: 'Kris Gunciarz',
      profession: 'Marketing Manager',
      img: userPlaceholder,
      status: 'active',
      isActive: true
    },
    {
      id: 3,
      label: 'Marketing',
      name: 'Adam Ambrozy',
      profession: 'Master of Reports',
      img: userPlaceholder,
      status: 'invited',
      isActive: false,
      children: <i className='icon icon-menu-dots' />
    },
    {
      id: 4,
      label: 'Marketing',
      name: 'Kris Gunciarz',
      profession: 'Marketing Manager',
      img: userPlaceholder,
      status: 'active',
      isActive: true
    },
    {
      id: 5,
      label: 'Marketing',
      name: 'Adam Ambrozy',
      profession: 'Master of Reports',
      img: userPlaceholder,
      status: 'invited',
      isActive: false,
      children: <i className='icon icon-e-remove' />
    }
  ]
}
export default UserItems
