import React, { useState, useEffect } from 'react'
import { findUsers } from '../../api'
import { useLazyQuery } from 'react-apollo'
import { Input, Message } from 'element-react'

const UserSearch = ({ displayResults }) => {
  const [search, setSearch] = useState('')

  const [searchQuery, { data, loading, error }] = useLazyQuery(findUsers, {
    fetchPolicy: 'network-only'
  })

  // enter listener
  useEffect(() => {
    const eventCallback = e => {
      if (e.key === 'Enter' && search.length > 1) {
        searchQuery({
          variables: {
            search
          }
        })
      }
    }
    document.addEventListener('keypress', eventCallback)
    return () => document.removeEventListener('keypress', eventCallback)
  }, [searchQuery, search])

  // data display
  useEffect(() => {
    if (data && !loading) {
      displayResults(data.findUsers)
    }
  }, [data, loading])

  // error
  useEffect(() => {
    if (error) {
      Message({
        message: error.message,
        type: 'error'
      })
      console.error(error)
    }
  }, [error])

  return (
    <Input
      value={search}
      placeholder={'Search for users here'}
      onIconClick={() => {
        if (search.length > 1) searchQuery({ variables: { search } })
      }}
      icon={loading ? 'loading' : 'search'}
      onChange={setSearch}
    />
  )
}

export default UserSearch
