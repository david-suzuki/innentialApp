import React, { useState } from 'react'
import listStyle from '../../styles/listStyle'

const ChangeView = ({
  view = 'Chart',
  viewMethodList = [],
  changeViewMethod,
  filter = 'All',
  filterList = [],
  changeFilter,
  filterLabel = 'Category'
}) => {
  const [filterDropdownActive, setFilterDropdown] = useState(false)
  const [viewDropdownActive, setViewDropdown] = useState(false)

  return (
    <div className='list-sort'>
      {viewMethodList.length > 0 && (
        <div className='list-sort__inner'>
          <div
            className='list-sort__label'
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}
          >
            <i className='icon icon-eye-17' style={{ fontSize: '16px' }} />
            View:{' '}
            <span onClick={() => setViewDropdown(!viewDropdownActive)}>
              {view}
            </span>
          </div>
          <div
            className={
              viewDropdownActive
                ? 'list__dropdown list__dropdown--sort is-active'
                : 'list__dropdown list__dropdown--sort'
            }
          >
            <ul>
              {viewMethodList.map((method, ix) => {
                const { label } = method
                return (
                  <li key={ix}>
                    <a
                      onClick={() => {
                        changeViewMethod(method)
                        setViewDropdown(false)
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
      {filterList.length > 0 && (
        <div className='list-sort__inner'>
          <div
            className='list-sort__label'
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}
          >
            <i className='icon icon-filter' style={{ fontSize: '16px' }} />
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
      <style jsx>{listStyle}</style>
    </div>
  )
}

export default ChangeView
