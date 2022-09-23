import React from 'react'
import listStyle from '../../styles/listStyle'

const List = ({
  profileList,
  children,
  listTitle,
  purpleBackground = false,
  noBackground = false,
  noBoxShadow = false,
  noPadding = false,
  overflow = false
}) => {
  let backgroundClass = ''
  if (purpleBackground) {
    backgroundClass = 'list--purple'
  }

  if (noBackground) {
    backgroundClass = 'list--nobg'
  }

  let shadowClass = ''
  if (noBoxShadow) {
    shadowClass = 'list--no-shadow'
  }
  let paddingClass = ''
  if (noPadding) {
    paddingClass = 'list--no-padding'
  }
  let overflowClass = ''
  if (overflow) {
    overflowClass = 'list--overflow'
  }
  return (
    <div
      className={`${
        profileList ? 'list-profile' : 'list'
      } ${backgroundClass} ${shadowClass} ${paddingClass} ${overflowClass}`}
    >
      {listTitle && <h4 className='list__title'>{listTitle}</h4>}
      {children}
      <style jsx>{listStyle}</style>
    </div>
  )
}

export default List
