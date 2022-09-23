import React, { Component } from 'react'
import {
  List,
  // MultipleSkillsSelector,
  ListSkillSelector,
  StarBar
} from '../ui-components'
import { Mutation } from 'react-apollo'
import { Notification } from 'element-react'
import {
  profileSkillsChangeMutation,
  fetchUsersProfile,
  currentUserSkillsProfile
} from '../../api'
import { removeTypename } from './utilities'
import '../../styles/theme/notification.css'
import { captureFilteredError, SentryDispatch } from '../general'

export default class UserSkills extends Component {
  state = {
    skills: this.props.skills,
    canNotify: true
    // selectingSkill: false,
    // changeHappened: false
  }

  setSkillLevel = (name, level, mutation) => {
    const newSkills = this.state.skills.reduce((acc, curr) => {
      if (curr.name === name) {
        return [...acc, { ...curr, level: level }]
      } else {
        return [...acc, { ...curr }]
      }
    }, [])

    this.setState({ skills: newSkills }, () => this.handleSubmit(mutation))
  }

  // toggleSkillSelector = () => {
  //   const { selectingSkill } = this.state
  //   this.setState({ selectingSkill: !selectingSkill })
  // }

  handleSubmit = mutation => {
    const { skills } = this.state
    const finalSkills = skills.map(sk => ({
      _id: sk.skillId,
      name: sk.name,
      level: sk.level,
      category: sk.category,
      slug: sk.slug
    }))
    mutation({
      variables: {
        UserProfileSkillsChangeInput: {
          key: 'selectedWorkSkills',
          skills: removeTypename(finalSkills)
        }
      },
      update: async (
        cache,
        { data: { profileSkillsChangeMutation: result } }
      ) => {
        const { user: userId, selectedWorkSkills } = result

        try {
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
                  selectedWorkSkills
                }
              }
            }
          })
        } catch (err) {}

        try {
          const { currentUserSkillsProfile: profile } = await cache.readQuery({
            query: currentUserSkillsProfile
          })
          await cache.writeQuery({
            query: currentUserSkillsProfile,
            data: {
              currentUserSkillsProfile: {
                ...profile,
                selectedWorkSkills
              }
            }
          })
        } catch (err) {}
      }
    })
      .then(res => {
        if (this.state.canNotify) {
          if (res.data && res.data.profileSkillsChangeMutation !== null)
            Notification({
              type: 'success',
              message: 'Your changes have been submitted',
              duration: 2500,
              offset: 90
            })
          else
            Notification({
              type: 'warning',
              message: 'Oops something went wrong',
              duration: 2500,
              offset: 90
            })
          this.setState(
            {
              canNotify: false
            },
            () =>
              setTimeout(
                () =>
                  this.setState({
                    canNotify: true
                  }),
                3000
              )
          )
        }
      })
      .catch(e => {
        Notification({
          type: 'error',
          message: 'Oops something went wrong',
          duration: 2500,
          offset: 90,
          iconClass: 'el-icon-error'
        })
      })
  }

  setSkills = (newSkills, mutation) => {
    this.setState(
      ({ skills }) => ({
        skills: [...newSkills, ...skills]
      }),
      () => this.handleSubmit(mutation)
    )
  }

  removeSkill = (skillId, e, mutation) => {
    e.preventDefault()
    if (this.state.skills.length === 1) {
      Notification({
        type: 'warning',
        message: 'You must have at least one skill selected',
        duration: 2500,
        offset: 90
      })
      return
    }

    const newSelectedSkills = [...this.state.skills].reduce((acc, curr) => {
      if (curr.skillId === skillId) return [...acc]
      else return [...acc, { ...curr }]
    }, [])
    this.setState(
      {
        skills: newSelectedSkills
      },
      () => this.handleSubmit(mutation)
    )
  }

  render() {
    const { skills } = this.state
    // skills.sort((a, b) => b.level - a.level)
    return (
      <div className='tab-content'>
        <Mutation
          mutation={profileSkillsChangeMutation}
          refetchQueries={[
            // 'currentUserSkillsProfile',
            'fetchRelevantContentForUser',
            'fetchEvaluationInfo',
            'fetchLatestTeamEvaluation',
            'currentUserPreferredTypes',
            'fetchStatsOverviewData',
            'fetchStatsTeamsData',
            'fetchStatsGrowthData'
          ]}
        >
          {(profileSkillsChangeMutation, { error }) => {
            if (error) {
              captureFilteredError(error)
              return <SentryDispatch error={error} />
            }

            return (
              <List>
                {/* <div className='list-item__title list-item__title--user--skills align-left'>
                  Your skills
                </div> */}
                <ListSkillSelector
                  buttonValue='Add more skills...'
                  buttonClass='list-skill-selector__button-input'
                  skills={[]}
                  onSkillsSubmit={skills =>
                    this.setSkills(skills, profileSkillsChangeMutation)
                  }
                  filterSkills={skills}
                  clearState
                />
                <br />
                {skills.map(skill => (
                  <div key={skill._id} style={{ padding: '15px 0px' }}>
                    <StarBar
                      stroke='#fff'
                      name={skill.name}
                      subtitle={skill.category}
                      level={skill.level}
                      updateSkillLevels={(name, level) =>
                        this.setSkillLevel(
                          name,
                          level,
                          profileSkillsChangeMutation
                        )
                      }
                      dropdownOptions={[
                        {
                          value: 'Remove skill',
                          boundFunction: (skillId, e) =>
                            this.removeSkill(
                              skillId,
                              e,
                              profileSkillsChangeMutation
                            ),
                          id: skill.skillId
                        }
                      ]}
                      handleHover={(level, name) => {
                        if (skill.frameworkId) {
                          this.props.setFrameworkState({
                            visible: true,
                            frameworkId: skill.frameworkId,
                            level,
                            skillName: name
                          })
                        } else {
                          this.props.setFrameworkState({ visible: false })
                        }
                      }}
                      handleMouseOut={() =>
                        this.props.setFrameworkState({ visible: false })
                      }
                    />
                  </div>
                ))}
              </List>
            )
          }}
        </Mutation>
      </div>
    )
  }
}
