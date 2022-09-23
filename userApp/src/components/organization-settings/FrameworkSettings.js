import React, { Component } from 'react'
import {
  FormGroup,
  SkillsFrameworkListStars,
  Statement,
  SkillCategorySelector,
  // SingleSkillSelector,
  FrameworkSkillSelector
} from '../ui-components'
import {
  Form,
  Input,
  // Checkbox,
  Notification,
  Button,
  Radio,
  MessageBox
} from 'element-react'
import { Query, Mutation } from 'react-apollo'
import {
  // fetchCurrentUserOrganization,
  fetchSkillFrameworkForID,
  // setUseCustomFrameworks,
  modifyFrameworkForOrganization,
  fetchSkillListForCategory,
  deleteFramework
} from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'

class FrameworkForm extends Component {
  constructor(props) {
    super(props)

    const { connectedTo, levelTexts, isOrgFramework } = props

    this.state = {
      initialLevelTexts: levelTexts,
      form: {
        connectedTo,
        levelTexts
      },
      hoveredIndex: NaN,
      activeIndex: NaN,
      inputActive: false,
      changeHappened: false,
      isOrgFramework
    }
  }

  formRef = React.createRef()

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOrgFramework !== this.state.isOrgFramework) {
      this.setState(({ form: { connectedTo } }) => ({
        isOrgFramework: nextProps.isOrgFramework,
        initialLevelTexts: nextProps.levelTexts,
        changeHappened: false,
        form: {
          connectedTo,
          levelTexts: nextProps.levelTexts
        }
      }))
      if (this.formRef.current) {
        this.formRef.current.resetFields()
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleEnter)
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleEnter)
  }

  handleEnter = e => {
    if (e.keyCode === 13 && this.state.inputActive) {
      this.setInputActive(false)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isOrgFramework !== this.state.isOrgFramework) {
      return true
    }
    if (!isNaN(nextState.hoveredIndex)) {
      if (
        this.state.inputActive !== nextState.inputActive &&
        nextState.hoveredIndex !== this.state.activeIndex
      ) {
        setTimeout(
          () =>
            this.setState(({ hoveredIndex }) => ({
              activeIndex: hoveredIndex
            })),
          70
        )
      }
      if (
        !this.state.inputActive &&
        nextState.hoveredIndex !== this.state.activeIndex
      ) {
        this.setState(({ hoveredIndex }) => ({
          activeIndex: hoveredIndex
        }))
      }
    } else if (!isNaN(this.state.activeIndex) && !this.state.inputActive) {
      this.setState(({ hoveredIndex }) => ({
        activeIndex: hoveredIndex
      }))
    }
  }

  handleDeletingFramework = async (mutation, frameworkId, onReset) => {
    MessageBox.confirm(
      'This will remove the guidelines from your organization permanently. Continue?',
      'Warning',
      {
        type: 'warning'
      }
    )
      .then(() => {
        mutation({
          variables: { frameworkId }
        })
          .then(({ data: { deleteFramework } }) => {
            if (deleteFramework !== null) {
              Notification({
                type: 'success',
                message: `The guidelines has been successfully removed`,
                duration: 2500,
                offset: 90
              })
              onReset()
            } else {
              Notification({
                type: 'warning',
                message: `Oops! Something went wrong`,
                duration: 2500,
                offset: 90
              })
              captureFilteredError(
                new Error(`Access error for deleting skills framework`)
              )
            }
          })
          .catch(err => {
            Notification({
              type: 'warning',
              message: `Oops! Something went wrong`,
              duration: 2500,
              offset: 90
            })
            captureFilteredError(err)
          })
      })
      .catch(() => {})
  }

  setInputActive = value => {
    this.setState({ inputActive: value })
  }

  setHoveredIndex = ix => {
    this.setState({ hoveredIndex: ix })
  }

  onChangeLevelText = async (key, value) => {
    this.setState(
      ({ initialLevelTexts, form: { connectedTo, levelTexts } }) => ({
        form: {
          connectedTo,
          levelTexts: {
            ...levelTexts,
            [key]: value
          }
        },
        changeHappened: Object.entries(initialLevelTexts).some(
          ([initialKey, initialValue]) => {
            if (initialKey === key) {
              return initialValue !== value
            } else {
              return initialValue !== levelTexts[initialKey]
            }
          }
        )
      })
    )
  }

  postSubmit = () => {
    this.setState(({ form: { levelTexts } }) => ({
      initialLevelTexts: levelTexts,
      changeHappened: false
    }))
  }

  render() {
    const {
      activeIndex,
      inputActive,
      changeHappened,
      isOrgFramework,
      form: { connectedTo, levelTexts }
    } = this.state
    return (
      <Form
        ref={this.formRef}
        model={this.state.form}
        onSubmit={e => e.preventDefault()}
      >
        <Form.Item
          prop='levelTexts'
          // rules={{
          //   type: 'object',
          //   fields: {
          //     level1Text: {
          //       type: 'string',
          //       required: true,
          //       message: 'Please provide all text descriptions'
          //     },
          //     level2Text: {
          //       type: 'string',
          //       required: true,
          //       message: 'Please provide all text descriptions'
          //     },
          //     level3Text: {
          //       type: 'string',
          //       required: true,
          //       message: 'Please provide all text descriptions'
          //     },
          //     level4Text: {
          //       type: 'string',
          //       required: true,
          //       message: 'Please provide all text descriptions'
          //     },
          //     level5Text: {
          //       type: 'string',
          //       required: true,
          //       message: 'Please provide all text descriptions'
          //     }
          //   },
          //   trigger: 'submit'
          // }}
        >
          <ul className='framework-settings__list'>
            {Object.entries(levelTexts).map(([key, value], i) => {
              return (
                <li
                  key={`levelTexts.${key}`}
                  className={`
                    framework-settings__list__item
                    ${activeIndex === i ? 'framework-settings__selected' : ''}
                  `}
                  onClick={() => {
                    if (!inputActive && activeIndex === i) {
                      this.setInputActive(true)
                    }
                  }}
                  onMouseEnter={() => this.setHoveredIndex(i)}
                  onMouseLeave={() => this.setHoveredIndex(NaN)}
                >
                  <SkillsFrameworkListStars
                    level={i + 1}
                    customClassName='framework-settings__list-stars'
                  />
                  <Form.Item key={`levelTexts:${i}`} prop={`levelTexts.${key}`}>
                    {activeIndex === i && inputActive ? (
                      <Input
                        autoFocus
                        value={levelTexts[key]}
                        placeholder='Edit the skill framework level description'
                        onChange={value => this.onChangeLevelText(key, value)}
                        onBlur={() => {
                          this.setInputActive(false)
                        }}
                      />
                    ) : (
                      <span
                        className={`framework-settings__list__item__description ${value.length ===
                          0 &&
                          'framework-settings__list__item__description--notext'}`}
                      >
                        {value.length > 0 ? value : `N/A`}
                        {activeIndex === i && <i className='el-icon-edit' />}
                      </span>
                    )}
                  </Form.Item>
                </li>
              )
            })}
          </ul>
        </Form.Item>
        <div className='framework-settings__buttons'>
          <Mutation
            mutation={modifyFrameworkForOrganization}
            refetchQueries={[
              'fetchSkillCategoriesForOrganizationAdmin',
              'fetchOrganizationSkillFrameworks',
              'currentUserSkillsProfile',
              'fetchOrganizationSpecificSkills',
              'fetchSkillFrameworkForID'
            ]}
          >
            {(mutate, { loading }) => (
              <Button
                type='primary'
                disabled={!changeHappened}
                loading={loading}
                onClick={async e => {
                  e.preventDefault()
                  const valid = !Object.entries(levelTexts).some(
                    ([key, value]) => {
                      return value.length === 0
                    }
                  )
                  // this.formRef.current.validate(async valid => {
                  if (valid) {
                    const inputData = {
                      connectedTo,
                      ...levelTexts
                    }
                    try {
                      const { data } = await mutate({
                        variables: {
                          inputData
                        }
                      })
                      if (
                        data.modifyFrameworkForOrganization &&
                        data.modifyFrameworkForOrganization !== null
                      ) {
                        Notification({
                          type: 'success',
                          message: 'Your changes have been submitted',
                          duration: 2500,
                          offset: 90
                        })
                        this.postSubmit()
                      } else {
                        Notification({
                          type: 'warning',
                          message: 'Oops something went wrong!',
                          duration: 2500,
                          offset: 90
                        })
                      }
                    } catch (e) {
                      captureFilteredError(e)
                      Notification({
                        type: 'warning',
                        message: 'Oops something went wrong!',
                        duration: 2500,
                        offset: 90
                      })
                    }
                  } else {
                    Notification({
                      type: 'info',
                      message: 'Please provide all text descriptions!',
                      iconClass: 'el-icon-info',
                      duration: 2500,
                      offset: 90
                    })
                  }
                  // })
                }}
              >
                Submit
              </Button>
            )}
          </Mutation>
          {isOrgFramework && (
            <Mutation
              mutation={deleteFramework}
              refetchQueries={[
                'fetchSkillFrameworkForID',
                'fetchSkillCategoriesForOrganizationAdmin',
                'fetchOrganizationSkillFrameworks',
                'currentUserSkillsProfile',
                'fetchOrganizationSpecificSkills'
              ]}
            >
              {(mutate, { loading }) => (
                <Button
                  type='warning'
                  loading={loading}
                  onClick={e => {
                    e.preventDefault()
                    this.handleDeletingFramework(
                      mutate,
                      isOrgFramework,
                      this.props.onReset
                    )
                  }}
                >
                  Reset to default
                </Button>
              )}
            </Mutation>
          )}
        </div>
      </Form>
    )
  }
}

export default class FrameworkSettings extends Component {
  constructor(props) {
    super(props)

    // const { hasCustomFrameworks } = props

    this.state = {
      view: 'SKILL',
      selectedCategory: '',
      selectedSkill: '',
      skillName: '',
      showCustomFrameworks: false,
      skillsListExpanded: false
      // hasCustomFrameworks
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.hasCustomFrameworks !== this.state.hasCustomFrameworks) {
  //     this.setState(({ showCustomFrameworks }) => ({
  //       hasCustomFrameworks: nextProps.hasCustomFrameworks,
  //       showCustomFrameworks: showCustomFrameworks && nextProps.hasCustomFrameworks
  //     }))
  //   }
  // }

  resetSelection = () => {
    this.setState({
      skillName: '',
      selectedSkill: '',
      selectedCategory: ''
    })
  }

  // toggleCustomFrameworks = () => {
  //   this.setState(({ showCustomFrameworks }) => ({
  //     showCustomFrameworks: !showCustomFrameworks
  //   }))
  //   this.resetSelection()
  // }

  toggleSkillList = () => {
    this.setState(({ skillsListExpanded }) => ({
      skillsListExpanded: !skillsListExpanded
    }))
  }

  setSelectedCategory = value => {
    this.setState({
      selectedCategory: value
    })
  }

  // setSuggestionSkill = (event, { suggestion: { _id } }) => {
  //   this.setState({
  //     selectedSkill: _id
  //   })
  // }

  setSelectedSkill = skill => {
    this.setState({
      skillName: skill.label,
      selectedSkill: skill.value
    })
  }

  // setSkillName = (e, value) => {
  //   if (value === undefined) {
  //     captureFilteredError(`Undefined value in autosuggest component`)
  //   } else {
  //     const { newValue } = value
  //     this.setState({
  //       skillName: newValue,
  //       selectedSkill: ''
  //     })
  //   }
  // }

  toggleView = value => {
    this.setState({
      view: value
    })
    this.resetSelection()
  }

  render() {
    const {
      view,
      selectedCategory,
      selectedSkill,
      skillName,
      skillsListExpanded
      // showCustomFrameworks
      // hasCustomFrameworks
    } = this.state
    return (
      <div>
        <Radio.Group value={view} onChange={this.toggleView}>
          <Radio value='SKILL'>Single skill</Radio>
          <Radio value='CATEGORY'>Category of skills</Radio>
        </Radio.Group>
        {/* <div className="align-left">
          {hasCustomFrameworks && (
            <Checkbox
              checked={showCustomFrameworks}
              onChange={this.toggleCustomFrameworks}
            >
              Show your custom frameworks
          </Checkbox>
          )}
        </div> */}
        <FormGroup>
          {view === 'SKILL' ? (
            <div className='framework-settings__type'>
              <FrameworkSkillSelector
                selectedSkillName={skillName}
                onChange={this.setSelectedSkill}
              />
              {selectedSkill !== '' && (
                <div>
                  <Query
                    query={fetchSkillFrameworkForID}
                    variables={{
                      connectedTo: selectedSkill
                    }}
                    fetchPolicy='cache-and-network'
                  >
                    {({ data, loading, error }) => {
                      if (loading) return <LoadingSpinner />
                      if (error) {
                        captureFilteredError(error)
                        return (
                          <Statement content='Oops! Something went wrong' />
                        )
                      }

                      if (data) {
                        const {
                          levelTexts,
                          orgFramework
                        } = data.fetchSkillFrameworkForID
                        delete levelTexts._id
                        delete levelTexts.__typename
                        return (
                          <FrameworkForm
                            connectedTo={selectedSkill}
                            levelTexts={levelTexts}
                            isOrgFramework={orgFramework}
                            onReset={this.resetSelection}
                          />
                        )
                      }
                    }}
                  </Query>
                </div>
              )}
            </div>
          ) : (
            <div className='framework-settings__type'>
              <SkillCategorySelector
                selectedCategory={selectedCategory}
                onChange={this.setSelectedCategory}
                // filterFrameworks={showCustomFrameworks}
              />
              {selectedCategory !== '' && (
                <>
                  <Query
                    query={fetchSkillListForCategory}
                    variables={{
                      categoryId: selectedCategory
                    }}
                  >
                    {({ data, loading, error }) => {
                      if (loading) return null
                      if (error) {
                        captureFilteredError(error)
                        return null
                      }

                      if (
                        data &&
                        data.fetchSkillListForCategory &&
                        data.fetchSkillListForCategory.length > 0
                      ) {
                        return (
                          <div>
                            <div className='framework-settings__skills-expand'>
                              <span
                                onClick={this.toggleSkillList}
                                className='framework-settings__skills-expand__content'
                              >
                                Show all skills connected with this category
                                {'  '}
                                <i
                                  className={`icon${
                                    skillsListExpanded ? ' icon-rotate-180' : ''
                                  } icon-small-down`}
                                />
                              </span>
                            </div>
                            {skillsListExpanded && (
                              <div className='framework-settings__skills-results'>
                                {data.fetchSkillListForCategory
                                  .sort((a, b) => a.localeCompare(b))
                                  .join(', ')}
                              </div>
                            )}
                          </div>
                        )
                      } else return null
                    }}
                  </Query>
                  <Query
                    query={fetchSkillFrameworkForID}
                    variables={{
                      connectedTo: selectedCategory
                    }}
                    fetchPolicy='cache-and-network'
                  >
                    {({ data, loading, error }) => {
                      if (loading) return <LoadingSpinner />
                      if (error) {
                        captureFilteredError(error)
                        return (
                          <Statement content='Oops! Something went wrong' />
                        )
                      }

                      if (data) {
                        const {
                          levelTexts,
                          orgFramework
                        } = data.fetchSkillFrameworkForID
                        delete levelTexts._id
                        delete levelTexts.__typename
                        return (
                          <FrameworkForm
                            connectedTo={selectedCategory}
                            levelTexts={levelTexts}
                            isOrgFramework={orgFramework}
                            onReset={this.resetSelection}
                          />
                        )
                      }
                    }}
                  </Query>
                </>
              )}
            </div>
          )}
        </FormGroup>
      </div>
    )
  }
}

// OLD CODE BELOW

// const UseCustomFrameworkCheckbox = ({ useCustomFrameworks }) => {
//   return (
//     <Mutation
//       mutation={setUseCustomFrameworks}
//       refetchQueries={[
//         'fetchOrganizationSkillFrameworks',
//         'currentUserSkillsProfile',
//         'fetchOrganizationSpecificSkills'
//       ]}
//       update={async (cache, { data: { setUseCustomFrameworks } }) => {
//         if (setUseCustomFrameworks !== null) {
//           try {
//             const {
//               fetchCurrentUserOrganization: organizationData
//             } = cache.readQuery({
//               query: fetchCurrentUserOrganization
//             })
//             await cache.writeQuery({
//               query: fetchCurrentUserOrganization,
//               data: {
//                 fetchCurrentUserOrganization: {
//                   ...organizationData,
//                   useCustomFrameworks: setUseCustomFrameworks
//                 }
//               }
//             })
//           } catch (e) { }
//         }
//       }}
//     >
//       {(mutate, { loading, error }) => {
//         if (loading) return <LoadingSpinner />
//         if (error) {
//           captureFilteredError(error)
//           return <Statement content={'Oops! Something went wrong'} />
//         }
//         return (
//           <div className="align-left">
//             <Checkbox
//               checked={useCustomFrameworks}
//               onChange={async value => {
//                 try {
//                   await mutate({
//                     variables: {
//                       useCustomFrameworks: value
//                     }
//                   })
//                   Notification({
//                     type: 'success',
//                     message: 'Your changes have been submitted',
//                     duration: 2500,
//                     offset: 90
//                   })
//                 } catch (e) {
//                   captureFilteredError(error)
//                   Notification({
//                     type: 'warning',
//                     message: 'Oops something went wrong!',
//                     duration: 2500,
//                     offset: 90
//                   })
//                 }
//               }}
//             >
//               Show your custom frameworks
//             </Checkbox>
//           </div>
//         )
//       }}
//     </Mutation>
//   )
// }
