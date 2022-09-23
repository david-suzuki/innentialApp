import React, { Component } from 'react'
import { Button, Form, Notification, Dialog } from 'element-react'
import { ApolloConsumer, Mutation, Query } from 'react-apollo'
import {
  updateNeededSkills,
  currentUserSkillsProfile,
  currentUserPreferredTypes,
  updateLearningPreferences,
  fetchUsersProfile
} from '../../api'
import { removeTypename, capitalize } from '../user-profile/utilities'
import { captureFilteredError, LoadingSpinner } from '../general'
import learningPreferencesStyle from '../../styles/learningPreferencesStyle'
import '../../styles/theme/dialog.css'
import '../../styles/theme/notification.css'
import { ListSkillSelector } from './'
import Container from '../../globalState'

const mapSkills = skills => {
  return skills.map(skill => {
    const { name, slug, category, level, skillId, _id } = skill
    return {
      name,
      slug,
      category,
      level,
      _id: skillId || _id
    }
  })
}

class MobilePreferences extends Component {
  state = {
    // allSkills: [],
    // cascaderOptions: [],
    neededWorkSkills: [],
    selectedFilters: [],
    price: [],
    form: {
      selectedGrowthSkills: []
    },
    rules: {
      selectedGrowthSkills: [
        {
          type: 'array',
          required: true,
          message: 'You must select at least one skill'
        },
        {
          validator: (rule, value, callback) => {
            const { selectedGrowthSkills } = this.state.form
            if (selectedGrowthSkills && selectedGrowthSkills.length > 3) {
              callback(new Error('Please select up to three skills'))
            } else {
              callback()
            }
          }
        }
      ]
    },
    contentTypes: ['ARTICLE', 'BOOK', 'TOOL', 'E-LEARNING', 'EVENT'],
    prices: ['Free', 'Paid'],
    // selectingSkill: false,
    changeHappened: false
  }

  componentDidMount() {
    const {
      mappedSkills,
      // allSkills,
      // cascaderOptions,
      selectedFilters,
      price
    } = this.props

    this.setState({
      neededWorkSkills: mappedSkills,
      form: { selectedGrowthSkills: mappedSkills },
      // allSkills,
      // cascaderOptions,
      selectedFilters,
      price
    })
  }

  componentWillReceiveProps(props) {
    const {
      mappedSkills,
      // allSkills,
      // cascaderOptions,
      selectedFilters,
      price
    } = props
    this.setState({
      neededWorkSkills: mappedSkills,
      form: { selectedGrowthSkills: mappedSkills },
      // allSkills,
      // cascaderOptions,
      selectedFilters,
      price
    })
  }

  form = React.createRef()

  onSkillsChange = (value, relatedSkill) => {
    const {
      neededWorkSkills,
      form: { selectedGrowthSkills }
    } = this.state
    const newSelectedSkills = [...selectedGrowthSkills]
    if (
      newSelectedSkills.length &&
      !newSelectedSkills.find(item => item._id === value[1])
    ) {
      newSelectedSkills.push({ ...relatedSkill, level: 0 })
    } else if (!newSelectedSkills.length) {
      newSelectedSkills.push({ ...relatedSkill, level: 0 })
    }
    const changeHappened =
      newSelectedSkills.reduce((acc = [], curr) => {
        if (
          neededWorkSkills.findIndex(needed => needed._id === curr._id) === -1
        ) {
          return [...acc, curr]
        } else return [...acc]
      }, []).length > 0 || newSelectedSkills.length !== neededWorkSkills.length
    this.setState({
      form: {
        selectedGrowthSkills: newSelectedSkills
      },
      changeHappened
    })
  }

  onSkillRemove = (e, skillId, formKey) => {
    const {
      neededWorkSkills,
      form: { selectedGrowthSkills }
    } = this.state
    const newSelectedSkills = selectedGrowthSkills.reduce((acc, curr) => {
      if (curr._id === skillId) return [...acc]
      else {
        return [
          ...acc,
          {
            ...curr
          }
        ]
      }
    }, [])
    const changeHappened =
      neededWorkSkills.reduce((acc = [], curr) => {
        if (
          newSelectedSkills.findIndex(needed => needed._id === curr._id) === -1
        ) {
          return [...acc, curr]
        } else return [...acc]
      }, []).length > 0 || newSelectedSkills.length !== neededWorkSkills.length
    this.setState({
      form: {
        selectedGrowthSkills: newSelectedSkills
      },
      changeHappened
    })
  }

  updateFilters = (key, value) => {
    const oldValue = this.state[key]
    if (oldValue.indexOf(value) === -1) {
      const newValue = [...oldValue, value]
      this.setState({
        [key]: newValue
      })
    } else {
      this.setState({
        [key]: oldValue.filter(filter => filter !== value)
      })
    }
  }

  filterDashboardContent = () => {
    const { selectedFilters, price } = this.state
    this.props.client.mutate({
      mutation: updateLearningPreferences,
      variables: {
        types: selectedFilters,
        price
      },
      refetchQueries: [
        'fetchRelevantContentForUser',
        'currentUserPreferredTypes',
        'fetchLikedContentForUser',
        'fetchDislikedContentForUser',
        'fetchSharedInTeamContent',
        'fetchSharedByMeContent',
        'fetchUserUploadedContent',
        'fetchDevelopmentPlanRelatedContent'
      ]
    })
  }

  handleSubmit = () => {
    const {
      form: { selectedGrowthSkills }
    } = this.state
    this.setState({
      neededWorkSkills: selectedGrowthSkills,
      // selectingSkill: false,
      changeHappened: false,
      dialogVisible: false
    })
  }

  render() {
    const { preferencesState } = this.props
    const {
      form,
      rules,
      form: { selectedGrowthSkills },
      changeHappened,
      contentTypes,
      selectedFilters,
      price,
      prices
    } = this.state
    const selectorProps = {
      skills: selectedGrowthSkills,
      onSkillAdd: this.onSkillsChange,
      onSkillRemove: this.onSkillRemove,
      neededSkillsSelector: true,
      formKey: 'neededWorkSkills'
    }
    if (!preferencesState.visible) {
      return null
    } else
      return (
        <div className='learning-preferences align-left'>
          <Button
            className='el-button--green el-button--learning-preferences el-button--fixed'
            onClick={() => this.setState({ dialogVisible: true })}
          >
            Edit preferences <i className='icon icon-filter' />
          </Button>

          <Dialog
            visible={this.state.dialogVisible}
            onCancel={() => this.setState({ dialogVisible: false })}
            lockScroll={false}
          >
            <Dialog.Body>
              <h5 className='align-center'>Your learning preferences</h5>
              <Form
                ref={this.form}
                rules={rules}
                model={form}
                onSubmit={e => e.preventDefault()}
              >
                {/* {!likedContentList && ( */}
                <div>
                  <h6>Skills that you want to learn</h6>
                  <Form.Item prop='selectedGrowthSkills'>
                    <ListSkillSelector {...selectorProps} />
                  </Form.Item>
                </div>
                {preferencesState.filters && (
                  <div>
                    {preferencesState.types && (
                      <Form.Item>
                        <h6>Type of learning</h6>
                        {contentTypes.length > 0 &&
                          contentTypes.map(type => (
                            <Button
                              key={`TYPETAG:${type}`}
                              type='pale-lilac'
                              className={
                                selectedFilters.indexOf(type) === -1
                                  ? ``
                                  : `el-tag--is-active`
                              }
                              onClick={() =>
                                this.updateFilters('selectedFilters', type)
                              }
                            >
                              {type === 'E-LEARNING'
                                ? capitalize(type)
                                : capitalize(`${type}s`)}
                            </Button>
                          ))}
                      </Form.Item>
                    )}
                    <Form.Item>
                      <h6>Price: </h6>
                      {prices.map(tag => (
                        <Button
                          key={`PRICETAG:${tag}`}
                          type='pale-lilac'
                          className={
                            price.indexOf(tag) === -1 ? `` : `el-tag--is-active`
                          }
                          onClick={() => this.updateFilters('price', tag)}
                        >
                          {tag}
                        </Button>
                      ))}
                    </Form.Item>
                  </div>
                )}
              </Form>
            </Dialog.Body>
            <Dialog.Footer>
              <Mutation
                mutation={updateNeededSkills}
                refetchQueries={[
                  'currentUserSkillsProfile',
                  'fetchRelevantContentForUser',
                  'fetchLearningPathsForDashboard',
                  'fetchLikedContentForUser',
                  'fetchRelevantUsersInOrganization',
                  'fetchSharedInTeamContent',
                  'fetchSharedByMeContent',
                  'fetchUserUploadedContent',
                  'fetchDevelopmentPlanRelatedContent'
                ]}
                update={async (
                  cache,
                  { data: { updateNeededSkills: result } }
                ) => {
                  try {
                    const { user: userId, neededWorkSkills } = result
                    const {
                      fetchUsersProfile: { skillsProfile, ...rest }
                    } = await cache.readQuery({
                      query: fetchUsersProfile,
                      variables: { userId }
                    })
                    await cache.writeQuery({
                      query: fetchUsersProfile,
                      variables: { userId },
                      data: {
                        fetchUsersProfile: {
                          ...rest,
                          skillsProfile: {
                            ...skillsProfile,
                            neededWorkSkills
                          }
                        }
                      }
                    })
                  } catch (err) {}
                }}
              >
                {(updateNeededSkills, { loading }) => {
                  if (loading) return <LoadingSpinner />
                  return (
                    <div className='learning-preferences__button-container'>
                      <Button
                        type='primary'
                        onClick={e => {
                          e.preventDefault()
                          this.form.current.validate(valid => {
                            this.filterDashboardContent()
                            if (changeHappened) {
                              if (valid) {
                                updateNeededSkills({
                                  variables: {
                                    neededWorkSkills: removeTypename(
                                      mapSkills(selectedGrowthSkills)
                                    )
                                  }
                                })
                                  .then(res => {
                                    if (
                                      res.data &&
                                      res.data.updateNeededSkills !== null
                                    ) {
                                      Notification({
                                        type: 'success',
                                        message:
                                          'Your changes have been submitted',
                                        duration: 2500,
                                        offset: 90
                                      })
                                      this.handleSubmit()
                                    } else
                                      Notification({
                                        type: 'warning',
                                        message: 'Oops something went wrong',
                                        duration: 2500,
                                        offset: 90
                                      })
                                  })
                                  .catch(err => {
                                    captureFilteredError(err)
                                    Notification({
                                      type: 'error',
                                      message: 'Oops something went wrong',
                                      duration: 2500,
                                      offset: 90,
                                      iconClass: 'el-icon-error'
                                    })
                                  })
                              }
                            } else {
                              this.setState({ dialogVisible: false })
                            }
                          })
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  )
                }}
              </Mutation>
            </Dialog.Footer>
          </Dialog>

          <style jsx>{learningPreferencesStyle}</style>
        </div>
      )
  }
}

const MobileQueryWrapper = props => {
  const container = Container.useContainer()

  return (
    <Query query={currentUserSkillsProfile}>
      {({
        data: { currentUserSkillsProfile: profile } = {},
        loading: loadingSkills,
        error: errorSkills
      }) => (
        <Query query={currentUserPreferredTypes}>
          {({ data, loading: loadingPrefTypes, error: erorrPrefError }) => {
            if (data && data.currentUserPreferredTypes) {
              const { types: selectedFilters, price } =
                data && data.currentUserPreferredTypes
              if (selectedFilters) {
                if (loadingSkills || loadingPrefTypes) return null
                if (errorSkills || erorrPrefError) {
                  captureFilteredError(errorSkills)
                  captureFilteredError(erorrPrefError)
                  return null
                }
                if (profile && selectedFilters) {
                  const { preferencesState } = container
                  const mappedSkills = mapSkills(profile.neededWorkSkills)

                  return (
                    <MobilePreferences
                      preferencesState={preferencesState}
                      {...props}
                      mappedSkills={mappedSkills}
                      selectedFilters={selectedFilters}
                      price={price}
                    />
                  )
                }
              }
            }
            return null
          }}
        </Query>
      )}
    </Query>
  )
}

export default ({ ...props }) => (
  <ApolloConsumer>
    {client => <MobileQueryWrapper {...props} client={client} />}
  </ApolloConsumer>
)
