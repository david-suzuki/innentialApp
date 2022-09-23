import React, { Component } from 'react'
import { Button, Form, Notification, Tag } from 'element-react'
import { Query } from 'react-apollo'
import {
  updateNeededSkills,
  currentUserSkillsProfile,
  currentUserPreferredTypes,
  updateLearningPreferences,
  fetchUsersProfile
} from '../../api'
import { removeTypename, capitalize } from '../user-profile/utilities'
import { captureFilteredError } from '../general'
import learningPreferencesStyle from '../../styles/learningPreferencesStyle'
import '../../styles/theme/dialog.css'
import '../../styles/theme/notification.css'
import { withRouter } from 'react-router-dom'
import Container from '../../globalState'
import { ListSkillSelector } from './'

const mapSkills = skills => {
  return skills.map(skill => {
    const { name, slug, category, level, skillId } = skill
    if (!skillId) return skill
    return {
      name,
      slug,
      category,
      level,
      _id: skillId
    }
  })
}

class DesktopPreferences extends Component {
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
    changeHappened: false,
    currentRoute: this.props.location.pathname
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

  // shouldComponentUpdate(nextProps) {
  //   if(nextProps.newRoute === null) {
  //     return false
  //   } else return false
  // }

  componentWillReceiveProps({ newRoute, ...props }) {
    if (newRoute !== null) {
      this.setState({ currentRoute: newRoute })
    }
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

  onSkillsSubmit = skills => {
    const newSkills = mapSkills(skills)
    const { neededWorkSkills } = this.state
    const changeHappened =
      newSkills.reduce((acc = [], curr) => {
        if (
          neededWorkSkills.findIndex(needed => needed._id === curr._id) === -1
        ) {
          return [...acc, curr]
        } else return [...acc]
      }, []).length > 0 || newSkills.length !== neededWorkSkills.length
    this.setState(
      {
        form: {
          selectedGrowthSkills: newSkills
        },
        changeHappened
      },
      this.updatePreferences
    )
  }

  updateFilters = (key, value) => {
    const oldValue = this.state[key]
    if (oldValue.indexOf(value) === -1) {
      const newValue = [...oldValue, value]
      this.setState(
        {
          [key]: newValue
        },
        this.filterDashboardContent
      )
    } else {
      this.setState(
        {
          [key]: oldValue.filter(filter => filter !== value)
        },
        this.filterDashboardContent
      )
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
        'fetchDevelopmentPlanRelatedContent',
        'searchLearningContent'
      ]
    })
  }

  handleSubmit = () => {
    const {
      form: { selectedGrowthSkills }
    } = this.state
    this.setState({
      neededWorkSkills: selectedGrowthSkills,
      selectingSkill: false,
      changeHappened: false
    })
  }

  updatePreferences = () => {
    const { changeHappened } = this.state
    if (!changeHappened) return
    this.form.current.validate(valid => {
      if (valid) {
        const {
          form: { selectedGrowthSkills }
        } = this.state
        const neededWorkSkills = removeTypename(selectedGrowthSkills)
        this.props.client
          .mutate({
            mutation: updateNeededSkills,
            refetchQueries: [
              'currentUserSkillsProfile',
              'fetchRelevantContentForUser',
              'fetchLearningPathsForDashboard',
              'fetchLikedContentForUser',
              'fetchRelevantUsersInOrganization',
              'fetchSharedInTeamContent',
              'fetchSharedByMeContent',
              'fetchUserUploadedContent',
              'fetchDevelopmentPlanRelatedContent',
              'searchLearningContent'
            ],
            variables: {
              neededWorkSkills
            },
            update: async (cache, { data: { updateNeededSkills: result } }) => {
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
            }
          })
          .then(res => {
            if (res.data && res.data.updateNeededSkills !== null) {
              Notification({
                type: 'success',
                message: 'Your changes have been submitted',
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
    })
  }

  render() {
    const { currentRoute } = this.state
    const { preferencesState } = this.props
    if (
      preferencesState.visible &&
      (currentRoute === '/' ||
        currentRoute === '/learning' ||
        currentRoute === '/learning-paths')
    ) {
      const {
        // skills,
        types: seeTypes,
        filters: seeFilters
      } = preferencesState
      const {
        form,
        rules,
        // selectingSkill,
        form: { selectedGrowthSkills },
        // cascaderOptions,
        // allSkills,
        contentTypes,
        selectedFilters,
        price,
        prices
      } = this.state
      const selectorProps = {
        buttonClass: 'learning-preferences__add-new',
        buttonValue: 'Change your skill preferences',
        skills: selectedGrowthSkills,
        onSkillsSubmit: this.onSkillsSubmit,
        preferences: true,
        customClassName: 'list-in-sidebar'
      }
      return (
        <div className='learning-preferences align-left'>
          <div className='learning-preferences--desktop'>
            <h5>Your learning preferences</h5>
            <Form
              ref={this.form}
              rules={rules}
              model={form}
              onSubmit={e => e.preventDefault()}
            >
              <h6>Skills you're interested in</h6>
              {selectedGrowthSkills.map(skill => (
                <Tag
                  key={skill._id}
                  type='pale-lilac'
                  // className="el-tag--pale-lilac-closable"
                >
                  {skill.name}
                </Tag>
              ))}
              <ListSkillSelector {...selectorProps} />
              {seeFilters && (
                <div>
                  {seeTypes && (
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
          </div>
          <style jsx>{learningPreferencesStyle}</style>
        </div>
      )
    } else {
      return null
    }
  }
}

const DesktopQueryWrapper = props => {
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
                  const mappedSkills = mapSkills(profile.neededWorkSkills)
                  const { preferencesState } = container

                  return (
                    <DesktopPreferences
                      {...props}
                      mappedSkills={mappedSkills}
                      selectedFilters={selectedFilters}
                      preferencesState={preferencesState}
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

export default withRouter(DesktopQueryWrapper)
