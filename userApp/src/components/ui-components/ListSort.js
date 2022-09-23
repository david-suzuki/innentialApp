import React, { useState } from 'react'
import listStyle from '../../styles/listStyle'

const ListSort = ({
  sortMethod = 'Name',
  sortMethodList = [],
  changeSortMethod,
  filter = 'All',
  filterList = [],
  changeFilter,
  filterLabel = 'Team'
}) => {
  const [filterDropdownActive, setFilterDropdown] = useState(false)
  const [sortDropdownActive, setSortDropdown] = useState(false)

  return (
    <div className='list-sort'>
      {filterList.length > 0 && (
        <div className='list-sort__inner'>
          <div className='list-sort__label'>
            <i className='icon icon-filter' />
            {filterLabel}:{' '}
            <span onClick={() => setFilterDropdown(!filterDropdownActive)}>
              {filter}
            </span>
          </div>
          <div
            className={
              filterDropdownActive
                ? 'list__dropdown list__dropdown--sort is-active'
                : 'list__dropdown list__dropdown--sort'
            }
          >
            <ul>
              {filterList.map((method, ix) => {
                const { label } = method
                return (
                  <li key={ix}>
                    <a
                      onClick={() => {
                        changeFilter(method)
                        setFilterDropdown(false)
                      }}
                    >
                      {label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
      {sortMethodList.length > 0 && (
        <div className='list-sort__inner'>
          <div className='list-sort__label'>
            Sort by:{' '}
            <span onClick={() => setSortDropdown(!sortDropdownActive)}>
              {sortMethod}
            </span>
          </div>
          <div
            className={
              sortDropdownActive
                ? 'list__dropdown list__dropdown--sort is-active'
                : 'list__dropdown list__dropdown--sort'
            }
          >
            <ul>
              {sortMethodList.map((method, ix) => {
                const { label } = method
                return (
                  <li key={ix}>
                    <a
                      onClick={() => {
                        changeSortMethod(method)
                        setSortDropdown(false)
                      }}
                    >
                      {label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
      <style jsx>{listStyle}</style>
    </div>
  )
}

export default ListSort
