import React, { useState, useEffect, useContext } from 'react'
import { Checkbox, Button, Input, Dialog, Dropdown } from 'element-react'
import { useQuery, useMutation } from 'react-apollo'
import { fetchFiltersForArgs, updateNeededSkills } from '../../../../api'
import certificateRibbon from '../../../../static/certificate-ribbon.svg'
import { ReactComponent as FilterIcon } from '../../../../static/filter-icon.svg'
import { ReactComponent as ResetIcon } from '../../../../static/reset-icon.svg'
import { ReactComponent as ContentIcon } from '../../../../static/content-type-icon.svg'
import { ReactComponent as SourceIcon } from '../../../../static/provider.svg'
import { ReactComponent as PriceIcon } from '../../../../static/price-icon.svg'
import { ReactComponent as CertificationIcon } from '../../../../static/certification-icon.svg'
import { ReactComponent as ClockIcon } from '../../../../static/clock-icon.svg'
import { ReactComponent as DifficultyIcon } from '../../../../static/user.svg'
import { ReactComponent as ArrowIcon } from '../../../../static/vector-arrow.svg'
import { ReactComponent as UploadIcon } from '../../../../static/upload.svg'
import { ReactComponent as SettingsIcon } from '../../../../static/settings.svg'
import { captureFilteredError, LoadingSpinner } from '../../../general'
import Container from '../../../../globalState'
import filtersNewStyle from './filtersNewStyle'
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
import { IoTTwinMaker } from 'aws-sdk'

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
      {/* <div className='filters__filter__count'>{count}</div>  */}
    </div>
  )
}

const FilterBoxButton = ({
  name,
  count,
  selected = false,
  handleChecking,
  autocheck,
  children,
  disabled
}) => {
  return (
    <label
      className='el-checkbox-button'
      onChange={() => handleChecking(selected ? 'REMOVE_FILTER' : 'ADD_FILTER')}
    >
      <input
        className='el-checkbox-button__original'
        type='checkbox'
        checked={selected || autocheck}
        disabled={autocheck || disabled}
      />
      <span className='el-checkbox-button__inner'>{name}</span>
    </label>
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

export const FiltersNew = ({ handleSettingRelatedSkills, activeTemplate }) => {
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
    durationRanges
  } = filters

  const [sourceLimit, setSourceLimit] = useState(8)
  const [changeFlag, setChangeFlag] = useState(false)
  const [minInputValue, setMinInputValue] = useState(`${min} €`)
  const [maxInputValue, setMaxInputValue] = useState('')
  const [focusedInput, setFocusedInput] = useState(null)
  const [dialogVisible, setDialogVisible] = useState(false)

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

  // if (!displayFilters) return null

  if (loading)
    return (
      <div className='filters__wrapper'>
        <div className='development-plan__filters-heading--loading'>
          <FilterIcon className='filter__icon' />
          <h3>Filters</h3>
          {showClearButton && (
            <Button
              size='small'
              className='development-plan__filters__heading__button-clear development-plan__filters__heading__button-clear--loading'
              disabled
            >
              <ResetIcon className='reset__icon' />
              <span>Reset</span>
            </Button>
          )}
        </div>
        <div className='filters__loader-wrapper'>
          <LoadingSpinner />
        </div>
        <style>{filtersNewStyle}</style>
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
      durationPref,
      levelPref,
      certPref
    } = filterInfo

    const myUploads = sourcePrefs.filter(item => item.name === 'My Uploads')
    const companyUploads = sourcePrefs.filter(
      item => item.name === 'Company Uploads'
    )
    const sourcePrefsFiltered = sourcePrefs.filter(
      item => item.name !== 'Company Uploads' && item.name !== 'My Uploads'
    )

    const selectorProps = {
      skills: neededSkills,
      preferences: true,
      buttonValue: 'Change',
      // extraSkills.length === 0 ? 'Pick additional skills' : 'Change skills',
      buttonClass: 'el-button--secondary-link',
      onSkillsSubmit: async skills => {
        if (activeTemplate !== undefined) {
          handleSettingRelatedSkills(activeTemplate, skills)
        } else if (
          activeTemplate == undefined &&
          !!handleSettingRelatedSkills
        ) {
          handleSettingRelatedSkills(skills)
        }
      },
      neededSkillsSelector: true,
      // skills =>
      //   setExtraSkills(skills.map(({ _id, name }) => ({ _id, name }))),
      clearState: true
      // filterSkills: neededSkills
    }
    return (
      <div className='development-plan__filters-wrapper'>
        <div className='development-plan__filters-wrapper__skils'>
          <SettingsIcon className='settings__icon' />
          <span className='development-plan__filters-wrapper__skils-title'>
            Skills
          </span>
          {skillPrefs.map((pref, i, array) => (
            <FilterBoxButton
              name={pref.name}
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
          {handleSettingRelatedSkills && (
            <ListSkillSelector {...selectorProps} />
          )}
        </div>
        <div></div>
        <div className='development-plan__filters-container'>
          <div className='development-plan__filters-heading'>
            <FilterIcon className='filter__icon' />
            <h3>Filters</h3>
          </div>
          {showClearButton && (
            <Button
              size='small'
              onClick={() => {
                filtersDispatch({ type: 'CLEAR_FILTERS' })
                // setExtraSkills([])
              }}
              className='development-plan__filters__heading__button-clear'
            >
              <ResetIcon className='reset__icon' />
              <span>Reset</span>
            </Button>
          )}
          <Dropdown
            trigger='click'
            hideOnClick={false}
            menu={
              <Dropdown.Menu>
                {typePrefs.map((pref, i, array) => (
                  <Dropdown.Item>
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
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            }
          >
            <span
              className={
                filters['preferredTypes'].length > 0
                  ? 'el-dropdown-link--selected'
                  : 'el-dropdown-link'
              }
            >
              <ContentIcon className='filters__icon' />
              Content
              <i className='el-icon-arrow-down el-icon--right'></i>
            </span>
          </Dropdown>
          <Dropdown
            trigger='click'
            hideOnClick={false}
            menu={
              <Dropdown.Menu className='el-dropdown-menu--wider'>
                {myUploads.length !== 0 && (
                  <Dropdown.Item>
                    {myUploads.map(pref => (
                      <FilterBox
                        key={pref._id}
                        {...pref}
                        selected={filterIsSelected(
                          'preferredSources',
                          pref._id
                        )}
                        handleChecking={type => {
                          filtersDispatch({
                            type,
                            key: 'preferredSources',
                            value: pref._id
                          })
                        }}
                        autocheck={sourcePrefs.length === 1}
                        children={
                          <DifficultyIcon
                            className={`filters__icon filters__icon--dropdown ${
                              sourcePrefs.length === 1 ? 'isDisabled' : ''
                            }`}
                          />
                        }
                      />
                    ))}
                  </Dropdown.Item>
                )}
                {companyUploads.length !== 0 && (
                  <Dropdown.Item>
                    {companyUploads.map(pref => (
                      <FilterBox
                        key={pref._id}
                        {...pref}
                        selected={filterIsSelected(
                          'preferredSources',
                          pref._id
                        )}
                        handleChecking={type => {
                          filtersDispatch({
                            type,
                            key: 'preferredSources',
                            value: pref._id
                          })
                        }}
                        autocheck={sourcePrefs.length === 1}
                        children={
                          <UploadIcon
                            className={`filters__icon filters__icon--dropdown ${
                              sourcePrefs.length === 1 ? 'isDisabled' : ''
                            }`}
                          />
                        }
                      />
                    ))}
                  </Dropdown.Item>
                )}
                {sourcePrefsFiltered
                  .slice(0, sourceLimit)
                  .map((pref, i, array) => (
                    <FilterBox
                      key={pref._id}
                      {...pref}
                      selected={filterIsSelected('preferredSources', pref._id)}
                      handleChecking={type => {
                        filtersDispatch({
                          type,
                          key: 'preferredSources',
                          value: pref._id
                        })
                      }}
                      autocheck={array.length === 1}
                    />
                  ))}
                {sourcePrefs.length > 8 && (
                  <Dropdown.Item>
                    <button
                      className='el-button--secondary-link--dropdown'
                      onClick={() => setDialogVisible(!dialogVisible)}
                    >
                      Show all
                      <ArrowIcon className='arrow-icon' />
                    </button>
                    <BodyPortal nameClass='sources'>
                      <Dialog
                        closeOnClickModal={false}
                        title='All Sources'
                        size='full'
                        visible={dialogVisible}
                        onCancel={() => setDialogVisible(false)}
                        lockScroll
                        modalAppendToBody
                        customClass='source__modal'
                      >
                        <Dialog.Body>
                          {myUploads.length !== 0 && (
                            <Dropdown.Item>
                              {myUploads.map(pref => (
                                <FilterBox
                                  key={pref._id}
                                  {...pref}
                                  selected={filterIsSelected(
                                    'preferredSources',
                                    pref._id
                                  )}
                                  handleChecking={type => {
                                    filtersDispatch({
                                      type,
                                      key: 'preferredSources',
                                      value: pref._id
                                    })
                                  }}
                                  autocheck={sourcePrefs.length === 1}
                                  children={
                                    <DifficultyIcon className='filters__icon filters__icon--dropdown' />
                                  }
                                />
                              ))}
                            </Dropdown.Item>
                          )}
                          {companyUploads.length !== 0 && (
                            <Dropdown.Item>
                              {companyUploads.map(pref => (
                                <FilterBox
                                  key={pref._id}
                                  {...pref}
                                  selected={filterIsSelected(
                                    'preferredSources',
                                    pref._id
                                  )}
                                  handleChecking={type => {
                                    filtersDispatch({
                                      type,
                                      key: 'preferredSources',
                                      value: pref._id
                                    })
                                  }}
                                  autocheck={sourcePrefs.length === 1}
                                  children={
                                    <UploadIcon className='filters__icon filters__icon--dropdown' />
                                  }
                                />
                              ))}
                            </Dropdown.Item>
                          )}
                          {sourcePrefsFiltered.map((pref, i, array) => (
                            <FilterBox
                              key={pref._id}
                              {...pref}
                              selected={filterIsSelected(
                                'preferredSources',
                                pref._id
                              )}
                              handleChecking={type =>
                                filtersDispatch({
                                  type,
                                  key: 'preferredSources',
                                  value: pref._id
                                })
                              }
                              // autocheck={array.length === 1}
                            />
                          ))}
                        </Dialog.Body>
                      </Dialog>
                    </BodyPortal>
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            }
          >
            <span
              className={
                filters['preferredSources'].length > 0
                  ? 'el-dropdown-link--selected'
                  : 'el-dropdown-link'
              }
            >
              <SourceIcon className='filters__icon' />
              Source<i className='el-icon-arrow-down el-icon--right'></i>
            </span>
          </Dropdown>
          {!noPaid && (
            <Dropdown
              trigger='click'
              hideOnClick={false}
              menu={
                <Dropdown.Menu>
                  {pricePref.map((pref, i, array) => (
                    <FilterBox
                      key={pref._id}
                      {...pref}
                      selected={filterIsSelected('price', pref._id)}
                      handleChecking={type =>
                        filtersDispatch({
                          type,
                          key: 'price',
                          value: pref._id
                        })
                      }
                      autocheck={array.length === 1}
                    />
                  ))}

                  {price.indexOf('PAID') !== -1 && (
                    <Dropdown.Item>
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
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              }
            >
              <span
                className={
                  filters['price'].length > 0
                    ? 'el-dropdown-link--selected'
                    : 'el-dropdown-link'
                }
              >
                <PriceIcon className='filters__icon' />
                Price<i className='el-icon-arrow-down el-icon--right'></i>
              </span>
            </Dropdown>
          )}

          {/* {languagePref.length > 1 && (
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
          )} */}
          <Dropdown
            trigger='click'
            hideOnClick={false}
            menu={
              <Dropdown.Menu>
                {certPref.map((pref, i, array) => (
                  <Dropdown.Item>
                    <FilterBox
                      key={pref._id}
                      {...pref}
                      selected={filterIsSelected(
                        'preferredCertified',
                        pref._id
                      )}
                      handleChecking={type =>
                        filtersDispatch({
                          type,
                          key: 'preferredCertified',
                          value: pref._id
                        })
                      }
                      autocheck={array.length === 1}
                    ></FilterBox>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            }
          >
            <span
              className={
                filters['preferredCertified'].length > 0
                  ? 'el-dropdown-link--selected'
                  : 'el-dropdown-link'
              }
            >
              <CertificationIcon className='filters__icon' />
              Certification
              <i className='el-icon-arrow-down el-icon--right'></i>
            </span>
          </Dropdown>

          {/* <Slider
              className='slider--duration'
              value={maxDuration}
              min={1}
              max={10}
              step={1}
              onAfterChange={value =>
                filtersDispatch({
                  type: 'SET_FILTER',
                  key: 'maxDuration',
                  value
                })
              }
              // renderTrack={(props, state) => <div {...props} index={state.index} />}
              renderThumb={props => <div {...props} />}
              snapDragDisabled
            />
            <div className='filters__duration__labels'>
              <div className='filters__duration__label filters__duration__label--left'>
                1 or less
              </div>
              <div className='filters__duration__label filters__duration__label--right'>
                10 or more
              </div>
            </div> */}
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
          <Dropdown
            trigger='click'
            hideOnClick={false}
            menu={
              <Dropdown.Menu>
                {durationPref?.map(pref => {
                  return (
                    <Dropdown.Item>
                      <div className='filters__filter'>
                        <Checkbox
                          className={
                            pref.count === 0 ? 'el-checkbox--grey' : undefined
                          }
                          checked={
                            filters.durationEnabled &&
                            filters.durationRanges.some(duration => {
                              return (
                                duration?.minHours === pref?.minHours &&
                                duration?.maxHours === pref?.maxHours
                              )
                            })
                          }
                          onChange={() => {
                            if (
                              filters.durationRanges.some(duration => {
                                return (
                                  duration?.minHours === pref?.minHours &&
                                  duration?.maxHours === pref?.maxHours
                                )
                              })
                            ) {
                              if (filters.durationRanges.length === 1) {
                                filtersDispatch({
                                  type: 'SET_FILTER',
                                  key: 'durationEnabled',
                                  value: false
                                })
                              }

                              filtersDispatch({
                                type: 'SET_FILTER',
                                key: 'durationRanges',
                                value: filters.durationRanges.filter(value => {
                                  return (
                                    value?.maxHours !== pref?.maxHours &&
                                    value?.minHours !== pref?.minHours
                                  )
                                })
                              })
                            } else {
                              filtersDispatch({
                                type: 'SET_FILTER',
                                key: 'durationEnabled',
                                value: true
                              })
                              filtersDispatch({
                                type: 'SET_FILTER',
                                key: 'durationRanges',
                                value: [
                                  ...filters.durationRanges,
                                  {
                                    minHours: pref?.minHours,
                                    maxHours: pref?.maxHours
                                  }
                                ]
                              })
                            }
                          }}
                        >
                          {pref._id}
                        </Checkbox>
                      </div>
                    </Dropdown.Item>
                  )
                })}
              </Dropdown.Menu>
            }
          >
            <span
              className={
                filters['durationRanges'].length > 0
                  ? 'el-dropdown-link--selected'
                  : 'el-dropdown-link'
              }
            >
              <ClockIcon className='filters__icon' />
              Hours
              <i className='el-icon-arrow-down el-icon--right'></i>
            </span>
          </Dropdown>

          <Dropdown
            trigger='click'
            hideOnClick={false}
            menu={
              <Dropdown.Menu>
                {levelPref.map((pref, i, array) => (
                  <Dropdown.Item>
                    <FilterBox
                      key={pref._id}
                      {...pref}
                      selected={filterIsSelected(
                        'preferredDifficulty',
                        pref._id
                      )}
                      handleChecking={type =>
                        filtersDispatch({
                          type,
                          key: 'preferredDifficulty',
                          value: pref._id
                        })
                      }
                      autocheck={array.length === 1}
                    ></FilterBox>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            }
          >
            <span
              className={
                filters['preferredDifficulty'].length > 0
                  ? 'el-dropdown-link--selected'
                  : 'el-dropdown-link'
              }
            >
              <DifficultyIcon className='filters__icon' />
              Difficulty
              <i className='el-icon-arrow-down el-icon--right'></i>
            </span>
          </Dropdown>
        </div>
        <style>{filtersNewStyle}</style>
      </div>
    )
  }
  return null
}

export const FiltersMobile = () => {
  const { displayFilters } = Container.useContainer()
  const [dialogVisible, setDialogVisible] = useState(false)

  // if (!displayFilters) return null

  return (
    <>
      <BodyPortal>
        <Dialog
          visible={dialogVisible}
          onCancel={() => setDialogVisible(false)}
          className='filters-dialog'
        >
          <Dialog.Body>
            <FiltersNew />
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

export default FiltersNew
