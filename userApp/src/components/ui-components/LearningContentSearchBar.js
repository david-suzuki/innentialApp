import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useLazyQuery } from 'react-apollo'
import { Input, Button } from 'element-react'
import _ from 'lodash'
import { DevelopmentPlanContent } from './'
import { searchLearningContent } from '../../api'
import { captureFilteredError } from '../general'
import Container from '../../globalState'

const LearningContentSearchBar = ({
  dontDisplayContent = false,
  setDisplayedContent,
  urlSearchQuery
}) => {
  const [searchString, setSearchString] = useState(urlSearchQuery || '')
  const [suggestions, setSuggestions] = useState([])
  const [limit, setLimit] = useState(8)
  const [count, setCount] = useState(0)
  // const [typing, setTyping] = useState(false)
  // const [allowQuery, setAllowQuery] = useState(false)
  const [noResultsFound, setNoResultsFound] = useState(false)
  const [searchQuery, { loading, data, fetchMore }] = useLazyQuery(
    searchLearningContent,
    {
      fetchPolicy: 'network-only'
      // onCompleted: () => setTyping(false)
    }
  )
  const {
    filters,
    setSearch,
    search,
    setFetchMoreSearched,
    fetchMoreSearched,
    setLoadingMore,
    noMoreSearchedContent,
    setNoMoreSearchedContent
  } = Container.useContainer()

  useEffect(() => {
    setNoResultsFound(false)
    setCount(0)
    setLimit(8)
  }, [search])

  useEffect(() => {
    const validSuggestions = data && data.searchLearningContent.content
    const foundItemsCount = data && data.searchLearningContent.count
    if (Array.isArray(validSuggestions)) {
      if (search.length > 1) {
        setDisplayedContent(validSuggestions)
        setSuggestions(validSuggestions)
        setCount(foundItemsCount)
      } else {
        setSuggestions([])
        setDisplayedContent([])
        setSearch('')
      }
    }

    if (foundItemsCount === 0) setNoResultsFound(true)
  }, [data])

  useEffect(() => {
    if (fetchMoreSearched) {
      handleFetchMore()
    }
  }, [fetchMoreSearched])

  // useEffect(() => {
  //   if (loading) {
  //     setLoadingMore(true)
  //   } else setLoadingMore(false)
  // }, [loading])

  useEffect(() => {
    // console.log({ allowQuery })
    if (search.length > 1 /* && allowQuery */) {
      // setAllowQuery(false)
      searchQuery({ variables: { searchString, filters, limit } })
      setNoMoreSearchedContent(false)
    } else {
      setSearch('')
      setDisplayedContent([])
    }
  }, [search, filters])

  const clear = () => {
    setSearchString('')
    setSearch('')
    setSuggestions([])
    setDisplayedContent([])
    setLimit(8)
    // setTyping(false)
    setFetchMoreSearched(false)
    setNoMoreSearchedContent(false)
  }

  const timeOutRef = useRef(null)

  useEffect(() => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current)
    timeOutRef.current = setTimeout(() => {
      // if (searchString.length > 1) {
      setSearch(searchString)
      // }
    }, 2000)

    return () => clearTimeout(timeOutRef.current)
  }, [searchString, setSearch, timeOutRef])

  // useEffect(() => {
  //   if (searchString.length > 1 && !loading/* && allowQuery*/) {
  //     setLimit(8)
  //     setSearch(searchString)
  //   }
  // }, [searchString/*, allowQuery*/])

  // const handleSearchInput = value => {
  //   // setTyping(true)

  //   console.log({ searchString, value })
  //   // setAllowQuery(false)
  //   startTimeOut()
  // }

  const handleFetchMore = async () => {
    setLoadingMore(true)
    try {
      await fetchMore({
        variables: { limit: limit + 4 },
        updateQuery: (prev, { fetchMoreResult, ...rest }) => {
          if (
            fetchMoreResult.searchLearningContent.content.length ===
            prev.searchLearningContent.content.length
          ) {
            setNoMoreSearchedContent(true)
            setFetchMoreSearched(false)
            return prev
          } else {
            setFetchMoreSearched(false)
            return fetchMoreResult
          }
        }
      })
      setLimit(limit + 4)
      setLoadingMore(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (searchString === '' && search !== '') clear()
    // if (search) setTyping(false)
  }, [searchString, search, clear])

  useEffect(() => {
    const eventCallback = e => {
      if (e.key === 'Enter' && searchString.length > 1) {
        setSearch(searchString)
      }
    }
    document.addEventListener('keypress', eventCallback)
    return () => document.removeEventListener('keypress', eventCallback)
  }, [searchString, setSearch, setLimit])

  // NOTE: DON'T! THIS MAKES IT IMPOSSIBLE TO CLEAR THE SEARCH BAR

  // useEffect(() => {
  //   if (urlSearchQuery) {
  //     setSearchString(urlSearchQuery)
  //   }
  // })

  const displayingResults = () =>
    suggestions.length !== 0 && searchString.length > 1 && !loading
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          marginBottom: '30px',
          position: 'relative'
        }}
      >
        <Input
          style={{ display: 'inline-block' }}
          value={searchString}
          placeholder='Search for learning content'
          onChange={value => setSearchString(value)}
        />
        <Button
          onClick={() => (searchString !== '' ? clear() : null)}
          loading={loading}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            padding: '12px',
            position: 'absolute',
            right: '0px'
          }}
        >
          {searchString !== '' ? (
            <i className='el-icon-close' style={{ fontSize: '16px' }} />
          ) : (
            <i className='el-icon-search' style={{ fontSize: '16px' }} />
          )}
        </Button>
      </div>
      <div>
        {/* {loading && <LoadingSpinner />} */}

        {suggestions && displayingResults() && (
          <p
            style={{
              textAlign: 'left',
              fontSize: '12px',
              marginBottom: '12px'
            }}
          >
            Found {count} results
          </p>
        )}
        {noResultsFound && !loading && (
          <p
            style={{
              textAlign: 'left',
              fontSize: '12px',
              marginBottom: '12px'
            }}
          >
            No results found
          </p>
        )}
        {/* {loading && <LoadingSpinner />} */}
        {!dontDisplayContent &&
          suggestions.map(sg => (
            <DevelopmentPlanContent
              key={sg._id}
              {...sg}
              onSelect={e => {
                e.preventDefault()
                // onContentClick(sg)
                const newSuggestions = suggestions.filter(
                  ({ _id }) => _id !== sg._id
                )
                setSuggestions(newSuggestions)
              }}
            />
          ))}
      </div>
    </>
  )
}

export default LearningContentSearchBar

// const LearningContentSearchBar = ({
//   client,
//   onContentClick,
//   dontDisplayContent = false,
//   setDisplayedContent = () => {},
//   setInitiallySearched = () => {}
// }) => {
//   const { filters, setSearch } = Container.useContainer()

//   const [searchString, setSearchString] = useState('')
//   const [lastString, setLastString] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [suggestions, setSuggestions] = useState([])
//   const [noResults, setNoResults] = useState(false)
//   const [timeIsSpent, setTimeIsSpent] = useState(false)

//   const timeOutRef = useRef(null)
//   const startTimeOut = () => {
//     if (timeOutRef.current) clearTimeout(timeOutRef.current)
//     timeOutRef.current = setTimeout(() => setTimeIsSpent(true), 1500)
//   }

//   const contentQuery = () => {
//     if (timeOutRef.current) clearTimeout(timeOutRef.current)
//     timeOutRef.current = null
//     setLoading(true)
//     setNoResults(false)
//     setSearch(searchString)
//     client
//       .query({
//         query: searchLearningContent,
//         variables: {
//           searchString,
//           filters
//         },
//         fetchPolicy: 'network-only'
//       })
//       .then(res => {
//         setInitiallySearched()
//         setLoading(false)
//         setTimeIsSpent(false)
//         setLastString(searchString)
//         const validSuggestions = res.data && res.data.searchLearningContent
//         if (Array.isArray(validSuggestions)) {
//           if (validSuggestions.length === 0) setNoResults(true)
//           if (dontDisplayContent && setDisplayedContent) {
//             setDisplayedContent(validSuggestions)
//             setSuggestions(validSuggestions)
//           } else {
//             setSuggestions(validSuggestions)
//           }
//         }
//       })
//       .catch(e => {
//         captureFilteredError(e)
//         setLoading(false)
//         setTimeIsSpent(false)
//       })
//   }

//   const clear = () => {
//     setLastString('')
//     setSearchString('')
//     setSearch('')
//     setSuggestions([])
//     setDisplayedContent([])
//     setNoResults(false)
//     setTimeIsSpent(false)
//   }

//   useEffect(() => {
//     const eventCallback = e => {
//       if (e.key === 'Enter' && searchString !== '') contentQuery()
//     }
//     document.addEventListener('keypress', eventCallback)
//     return () => document.removeEventListener('keypress', eventCallback)
//   }, [contentQuery])

//   useEffect(() => {
//     if (searchString === '') clear()
//   }, [searchString])

//   useEffect(() => {
//     if (timeIsSpent && searchString !== '') contentQuery()
//   }, [timeIsSpent, contentQuery, searchString])

//   useEffect(() => {
//     if (searchString !== '') contentQuery()
//   }, [filters])
//   return (
//     <>
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'flex-end',
//           marginBottom: '30px'
//         }}
//       >
//         <Input
//           style={{ display: 'inline-block' }}
//           value={searchString}
//           onChange={val => {
//             setTimeIsSpent(false)
//             setSearchString(val)
//             startTimeOut()
//           }}
//           placeholder='Search for learning content'
//         />
//         <Button
//           onClick={() => {
//             if (searchString !== '') {
//               if (searchString === lastString) {
//                 clear()
//               } else {
//                 contentQuery()
//               }
//             }
//           }}
//           loading={loading}
//           style={{
//             border: 'none',
//             backgroundColor: 'transparent',
//             padding: '12px'
//           }}
//         >
//           {searchString === lastString && searchString !== '' ? (
//             <i className='el-icon-close' />
//           ) : (
//             <i className='el-icon-search' />
//           )}
//         </Button>
//       </div>
//       <div>
//         {suggestions && suggestions.length > 0 && (
//           <p style={{ textAlign: 'left', fontSize: '12px' }}>
//             Found {suggestions.length} results
//           </p>
//         )}
//         {noResults && (
//           <p style={{ textAlign: 'left', fontSize: '12px' }}>
//             No results found
//           </p>
//         )}
//         {/* {loading && <LoadingSpinner />} */}
//         {/* {!dontDisplayContent &&
//           suggestions.map(sg => (
//             <DevelopmentPlanContent
//               key={sg._id}
//               {...sg}
//               onSelect={e => {
//                 e.preventDefault()
//                 onContentClick(sg)
//                 const newSuggestions = suggestions.filter(
//                   ({ _id }) => _id !== sg._id
//                 )
//                 setSuggestions(newSuggestions)
//               }}
//             />
//           ))} */}
//       </div>
//     </>
//   )
// }

// export default props => {
//   return (
//     <ApolloConsumer>
//       {client => <LearningContentSearchBar client={client} {...props} />}
//     </ApolloConsumer>
//   )
// }
