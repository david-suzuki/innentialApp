import React, { useState, useEffect, useContext } from 'react'
import { Checkbox, Button, Input, Dialog, Switch } from 'element-react'
import { useQuery, useMutation } from 'react-apollo'
import { fetchFiltersForArgs, updateNeededSkills } from '../../../../api'
import certificateRibbon from '../../../../static/certificate-ribbon.svg'
import { captureFilteredError, LoadingSpinner } from '../../../general'
import Container from '../../../../globalState'
import filtersStyle from './style'
import filtersSmallStyle from './smallStyle'
import {
  BodyPortal,
  SkillsFrameworkStarIcon,
  ListSkillSelector,
  CertificateBadge
} from '../../../ui-components'
import { initialFilterState } from './constants'
import Slider from 'react-slider'
import slug from 'slug'
import { UserContext } from '../../../../utils'

const CertifiedMark = ({ fill, ribbon = true, active }) => (
  <div
    className={`filters__filter__certified ${active &&
      'filters__filter__certified--active'}`}
  >
    <CertificateBadge fill={fill} width='26' height='25' />
    {ribbon && (
      <img
        className='filters__filter__certified__ribbon'
        src={certificateRibbon}
        width='18'
        height='18'
      />
    )}
  </div>
)

const SkillsListStars = ({ level, active }) => (
  <div
    className={`filters__filter__list-stars ${active &&
      'filters__filter__list-stars--active'}`}
  >
    {[...Array(level).keys()].map(item => (
      <SkillsFrameworkStarIcon key={item} />
    ))}
    {[...Array(5 - level).keys()].map(item => (
      <SkillsFrameworkStarIcon key={item} fill='#f0f0f0' />
    ))}
  </div>
)

const FilterBox = ({
  name,
  count,
  selected = false,
  handleChecking,
  autocheck,
  children,
  disabled
}) => {
  return (
    <div className='filters__filter'>
      <div>
        <Checkbox
          className={count === 0 ? 'el-checkbox--grey' : undefined}
          checked={selected || autocheck}
          disabled={autocheck || disabled}
          onChange={() =>
            handleChecking(selected ? 'REMOVE_FILTER' : 'ADD_FILTER')
          }
        >
          {name}
          {children}
        </Checkbox>
      </div>
      <div className='filters__filter__count'>{count}</div>
    </div>
  )
}

export const FiltersSmall = ({ filters, filtersDispatch, neededSkills }) => {
  const {
    priceRange: { minPrice: min, maxPrice: max },
    price
    // preferredCertified
  } = filters

  const { noPaid } = useContext(UserContext)

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
        <LoadingSpinner />
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
      <div className='filters__wrapper'>
        <div className='filters__filters'>
          {!noPaid && (
            <div className='filters__price'>
              <div className='filters__small'>
                <h4 className='filters__filter-heading'>Price</h4>
                <div>
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
                <div style={{ width: '58%' }}>
                  <h4 className='filters__filter-heading'>Price Range</h4>
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

          <div className='filters__small'>
            <h4 className='filters__filter-heading'>Certification</h4>
            <div

            // style={{
            //   display: 'flex',
            //   alignItems: 'center',
            //   justifyContent: 'space-between'
            // }}
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
          </div>
        </div>
        <style>{filtersSmallStyle}</style>
      </div>
    )
  }
  return null
}

export const Filters = () => {
  const {
    filters,
    filtersDispatch,
    neededSkills,
    // extraSkills,
    // setExtraSkills,
    inDPSetting,
    search,
    displayFilters,
    user
  } = Container.useContainer()

  const { noPaid } = useContext(UserContext)

  const {
    priceRange: { minPrice: min, maxPrice: max },
    price,
    durationRanges,
    durationEnabled
  } = filters

  const [sourceLimit, setSourceLimit] = useState(8)
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
      key === 'preferredSkills' || key === 'preferredSubscription'
        ? filter._id === value
        : filter === value
    )

  const { data, loading, error } = useQuery(fetchFiltersForArgs, {
    variables: {
      neededSkills,
      extraSkills: [],
      filters,
      inDPSetting,
      search,
      user
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

  const [mutate] = useMutation(updateNeededSkills)

  const showClearButton =
    // extraSkills.length > 0 ||
    JSON.stringify(filters) !== JSON.stringify(initialFilterState)

  if (!displayFilters) return null

  if (loading)
    return (
      <div
        className={`filters__wrapper ${inDPSetting &&
          'filters__wrapper--development-plan'}`}
      >
        <div className='filters__heading'>
          <h3>Filters</h3>
          {showClearButton && (
            <Button
              size='small'
              className='filters__heading__button-clear'
              disabled
            >
              <span>Clear all</span>
              <i className='el-icon-close' />
            </Button>
          )}
        </div>
        <div className='filters__loader-wrapper'>
          <LoadingSpinner />
        </div>
        <style>{filtersStyle}</style>
      </div>
    )

  if (error) {
    captureFilteredError(error)
    return null
  }

  if (data) {
    const { fetchFiltersForArgs: filterInfo } = data

    const {
      skillPrefs,
      // extraSkillPrefs,
      pricePref,
      languagePref,
      // priceRangePref: { lowestPrice, highestPrice },
      sourcePrefs,
      typePrefs,
      // durationPref,
      levelPref,
      certPref,
      subscriptionPref
    } = filterInfo

    const selectorProps = {
      skills: neededSkills,
      preferences: true,
      buttonValue: 'Change your skill preferences',
      // extraSkills.length === 0 ? 'Pick additional skills' : 'Change skills',
      buttonClass: 'el-button--secondary-link',
      onSkillsSubmit: async skills => {
        try {
          mutate({
            variables: {
              neededWorkSkills: skills.map(({ _id, name }) => ({
                _id,
                slug: slug(name, {
                  replacement: '_',
                  lower: true
                })
              }))
            }
          })
        } catch (err) {
          captureFilteredError(err)
        }
      },
      neededSkillsSelector: true,
      // skills =>
      //   setExtraSkills(skills.map(({ _id, name }) => ({ _id, name }))),
      clearState: true
      // filterSkills: neededSkills
    }

    return (
      <div
        className={`filters__wrapper ${inDPSetting &&
          'filters__wrapper--development-plan'}`}
      >
        <div className='filters__heading'>
          <h3>Filters</h3>
          {showClearButton && (
            <Button
              size='small'
              onClick={() => {
                filtersDispatch({ type: 'CLEAR_FILTERS' })
                // setExtraSkills([])
              }}
              className='filters__heading__button-clear'
            >
              <span>Clear all</span>
              <i className='el-icon-close' />
            </Button>
          )}
        </div>
        <div className='filters__filters'>
          <div>
            <h4 className='filters__filter-heading'>
              Skills you're interested in
            </h4>
            {skillPrefs.map((pref, i, array) => (
              <FilterBox
                key={pref._id}
                {...pref}
                selected={filterIsSelected('preferredSkills', pref._id)}
                handleChecking={type =>
                  filtersDispatch({
                    type,
                    key: 'preferredSkills',
                    value: { _id: pref._id, name: pref.name }
                  })
                }
                autocheck={
                  !search && array.length /* + extraSkills.length */ === 1
                }
              />
            ))}
            {skillPrefs.length === 0 && (
              <span className='grey-small'>No skills selected</span>
            )}
            {/* {extraSkillPrefs.length > 0 && (
              <div className='filters__heading filters__heading--small'>
                <h4 className='filters__filter-heading'>Other skills</h4>
                <Button
                  size='small'
                  className='filters__heading__button-clear filters__heading__button-clear--small'
                  onClick={() => {
                    setExtraSkills([])
                    filtersDispatch({
                      type: 'CLEAR_FILTER',
                      key: 'preferredSkills'
                    })
                  }}
                >
                  <span>Clear</span>
                  <i className='el-icon-close' />
                </Button>
              </div>
            )}
            {extraSkillPrefs.map(pref => (
              <FilterBox
                key={pref._id}
                {...pref}
                selected={filterIsSelected('preferredSkills', pref._id)}
                handleChecking={type =>
                  filtersDispatch({
                    type,
                    key: 'preferredSkills',
                    value: { _id: pref._id, name: pref.name }
                  })
                }
              />
            ))} */}
            {!inDPSetting && <ListSkillSelector {...selectorProps} />}
          </div>
          {!noPaid && (
            <div>
              <h4 className='filters__filter-heading'>Price</h4>
              {pricePref.map((pref, i, array) => (
                <FilterBox
                  key={pref._id}
                  {...pref}
                  selected={filterIsSelected('price', pref._id)}
                  handleChecking={type =>
                    filtersDispatch({ type, key: 'price', value: pref._id })
                  }
                  autocheck={array.length === 1}
                />
              ))}
            </div>
          )}
          {price.indexOf('PAID') !== -1 && (
            <div>
              <h4 className='filters__filter-heading'>Price range</h4>
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
                <span>-</span>
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
          {subscriptionPref?.length > 0 && (
            <div>
              <h4 className='filters__filter-heading'>
                Available subscriptions
              </h4>
              {subscriptionPref.map((pref, i, array) => (
                <FilterBox
                  key={pref._id}
                  {...pref}
                  selected={filterIsSelected('preferredSubscription', pref._id)}
                  handleChecking={type =>
                    filtersDispatch({
                      type,
                      key: 'preferredSubscription',
                      value: { _id: pref._id, name: pref.name }
                    })
                  }
                  autocheck={false}
                />
              ))}
            </div>
          )}
          <div>
            <div className='flex-div filters__filter-heading'>
              <h4>Hours of learning time per week</h4>
              <Switch
                value={durationEnabled}
                onChange={value => {
                  filtersDispatch({
                    type: 'SET_FILTER',
                    key: 'durationEnabled',
                    value
                  })
                  if (value) {
                    filtersDispatch({
                      type: 'SET_FILTER',
                      key: 'durationRanges',
                      value:
                        durationRanges.length === 0
                          ? [{ maxHours: 1, minHours: 0 }]
                          : durationRanges
                    })
                  }
                }}
                onText=''
                offText=''
                onColor='#5a55ab'
                width={36}
              />
            </div>
            <Slider
              className='slider--duration'
              value={
                durationRanges[0]?.maxHours ? durationRanges[0]?.maxHours : 0
              }
              min={1}
              max={10}
              step={1}
              onAfterChange={value => {
                filtersDispatch({
                  type: 'SET_FILTER',
                  key: 'durationEnabled',
                  value: true
                })
                filtersDispatch({
                  type: 'SET_FILTER',
                  key: 'durationRanges',
                  value: [{ minHours: 0, maxHours: value }]
                })
              }}
              // renderTrack={(props, state) => <div {...props} index={state.index} />}
              renderThumb={props => <div {...props} />}
              snapDragDisabled
              disabled={!durationEnabled}
            />
            <div className='filters__duration__labels'>
              <div className='filters__duration__label filters__duration__label--left'>
                1 or less
              </div>
              <div className='filters__duration__label filters__duration__label--right'>
                10 or more
              </div>
            </div>
            {/* {durationPref.map((pref, i, array) => (
              <FilterBox
                key={pref._id}
                {...pref}
                selected={filterIsSelected('preferredDuration', pref._id)}
                handleChecking={type =>
                  filtersDispatch({
                    type,
                    key: 'preferredDuration',
                    value: pref._id
                  })
                }
                autocheck={array.length === 1}
              />
            ))} */}
          </div>
          {languagePref.length > 1 && (
            <div>
              <h4 className='filters__filter-heading'>Language</h4>
              {languagePref.map((pref, i, array) => (
                <FilterBox
                  key={pref._id}
                  {...pref}
                  selected={filterIsSelected('preferredLanguage', pref._id)}
                  handleChecking={type =>
                    filtersDispatch({
                      type,
                      key: 'preferredLanguage',
                      value: pref._id
                    })
                  }
                  autocheck={array.length === 1}
                />
              ))}
            </div>
          )}
          <div>
            <h4 className='filters__filter-heading'>Certification</h4>
            {certPref.map((pref, i, array) => (
              <FilterBox
                key={pref._id}
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
              >
                <CertifiedMark
                  fill={pref._id === 'Certified' ? '#5A55AB' : 'none'}
                  ribbon={pref._id === 'Certified'}
                  active={pref.count > 0}
                />
              </FilterBox>
            ))}
          </div>
          <div>
            <h4 className='filters__filter-heading'>Type of content</h4>
            {typePrefs.map((pref, i, array) => (
              <FilterBox
                key={pref._id}
                {...pref}
                selected={filterIsSelected('preferredTypes', pref._id)}
                handleChecking={type =>
                  filtersDispatch({
                    type,
                    key: 'preferredTypes',
                    value: pref._id
                  })
                }
                autocheck={array.length === 1}
              />
            ))}
          </div>
          <div>
            <h4 className='filters__filter-heading'>Source of content</h4>
            {sourcePrefs.slice(0, sourceLimit).map((pref, i, array) => (
              <FilterBox
                key={pref._id}
                {...pref}
                selected={filterIsSelected('preferredSources', pref._id)}
                handleChecking={type =>
                  filtersDispatch({
                    type,
                    key: 'preferredSources',
                    value: pref._id
                  })
                }
                autocheck={array.length === 1}
              />
            ))}
            {sourcePrefs.length > 8 && (
              <p
                className='el-button--secondary-link'
                onClick={() => setSourceLimit(sourceLimit ? undefined : 8)}
              >
                {sourceLimit ? 'See all' : 'See less'}
              </p>
            )}
          </div>
          <div>
            <h4 className='filters__filter-heading'>Difficulty level</h4>
            {levelPref.map((pref, i, array) => (
              <FilterBox
                key={pref._id}
                {...pref}
                selected={filterIsSelected('preferredDifficulty', pref._id)}
                handleChecking={type =>
                  filtersDispatch({
                    type,
                    key: 'preferredDifficulty',
                    value: pref._id
                  })
                }
                autocheck={array.length === 1}
              >
                <SkillsListStars level={i + 1} active={pref.count > 0} />
              </FilterBox>
            ))}
          </div>
        </div>
        <style>{filtersStyle}</style>
      </div>
    )
  }
  return null
}

export const FiltersMobile = () => {
  const { displayFilters } = Container.useContainer()
  const [dialogVisible, setDialogVisible] = useState(false)

  if (!displayFilters) return null

  return (
    <>
      <BodyPortal>
        <Dialog
          visible={dialogVisible}
          onCancel={() => setDialogVisible(false)}
          className='filters-dialog'
        >
          <Dialog.Body>
            <Filters />
          </Dialog.Body>
        </Dialog>
      </BodyPortal>
      <Button
        className='el-button--green el-button--filters el-button--fixed'
        onClick={() => setDialogVisible(true)}
      >
        Filters <i className='icon icon-filter' />
      </Button>
    </>
  )
}

export default Filters
