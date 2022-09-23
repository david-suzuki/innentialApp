import React, { useState, useEffect } from 'react'
import { Input, Checkbox, Layout } from 'element-react'
import { useQuery } from 'react-apollo'
import { fetchFiltersForArgs } from '../../../../api'
import loadingCurl from '../../../../static/loading-curl.svg'
import { captureFilteredError } from '../../../general'

const FilterBox = ({
  name,
  count,
  selected = false,
  handleChecking,
  autocheck,
  // children,
  disabled
}) => {
  return (
    <div className='filters__filter'>
      {/* <div> */}
      <div>
        <Checkbox
          className={count === 0 ? 'el-checkbox--grey' : undefined}
          checked={selected}
          disabled={autocheck || disabled}
          onChange={() =>
            handleChecking(selected ? 'REMOVE_FILTER' : 'ADD_FILTER')
          }
        >
          {name}
          <span className='filters__filter__count'>{count}</span>
        </Checkbox>
      </div>

      {/* </div> */}
      {/* <div className="filters__filter__count">{count}</div> */}
    </div>
  )
}

const FiltersOnboarding = ({
  filters,
  filtersDispatch,
  neededSkills,
  user
}) => {
  const {
    priceRange: { minPrice: min, maxPrice: max },
    price
    // preferredCertified
  } = filters

  const { noPaid } = user

  const [changeFlag, setChangeFlag] = useState(false)
  const [minInputValue, setMinInputValue] = useState(`${min} €`)
  const [maxInputValue, setMaxInputValue] = useState('')
  const [focusedInput, setFocusedInput] = useState(null)

  useEffect(() => {
    setMinInputValue(`${min} €`)
    setMaxInputValue(max === null ? '' : `${max} €`)
  }, [min, max])

  const minInputCallback = () => {
    if (changeFlag) {
      const numericValue = parseFloat(minInputValue)
      if (!Number.isNaN(numericValue)) {
        const newMinPrice = numericValue
        const newMaxPrice = numericValue < max ? max : numericValue + 10
        setMinInputValue(`${newMinPrice} €`)
        filtersDispatch({
          type: 'CHANGE_LIMITS',
          value: {
            minPrice: newMinPrice,
            maxPrice: newMaxPrice
          }
        })
      } else {
        setMinInputValue(`${min} €`)
      }
      setChangeFlag(false)
    } else setMinInputValue(`${min} €`)
    setFocusedInput(null)
  }

  const maxInputCallback = () => {
    if (changeFlag) {
      const numericValue = parseFloat(maxInputValue)
      if (!Number.isNaN(numericValue)) {
        const newMaxPrice = numericValue
        const newMinPrice = numericValue > min ? min : numericValue - 10
        setMaxInputValue(`${newMaxPrice} €`)
        filtersDispatch({
          type: 'CHANGE_LIMITS',
          value: {
            minPrice: newMinPrice,
            maxPrice: newMaxPrice
          }
        })
      } else {
        setMaxInputValue(max === null ? '' : `${max} €`)
      }
      setChangeFlag(false)
    } else setMaxInputValue(max === null ? '' : `${max} €`)
    setFocusedInput(null)
  }

  useEffect(() => {
    const callback = e => {
      if (focusedInput && e.key === 'Enter') {
        focusedInput === 'max' ? maxInputCallback() : minInputCallback()
      }
    }

    document.addEventListener('keydown', callback)

    return () => document.removeEventListener('keydown', callback)
  }, [focusedInput, changeFlag, minInputValue, maxInputValue])

  const filterIsSelected = (key, value) =>
    filters[key].some(filter =>
      key === 'preferredSkills' ? filter._id === value : filter === value
    )

  // const pricePref = [
  //   { _id: 'FREE', name: 'Free' },
  //   { _id: 'PAID', name: 'Paid' }
  // ]
  // const certPref = [
  //   { _id: 'Certified', name: 'Certified' },
  //   { _id: 'Not certified', name: 'Not certified' }
  // ]

  const { data, loading, error } = useQuery(fetchFiltersForArgs, {
    variables: {
      neededSkills,
      filters
    },
    fetchPolicy: 'cache-and-network'
  })

  useEffect(() => {
    if (data?.fetchFiltersForArgs && noPaid) {
      const { pricePref } = data.fetchFiltersForArgs

      const freeFilter = pricePref.find(({ _id }) => _id === 'FREE')

      if (freeFilter && !filterIsSelected('price', freeFilter._id)) {
        filtersDispatch({
          type: 'ADD_FILTER',
          key: 'price',
          value: freeFilter._id
        })
      }
    }
  }, [noPaid, data])

  if (loading)
    return (
      <div className='filters__content-container'>
        <div
          className='loading-curl'
          style={{
            backgroundImage: `url(${loadingCurl})`,
            margin: '0 auto'
          }}
        />
      </div>
    )

  if (error) {
    captureFilteredError(error)
    return null
  }

  if (data) {
    const { fetchFiltersForArgs: filterInfo } = data

    const { pricePref, certPref } = filterInfo

    return (
      <div className='filters__content-container'>
        {!noPaid && (
          <div className='filters__content-option-price'>
            <div>
              <h6>Price</h6>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {pricePref.map((pref, i, array) => (
                  <FilterBox
                    key={pref._id}
                    // name={pref.name}
                    {...pref}
                    selected={filterIsSelected('price', pref._id)}
                    handleChecking={type =>
                      filtersDispatch({ type, key: 'price', value: pref._id })
                    }
                    autocheck={array.length === 1}
                  />
                ))}
              </div>
            </div>

            {price.indexOf('PAID') !== -1 && (
              <div className='filters__content-option'>
                <h6>Price Range</h6>
                <div className='filters__price-range-inputs'>
                  <Input
                    placeholder='- €'
                    value={minInputValue}
                    onChange={value => {
                      setMinInputValue(value)
                      setChangeFlag(true)
                    }}
                    onBlur={minInputCallback}
                    onFocus={() => {
                      setFocusedInput('min')
                      setMinInputValue(`${min}`)
                    }}
                  />
                  <span style={{ margin: '5px', alignSelf: 'flex-end' }}>
                    -
                  </span>
                  <Input
                    placeholder='- €'
                    value={maxInputValue}
                    onChange={value => {
                      setMaxInputValue(value)
                      setChangeFlag(true)
                    }}
                    onBlur={maxInputCallback}
                    onFocus={() => {
                      setMaxInputValue(max === null ? '' : `${max}`)
                      setFocusedInput('max')
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className='filters__content-option'>
          <h6>Certification</h6>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {certPref.map((pref, i, array) => (
              <FilterBox
                key={pref._id}
                // name={pref.name}
                {...pref}
                selected={filterIsSelected('preferredCertified', pref._id)}
                handleChecking={type =>
                  filtersDispatch({
                    type,
                    key: 'preferredCertified',
                    value: pref._id
                  })
                }
                autocheck={array.length === 1}
              />
            ))}
          </div>

          {/* <CertifiedMark
                    fill={pref._id === 'Certified' ? '#5A55AB' : 'none'}
                    ribbon={pref._id === 'Certified'}
                    active={pref.count > 0}
                  /> 
                </FilterBox>
              */}
        </div>
      </div>
    )
  }
  return null
}

export default FiltersOnboarding
