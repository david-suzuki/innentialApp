const getInitials = user => {
  if (!user) return ''

  const firstNameFirstLetter = user?.firstName?.substr(0, 1).toUpperCase() || ''
  const lastNameFirstLetter = user?.lastName?.substr(0, 1).toUpperCase() || ''

  return `${firstNameFirstLetter}${lastNameFirstLetter}`
}

export default getInitials
