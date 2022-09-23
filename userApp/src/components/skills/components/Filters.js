import React, { useEffect, useState, useRef } from 'react'
import { Input, Select, Checkbox } from 'element-react'
import skillsFilterStyle from '../../../styles/skillsFilterStyle'

export default ({
  searchString,
  setSearchString,
  selectedTeam,
  setSelectedTeam,
  displayRequired,
  setDisplayRequired,
  allTeams,
  isOnOrganizationTab,
  isInDialog,
  setDisplayIndex
}) => {
  const [search, setSearch] = useState('')

  const selectOptions = allTeams.map(t => (
    <Select.Option key={t._id} value={t._id} label={t.teamName} />
  ))

  useEffect(() => {
    const eventCallback = e => {
      if (e.key === 'Enter') {
        setSearchString(search)
      }
    }
    document.addEventListener('keypress', eventCallback)
    return () => document.removeEventListener('keypress', eventCallback)
  }, [search, setSearchString])

  const timeOutRef = useRef(null)

  useEffect(() => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current)

    timeOutRef.current = setTimeout(() => {
      setSearchString(search)
    }, 2000)

    return () => clearTimeout(timeOutRef.current)
  }, [search, setSearchString, timeOutRef])

  return (
    <div>
      <div className='skills-filter-title'>Filters</div>
      <Input
        value={search}
        placeholder='Search Skills...'
        onChange={val => setSearch(val)}
        icon={searchString.length > 0 ? 'close' : 'search'}
        onIconClick={() => {
          if (searchString.length > 0) {
            setSearchString('')
            setSearch('')
          } else setSearchString(search)
        }}
      />
      {!isOnOrganizationTab && (
        <>
          <div className={isInDialog ? 'select-autosuggest-in-modal' : ''}>
            <Select
              value={selectedTeam}
              clearable
              placeholder='Show all teams'
              onChange={val => setSelectedTeam(val)}
              onClear={() => setSelectedTeam(null)}
            >
              {selectOptions}
            </Select>
          </div>
          <div className='skills-filter-checkbox-wrapper'>
            <Checkbox
              checked={displayRequired}
              onChange={val => {
                setDisplayRequired(val)
                setDisplayIndex()
              }}
            >
              Show only required skills
            </Checkbox>
          </div>
        </>
      )}
      <div className='skills-description skills-filter-description'>
        <div className='skills-description__wrapper'>
          <div className='skills-description__dot' />
          <div className='skills-description__title'>Skills Available</div>
          {!isOnOrganizationTab && (
            <>
              <div className='skills-description__dot skills-description__dot--needed' />
              <div className='skills-description__title'>Skills Required</div>
            </>
          )}
        </div>
      </div>
      <style jsx>{skillsFilterStyle}</style>
    </div>
  )
}
