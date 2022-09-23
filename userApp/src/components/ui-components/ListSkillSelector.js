import React, { Component, useState } from 'react'
import {
  Dialog,
  Button,
  Notification,
  Input,
  Form,
  Checkbox
} from 'element-react'
import { normalizeSkills } from '../user-onboarding/utilities'
import { Query, Mutation } from 'react-apollo'
import { SkillCategorySelector } from '../ui-components'
import {
  fetchDisabledNeededSkills,
  fetchOrganizationSpecificSkills,
  currentUser,
  userAddSkill
} from '../../api'
import prepareSkillsList from './utils/prepareSkillsList'
import { LoadingSpinner, captureFilteredError } from '../general'
import listStyleSelectorStyle from '../../styles/listStyleSelectorStyle'
import BodyPortal from '../ui-components/BodyPortal'
import history from '../../history'
import fuzzysort from 'fuzzysort'
import { removeDuplicates } from '../../utils'
import Tooltip from 'react-simple-tooltip'
import { useGA4React } from 'ga-4-react'

export const SelectedSkills = ({ skills, onSkillRemove }) => {
  return (
    <div
      className='cascader-selections'
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {skills.map(skill => {
        const { name, _id, mandatory } = skill
        const label = mandatory ? <strong>{name}</strong> : name
        return (
          <div key={_id}>
            <Button
              type='primary'
              style={{ margin: '4px 10px 4px 0' }}
              className='el-button--cascader'
              onClick={e => onSkillRemove(skill, e)}
            >
              {label} <i className='icon icon-e-remove' />
            </Button>
          </div>
        )
      })}
    </div>
  )
}

const highlightedCategories = [
  'Digital Skills',
  'Data',
  'Human Resources',
  'Personal Productivity',
  'Project Management'
]

class SkillList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeList: '',
      search: '',
      focused: false,
      viewList: !props.inline || props.framework,
      creatingNewSkill: false,
      selectedCategory: ''
    }
  }

  wrapperRef = React.createRef()

  resetSkillCreateFields = () => {
    this.setState({
      creatingNewSkill: false,
      selectedCategory: ''
    })
  }

  handleClick = e => {
    if (
      this.props.inline &&
      this.wrapperRef &&
      this.wrapperRef.current !== null &&
      !this.wrapperRef.current.contains(e.target) &&
      !this.props.framework
    ) {
      this.clearSearch()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.framework) {
      const { selectedSkillName } = nextProps
      this.setState({
        search: selectedSkillName
      })
    }

    if (!nextProps.isVisible) this.resetSkillCreateFields()
  }

  componentDidMount() {
    if (!this.props.inline) {
      const innerInput = document.getElementsByClassName('el-input__inner')[0]
      if (innerInput)
        innerInput.className = 'el-input__inner el-input__inner--noborder'
    } else {
      document.addEventListener('mousedown', this.handleClick)
    }
  }

  componentWillUnmount() {
    if (this.props.inline) {
      document.removeEventListener('mousedown', this.handleClick)
    }
  }

  clearSearch = () => {
    this.resetSkillCreateFields()
    this.setSearch('')
    if (this.props.inline && !this.props.framework) {
      this.viewList(false)
    }
    if (this.props.framework) {
      this.props.onSkillAdd({ label: '', value: '' })
    }
  }

  setSearch = value => {
    this.setState({ search: value })
  }

  setActiveList = value => {
    this.setState({ activeList: value })
  }

  viewList = value => {
    const { viewList } = this.state
    if (viewList !== value) {
      if (value) {
        const innerInput = document.getElementsByClassName('el-input__inner')[0]
        if (innerInput)
          innerInput.className = 'el-input__inner el-input__inner--noborder'
      } else {
        const innerInput = document.getElementsByClassName(
          'el-input__inner--noborder'
        )[0]
        if (innerInput) innerInput.className = 'el-input__inner'
      }
    }
    this.setState({ viewList: value })
  }

  render() {
    const {
      skillData,
      onSkillAdd,
      onSkillRemove,
      inline,
      framework,
      neededSkillsSelector
    } = this.props
    const {
      search,
      activeList,
      viewList,
      creatingNewSkill,
      selectedCategory
    } = this.state
    const normalizedSkills = normalizeSkills(skillData).reduce((acc, curr) => {
      return {
        ...acc,
        [curr.label]: curr.children
      }
    }, {})
    const categories = Object.keys(normalizedSkills)
    categories.sort((a, b) => a.localeCompare(b))
    if (neededSkillsSelector) {
      categories.sort(
        (a, b) =>
          (highlightedCategories.indexOf(b) !== -1) -
          (highlightedCategories.indexOf(a) !== -1)
      )
    }
    Object.entries(normalizedSkills).forEach(([key, value]) => {
      value.sort(
        (a, b) => b.mandatory - a.mandatory || a.label.localeCompare(b.label)
      )
    })
    const active = activeList || categories[0]
    // const regex = new RegExp(
    //   `${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, //eslint-disable-line
    //   'i'
    // )
    // const searchSkills = skillData.filter(({ name }) => regex.test(name))
    let searchSkills = skillData
    if (search && search.length > 0) {
      searchSkills = fuzzysort
        .go(search, skillData, { key: 'name' })
        .map(s => s.obj)
    }
    return (
      <div
        className='list-skill-selector-wrapper'
        // id="sswrapper"
        ref={this.wrapperRef}
      >
        <div className='skillgap__search-box-input'>
          <Input
            value={search}
            placeholder='Search Skills...'
            onChange={value => this.setSearch(value)}
            icon={search.length > 0 ? 'close' : 'search'}
            onIconClick={this.clearSearch}
            className='list-skill-selector__input'
            onFocus={() => {
              if (framework) {
                this.setSearch('')
                onSkillAdd({ label: '', value: '' })
              }
              if (inline) this.viewList(true)
            }}
          />
        </div>
        <Mutation
          mutation={userAddSkill}
          variables={{
            inputData: {
              name: search,
              category: selectedCategory
            }
          }}
          onError={e => {
            captureFilteredError(e)
            Notification({
              type: 'error',
              message: 'Something went wrong!',
              duration: 2500,
              offset: 90,
              iconClass: 'el-icon-info'
            })
            this.resetSkillCreateFields()
          }}
          onCompleted={data => {
            const skill = data.userAddSkill
            if (skill && this.props.selectAddedSkill) {
              this.props.selectAddedSkill({ ...skill, skillId: skill._id })
              this.clearSearch()
            } else if (skill && framework) {
              Notification({
                type: 'success',
                message: `Added new skill! ${skill.name}`,
                duration: 2500,
                offset: 90,
                iconClass: 'el-icon-info'
              })
              onSkillAdd({ label: skill.name, value: skill._id })
              if (inline) this.viewList(false)
            }
          }}
          // update={(proxy, { data: { userAddSkill } }) => {
          //   try {
          //     let data = proxy.readQuery({
          //       query: fetchOrganizationSpecificSkills
          //     })
          //     data.fetchOrganizationSpecificSkills.push(userAddSkill)
          //     proxy.writeQuery(
          //       { query: fetchOrganizationSpecificSkills, data }
          //     )

          //     this.props.selectAddedSkill(userAddSkill)
          //     this.clearSearch()
          //   } catch (e) {
          //     captureFilteredError(e)
          //   }
          // }}
          refetchQueries={['fetchOrganizationSpecificSkills']}
        >
          {(skillAddMutation, { loading }) => {
            if (loading) return <LoadingSpinner />

            return (
              <>
                {creatingNewSkill && (
                  <div style={{ padding: 14 }}>
                    <SkillCategorySelector
                      removeCustomFrameworks
                      notListedOption
                      selectStyle='select-autosuggest-in-modal'
                      onChange={category => {
                        this.setState(
                          { selectedCategory: category },
                          skillAddMutation
                        )
                      }}
                    />
                  </div>
                )}
                {viewList && !creatingNewSkill && (
                  <div className='list-skill-selector__results'>
                    {search === '' && (
                      <ul className='list-skill-selector__results__categories'>
                        {categories.map(category => (
                          <li
                            className={`list-skill-selector__results__categories__item ${
                              active === category ? 'active' : ''
                            }`}
                            key={`skillcategory:${category}`}
                            onClick={() => this.setActiveList(category)}
                            style={{
                              fontWeight:
                                highlightedCategories.indexOf(category) !==
                                  -1 && neededSkillsSelector
                                  ? 'bold'
                                  : 'normal'
                            }}
                          >
                            <span>{category}</span>
                            <i className='icon icon-small-right' />
                          </li>
                        ))}
                      </ul>
                    )}
                    {search === '' ? (
                      <ul className='list-skill-selector__results__skills'>
                        {normalizedSkills[active] &&
                          normalizedSkills[active].length > 0 &&
                          normalizedSkills[active].map((skill, i, array) => {
                            const { label, value, mandatory } = skill
                            const formattedLabel = mandatory ? (
                              <strong>{label}</strong>
                            ) : (
                              label
                            )
                            const prevSkillMandatory = array[i + 1]?.mandatory
                            const mandatoryPadding =
                              mandatory && !prevSkillMandatory
                            const higherOrderSkill = label.split(' - ')[0]
                            const prevHigherOrderSkill = array[
                              i - 1
                            ]?.label.split(' - ')[0]
                            const nextHigherOrderSkill = array[
                              i + 1
                            ]?.label.split(' - ')[0]
                            const skillNamePadding =
                              higherOrderSkill === prevHigherOrderSkill &&
                              higherOrderSkill !== nextHigherOrderSkill

                            const isSkillSelected = this.props.selectedSkills.some(
                              selected => selected.skillId === skill.value
                            )

                            return (
                              <>
                                <li
                                  className={
                                    isSkillSelected
                                      ? 'list-skill-selector__results__skills__item__selected'
                                      : 'list-skill-selector__results__skills__item'
                                  }
                                  key={`skill:${value}`}
                                  onClick={e => {
                                    if (isSkillSelected) {
                                      onSkillRemove(
                                        {
                                          _id: skill.value,
                                          skillId: skill.value,
                                          ...skill
                                        },
                                        e
                                      )
                                    } else {
                                      if (
                                        normalizedSkills[active].length === 1
                                      ) {
                                        this.setActiveList(categories[0])
                                      }
                                      onSkillAdd(skill)
                                      if (framework) this.viewList(false)
                                    }
                                  }}
                                >
                                  <span>{formattedLabel}</span>
                                  {!framework && (
                                    <i
                                      className={
                                        isSkillSelected
                                          ? 'icon el-icon-minus'
                                          : 'icon el-icon-plus'
                                      }
                                    />
                                  )}
                                </li>
                                {mandatoryPadding && (
                                  <div
                                    style={{
                                      padding: 5,
                                      backgroundColor: '#ececec'
                                    }}
                                  />
                                )}
                                {!mandatory &&
                                  !prevSkillMandatory &&
                                  skillNamePadding && (
                                    <div
                                      style={{
                                        padding: 5,
                                        backgroundColor: '#ececec'
                                      }}
                                    />
                                  )}
                              </>
                            )
                          })}
                      </ul>
                    ) : (
                      <ul className='list-skill-selector__results__skills'>
                        {!neededSkillsSelector && (
                          <li
                            className='list-skill-selector__results__skills__item'
                            style={{ color: '#29a399' }}
                            onClick={e =>
                              this.setState({ creatingNewSkill: true })
                            }
                          >
                            Add as new skill
                            <span>
                              <i className='icon icon-small-add' />
                            </span>
                          </li>
                        )}
                        {searchSkills &&
                          searchSkills.length > 0 &&
                          searchSkills.map(skill => {
                            const { name, category, _id } = skill
                            return (
                              <li
                                className='list-skill-selector__results__skills__item'
                                key={`skill-search:${_id}`}
                                onClick={() => {
                                  if (searchSkills.length === 1) {
                                    this.setSearch('')
                                  }
                                  this.setActiveList(category)
                                  onSkillAdd({ label: name, value: _id })
                                  if (framework) this.viewList(false)
                                }}
                              >
                                <span>
                                  <strong>{name}</strong>
                                  <span className='skill-name-category'>
                                    ({category})
                                  </span>
                                </span>
                                <span>
                                  <i className='icon icon-small-add' />
                                </span>
                              </li>
                            )
                          })}
                        {searchSkills.length === 0 && (
                          <li className='list-skill-selector__results__skills__item'>
                            No skills found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )
          }}
        </Mutation>
      </div>
    )
  }
}

// class SelectInline extends Component {
//   constructor(props) {
//     super(props)

//     const { skills, skillData, filterSkills } = props

//     this.state = {
//       skillData,
//       selectedSkills: skills,
//       filterSkills,
//       lazySkill: null
//     }
//   }

//   skillList = React.createRef()

//   componentWillReceiveProps(props) {
//     const { skills, skillData } = props
//     const { lazySkill } = this.state

//     const mergedArray = lazySkill ? [...skills, lazySkill] : [...skills]
//     const uniqueSkills = removeDuplicates(mergedArray, '_id')

//     if (lazySkill && this.props.onSkillAdd) {
//       this.props.onSkillAdd(
//         [lazySkill.name, lazySkill._id],
//         lazySkill,
//         this.props.formKey
//       )
//     }
//     this.setState({
//       skillData,
//       selectedSkills: uniqueSkills,
//       lazySkill: null
//     })
//   }

//   onSkillAdd = skill => {
//     const { selectedSkills, skillData } = this.state
//     if (!selectedSkills.some(selected => selected.skillId === skill.value)) {
//       const newSkill = skillData.find(
//         normalised => normalised._id === skill.value
//       )
//       if (newSkill) {
//         this.setState({
//           selectedSkills: [
//             {
//               ...newSkill,
//               skillId: newSkill._id
//             },
//             ...selectedSkills
//           ]
//         })
//         this.props.onSkillAdd(
//           [skill.label, skill.value],
//           newSkill,
//           this.props.formKey
//         )
//       }
//     }
//   }

//   onSkillRemove = (skill, e) => {
//     this.setState(({ selectedSkills }) => ({
//       selectedSkills: selectedSkills.filter(selected => {
//         if (selected.skillId) {
//           return selected.skillId !== skill.skillId
//         } else return selected._id !== skill._id
//       })
//     }))
//     this.props.onSkillRemove(e, skill._id, this.props.formKey)
//   }

//   render() {
//     const { skillData, selectedSkills } = this.state
//     const filteredSkills = skillData.filter(
//       skill =>
//         !selectedSkills.some(selected => {
//           if (selected.skillId) {
//             return selected.skillId === skill._id
//           } else return selected._id === skill._id
//         })
//     )
//     const formItemKey = this.props.item || this.props.formKey
//     return (
//       <div className='list-skill-selector'>
//         {selectedSkills.length > 0 && (
//           <div className='list-skill-selector__label'>Selected:</div>
//         )}
//         {this.props.item || this.props.formKey ? (
//           <Form.Item prop={formItemKey}>
//             <SelectedSkills
//               skills={selectedSkills}
//               onSkillRemove={this.onSkillRemove}
//             />
//           </Form.Item>
//         ) : (
//           <SelectedSkills
//             skills={selectedSkills}
//             onSkillRemove={this.onSkillRemove}
//           />
//         )}
//         <SkillList
//           skillData={filteredSkills}
//           onSkillAdd={this.onSkillAdd}
//           ref={this.skillList}
//           inline
//           selectAddedSkill={skill => this.setState({ lazySkill: skill })}
//         />
//         <style jsx>{listStyleSelectorStyle}</style>
//       </div>
//     )
//   }
// }

class SelectPopup extends Component {
  constructor(props) {
    super(props)

    const { skills } = props

    this.state = {
      selectedSkills: skills,
      visible: false
    }
  }

  skillList = React.createRef()

  toggleVisibility = () => {
    this.setState(({ visible }) => ({
      visible: !visible
    }))
  }

  onSkillAdd = skill => {
    this.setState(({ selectedSkills }) => {
      if (this.props.neededSkillsSelector && selectedSkills.length >= 3) {
        Notification({
          type: 'warning',
          message: "You can't select more than 3 skills!",
          duration: 2500,
          offset: 90
        })
        return { selectedSkills }
      }

      if (!selectedSkills.some(selected => selected.skillId === skill.value)) {
        const newSkill = this.props.skillData.find(
          normalised => normalised._id === skill.value
        )
        if (newSkill) {
          return {
            selectedSkills: [
              {
                ...newSkill,
                skillId: newSkill._id
              },
              ...selectedSkills
            ]
          }
        } else {
          captureFilteredError(`Skill not found in data: ${skill.value}`)
        }
      }
      return { selectedSkills }
    })
  }

  onSkillRemove = skill => {
    this.setState(({ selectedSkills }) => ({
      selectedSkills: selectedSkills.filter(selected => {
        const skillId = skill.skillId || skill._id
        if (selected.skillId) {
          return selected.skillId !== skillId
        } else return selected._id !== skillId
      })
    }))
  }

  onReset = () => {
    this.setState({
      // selectedSkills: [...this.props.skills],
      visible: false
    })
    this.skillList.current.clearSearch()
  }

  render() {
    const { selectedSkills, visible } = this.state

    const {
      buttonClass,
      buttonValue,
      preferences,
      onSkillsSubmit,
      onSkillRemove,
      customClassName,
      neededSkillsSelector,
      filterSkills,
      skillData,
      clearState
    } = this.props

    const skillKey = neededSkillsSelector
      ? 'neededWorkSkills'
      : 'selectedWorkSkills'

    const filteredSkills = skillData
      .filter(
        skill =>
          !selectedSkills.some(selected => {
            if (selected.skillId) {
              return selected.skillId === skill._id
            } else return selected._id === skill._id
          })
      )
      .filter(skill => {
        if (filterSkills && filterSkills.length > 0) {
          return !filterSkills.some(filter => {
            if (filter.skillId) {
              return filter.skillId === skill._id
            } else return filter._id === skill._id
          })
        } else return true
      })

    return (
      <div className={`list-skill-selector ${customClassName}`}>
        <p className={buttonClass} onClick={this.toggleVisibility}>
          {buttonValue}
        </p>
        <BodyPortal>
          <Dialog
            visible={visible}
            onCancel={this.toggleVisibility}
            lockScroll={false}
            showClose={false}
          >
            <Dialog.Body>
              <div className='list-skill-selector__title'>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  {neededSkillsSelector
                    ? 'Select up to 3 skills'
                    : 'Add more skills'}{' '}
                  {neededSkillsSelector && (
                    <Tooltip
                      content='Our research shows that selecting up to 3 skills
                      makes learning more effective.'
                      zIndex={11}
                      fontSize='11px'
                      padding={4}
                      placement='bottom'
                      style={{ width: '30px' }}
                    >
                      <i
                        className='icon el-icon-question'
                        style={{ fontSize: '21px' }}
                      />
                    </Tooltip>
                  )}
                </span>
              </div>
              <div className='list-skill-selector__label'>Selected:</div>
              <SelectedSkills
                skills={selectedSkills}
                onSkillRemove={(skill, e) => {
                  if (typeof onSkillRemove === 'function') {
                    onSkillRemove(e, skill.skillId || skill._id, skillKey)
                  }
                  this.onSkillRemove(skill, e)
                }}
              />
              <SkillList
                skillData={skillData}
                selectedSkills={selectedSkills}
                onSkillAdd={this.onSkillAdd}
                onSkillRemove={(skill, e) => {
                  if (typeof onSkillRemove === 'function') {
                    onSkillRemove(e, skill.skillId || skill._id, skillKey)
                  }
                  this.onSkillRemove(skill, e)
                }}
                ref={this.skillList}
                inline={false}
                isVisible={visible}
                neededSkillsSelector={neededSkillsSelector}
                selectAddedSkill={skill =>
                  this.setState({ selectedSkills: [...selectedSkills, skill] })
                }
              />
            </Dialog.Body>
            <Dialog.Footer>
              <div className='list-skill-selector__actions'>
                <Button
                  type='primary'
                  // disabled={selectedSkills.length < 1}
                  onClick={() => {
                    if (preferences && selectedSkills.length === 0) {
                      Notification({
                        type: 'warning',
                        message: 'At least 1 skill is required',
                        duration: 2500,
                        offset: 90
                      })
                    } else if (preferences && selectedSkills.length > 3) {
                      Notification({
                        type: 'warning',
                        message: 'Please select up to three skills',
                        duration: 2500,
                        offset: 90
                      })
                    } else {
                      onSkillsSubmit(
                        selectedSkills.map(selected => {
                          if (selected.level === undefined) {
                            return {
                              ...selected,
                              level: 1
                            }
                          } else return selected
                        })
                      )
                      this.onReset()
                    }
                  }}
                >
                  Submit
                </Button>
                <Button onClick={() => this.onReset()}>Cancel</Button>
                {/* <Button
                  type="warning"
                  onClick={() => history.push('/teams', { activeIndex: 'create-skills' })}
                >
                  Create new skill
                </Button> */}
              </div>
            </Dialog.Footer>
          </Dialog>
        </BodyPortal>
        <style jsx>{listStyleSelectorStyle}</style>
      </div>
    )
  }
}

class SelectFramework extends Component {
  constructor(props) {
    super(props)

    const { selectedSkillName, filteredData } = props

    this.state = {
      skillData: filteredData,
      selectedSkillName
    }
  }

  skillList = React.createRef()

  componentWillReceiveProps(props) {
    const { selectedSkillName, filteredData, filterFrameworks } = props

    if (filterFrameworks !== this.props.filterFrameworks) {
      this.skillList.current.clearSearch()
    }

    this.setState({
      skillData: filteredData,
      selectedSkillName
    })
  }

  render() {
    const { skillData, selectedSkillName } = this.state
    const { onChange } = this.props
    return (
      <div className='list-skill-selector'>
        <SkillList
          skillData={skillData}
          selectedSkills={[]}
          onSkillAdd={onChange}
          selectedSkillName={selectedSkillName}
          ref={this.skillList}
          inline
          framework
        />
        <style jsx>{listStyleSelectorStyle}</style>
      </div>
    )
  }
}

class ResetFilter extends Component {
  componentDidMount() {
    this.props.resetFilter()
  }

  render() {
    return null
  }
}

export const FrameworkSkillSelector = ({ selectedSkillName, onChange }) => {
  const [filterFrameworks, setFilterFrameworks] = useState(false)
  return (
    <Query query={fetchOrganizationSpecificSkills}>
      {({ loading, error, data }) => {
        if (loading) return <LoadingSpinner />
        if (error) return `Error! ${error.message}`

        if (data) {
          const skillData = data.fetchOrganizationSpecificSkills
          const hasFrameworks = skillData.some(skill => skill.orgFrameworkId)
          const filteredData = skillData.filter(skill => {
            if (filterFrameworks) {
              return skill.orgFrameworkId
            } else return true
          })
          const selectProps = {
            filterFrameworks,
            selectedSkillName,
            onChange,
            filteredData
          }
          return (
            <>
              {!hasFrameworks && filteredData.length === 0 && (
                <ResetFilter resetFilter={() => setFilterFrameworks(false)} />
              )}
              {hasFrameworks && (
                <Checkbox
                  checked={filterFrameworks}
                  onChange={() => setFilterFrameworks(!filterFrameworks)}
                >
                  Show skills with custom guidelines only
                </Checkbox>
              )}
              <SelectFramework {...selectProps} />
            </>
          )
        }
        return null
      }}
    </Query>
  )
}

export default ({
  neededSkillsSelector, // Bool
  buttonValue, // String
  buttonClass, // String
  skills, // [Skill] Skill: { name, _id, skillId, category, slug }
  onSkillsSubmit, // function([Skill]) => void
  onboarding, // Bool
  onSkillAdd, // function([label, _id], skill, formKey )
  onSkillRemove, // function(e, skill._id, formKey )
  formKey, // String
  preferences, // Bool
  customClassName = '',
  item, // String
  filterSkills, // [Skill]
  forwardRef, // Ref
  hideLoading, // Bool
  clearState // BOOL
}) => {
  const ga = useGA4React()
  return (
    <Query query={fetchDisabledNeededSkills}>
      {({ loading: orgLoading, error: orgError, data: orgData }) => {
        return (
          <Query query={fetchOrganizationSpecificSkills}>
            {({ loading, error, data }) => {
              if (loading || orgLoading) {
                if (hideLoading) return null
                else return <LoadingSpinner />
              }

              if (error || orgError) {
                captureFilteredError(error)
                captureFilteredError(orgError)
                return `Error!`
              }

              if (data && orgData) {
                const skillData = prepareSkillsList(
                  data.fetchOrganizationSpecificSkills,
                  orgData.fetchCurrentUserOrganization &&
                    orgData.fetchCurrentUserOrganization.disabledNeededSkills,
                  neededSkillsSelector
                )

                // const isPopup = !onboarding && !neededSkillsSelector

                // if (isPopup) {
                return (
                  <SelectPopup
                    ref={forwardRef}
                    buttonClass={buttonClass}
                    buttonValue={buttonValue}
                    skills={skills}
                    skillData={skillData}
                    onSkillsSubmit={onSkillsSubmit}
                    onSkillRemove={onSkillRemove}
                    preferences={preferences}
                    customClassName={customClassName}
                    filterSkills={filterSkills}
                    neededSkillsSelector={neededSkillsSelector}
                    clearState={clearState}
                    ga={ga}
                  />
                )
                // } else {
                //   return (
                //     <SelectInline
                //       onboarding={onboarding}
                //       neededSkillsSelector={neededSkillsSelector}
                //       skills={skills}
                //       skillData={skillData}
                //       onSkillAdd={onSkillAdd}
                //       onSkillRemove={onSkillRemove}
                //       formKey={formKey}
                //       item={item}
                //       canCreateSkill={
                //         userData.currentUser.roles.indexOf('ADMIN') !== -1
                //       }
                //     />
                //   )
                // }
              }
              return null
            }}
          </Query>
        )
      }}
    </Query>
  )
}
