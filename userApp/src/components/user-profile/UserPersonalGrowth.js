import React, { Component } from 'react'
import { Form, Notification } from 'element-react'
import {
  FormGroup,
  InterestsSelector,
  // MultipleSkillsSelector,
  ListSkillSelector,
  SelectedSkills
} from '../ui-components'
import { Mutation } from 'react-apollo'
import { profileGrowthChangeMutation, fetchUsersProfile } from '../../api'
import { removeTypename } from './utilities'
import '../../styles/theme/notification.css'
import { captureFilteredError, SentryDispatch } from '../general'
import { growthRules } from './constants/_formRules'

export default class UserPersonalGrowth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        neededWorkSkills: this.props.neededWorkSkills.map(sk => ({
          _id: sk.skillId,
          level: sk.level,
          category: sk.category,
          slug: sk.slug,
          name: sk.name
        })),
        selectedInterests: this.props.selectedInterests
      },
      canNotify: true
      // changeHappened: false
    }
  }

  myRef = React.createRef()

  // onFormChanged = val => {
  //   this.setState({
  //     changeHappened: val
  //   })
  // }

  handleSubmit = mutation => {
    this.myRef.current.validate(async valid => {
      if (valid) {
        const { neededWorkSkills, selectedInterests } = this.state.form
        const finalSkills = neededWorkSkills.map(sk => ({
          _id: sk.skillId || sk._id,
          name: sk.name,
          level: sk.level,
          category: sk.category,
          slug: sk.slug
        }))
        mutation({
          variables: {
            UserProfileGrowthChangeInput: {
              selectedInterests: removeTypename(selectedInterests),
              neededWorkSkills: removeTypename(finalSkills)
            }
          },
          update: async (
            cache,
            { data: { profileGrowthChangeMutation: result } }
          ) => {
            try {
              const {
                user: userId,
                neededWorkSkills,
                selectedInterests
              } = result
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
                      neededWorkSkills,
                      selectedInterests
                    }
                  }
                }
              })
            } catch (err) {}
          }
        })
          .then(() => {
            if (this.state.canNotify) {
              this.setState(
                {
                  canNotify: false
                },
                () => {
                  setTimeout(
                    () =>
                      this.setState({
                        canNotify: true
                      }),
                    3000
                  )
                }
              )
              Notification({
                type: 'success',
                message: 'Your changes have been submitted',
                duration: 2500,
                offset: 90
              })
            }
          })
          .catch(() => {
            Notification({
              type: 'warning',
              message: 'Oops! Something went wrong.',
              duration: 2500,
              offset: 90
            })
          })
      }
    })
  }

  onSkillsSubmit = (skills, mutation) => {
    this.setState(
      ({ form }) => ({
        form: {
          ...form,
          neededWorkSkills: skills
        }
      }),
      () => this.handleSubmit(mutation)
    )
  }

  // onSkillsChange = (value, relatedSkill, formKey, mutation) => {
  //   const { neededWorkSkills } = this.state.form
  //   const newSelectedSkills = [...neededWorkSkills]
  //   if (
  //     newSelectedSkills.length &&
  //     !newSelectedSkills.find(item => item._id === value[1])
  //   ) {
  //     newSelectedSkills.push({ ...relatedSkill, level: 0 })
  //   } else if (!newSelectedSkills.length) {
  //     newSelectedSkills.push({ ...relatedSkill, level: 0 })
  //   }

  //   this.setState(
  //     ({ form }) => ({
  //       form: {
  //         ...form,
  //         neededWorkSkills: newSelectedSkills
  //       }
  //     }),
  //     () => this.handleSubmit(mutation)
  //   )
  // }

  onSkillRemove = (skill, e, mutation) => {
    const skillId = skill.skillId || skill._id
    e.preventDefault()
    const { neededWorkSkills } = this.state.form
    const newSelectedSkills = neededWorkSkills.reduce((acc, curr) => {
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

    this.setState(
      ({ form }) => ({
        form: {
          ...form,
          neededWorkSkills: newSelectedSkills
        }
      }),
      () => this.handleSubmit(mutation)
    )
  }

  onInterestChange = (value, relatedInterest, mutation) => {
    const newSelectedInterests = [...this.state.form.selectedInterests]
    if (
      newSelectedInterests.length &&
      !newSelectedInterests.find(item => item._id === value)
    ) {
      newSelectedInterests.push(relatedInterest)
    } else if (!newSelectedInterests.length) {
      newSelectedInterests.push(relatedInterest)
    }

    this.setState(
      ({ form }) => ({
        form: {
          ...form,
          selectedInterests: newSelectedInterests
        }
      }),
      () => this.handleSubmit(mutation)
    )
  }

  onInterestRemove = (e, interestId, mutation) => {
    e.preventDefault()
    const newSelectedInterests = this.state.form.selectedInterests.reduce(
      (acc, curr) => {
        if (curr._id === interestId) return [...acc]
        else {
          return [
            ...acc,
            {
              ...curr
            }
          ]
        }
      },
      []
    )

    this.setState(
      ({ form }) => ({
        form: {
          ...form,
          selectedInterests: newSelectedInterests
        }
      }),
      () => this.handleSubmit(mutation)
    )
  }

  render() {
    const { neededWorkSkills, selectedInterests } = this.state.form
    return (
      <Mutation
        mutation={profileGrowthChangeMutation}
        refetchQueries={[
          'currentUserSkillsProfile',
          'fetchRelevantContentForUser',
          'currentUserPreferredTypes',
          'fetchStatsGrowthData'
        ]}
      >
        {(mutation, { error }) => {
          if (error) {
            captureFilteredError(error)
            return <SentryDispatch error={error} />
          }
          return (
            <Form
              ref={this.myRef}
              model={this.state.form}
              rules={growthRules}
              onSubmit={e => e.preventDefault()}
            >
              <FormGroup mainLabel="Choose up to 3 skills you'd like to learn">
                <Form.Item prop='neededWorkSkills'>
                  <ListSkillSelector
                    skills={neededWorkSkills}
                    onSkillsSubmit={skills =>
                      this.onSkillsSubmit(skills, mutation)
                    }
                    onSkillRemove={(skill, e) =>
                      this.onSkillRemove(skill, e, mutation)
                    }
                    buttonValue='Find skills...'
                    buttonClass='list-skill-selector__button-input'
                    clearState
                  />
                  {neededWorkSkills.length > 0 && (
                    <>
                      <br />
                      <h4 className='align-left'>Selected skills</h4>
                      <SelectedSkills
                        skills={neededWorkSkills}
                        onSkillRemove={(skill, e) =>
                          this.onSkillRemove(skill, e, mutation)
                        }
                      />
                    </>
                  )}
                </Form.Item>
                {/* <ListSkillSelector
                  skills={neededWorkSkills}
                  onSkillAdd={(value, relatedSkill, formKey) =>
                    this.onSkillsChange(value, relatedSkill, formKey, mutation)
                  }
                  onSkillRemove={(e, skillId, formKey) =>
                    this.onSkillRemove(e, skillId, formKey, mutation)
                  }
                  neededSkillsSelector
                  formKey="neededWorkSkills"
                /> */}
              </FormGroup>
              <FormGroup mainLabel='What are your interests'>
                <Form.Item prop='selectedInterests'>
                  <InterestsSelector
                    onInterestChange={(value, relatedInterest) =>
                      this.onInterestChange(value, relatedInterest, mutation)
                    }
                    onInterestRemove={(e, interestId) =>
                      this.onInterestRemove(e, interestId, mutation)
                    }
                    selectedInterests={selectedInterests}
                    placeholder='Select interests'
                  />
                </Form.Item>
              </FormGroup>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

// class UserPersonalGrowthForm extends Component {
//   state = {
//     selectedSkillsLength: this.props.selectorProps.skills.length,
//     selectedInterestsLength: this.props.interestSelectorProps.selectedInterests
//       .length
//   }

//   componentWillReceiveProps(nextProps) {
//     this.setState({
//       selectedSkillsLength: nextProps.selectorProps.skills.length,
//       selectedInterestsLength:
//         nextProps.interestSelectorProps.selectedInterests.length
//     })
//   }

//   // componentWillUpdate() {
//   //   this.myRef.current.validate(() => { console.log(' VALIDATED? ')})
//   // }

//   render() {
//     return (

//       /* <div className="bottom-nav">
//         {this.props.changeHappened && this.state.selectedSkillsLength < 4 && (
//           <Mutation
//             mutation={profileGrowthChangeMutation}
//             refetchQueries={[
//               'currentUserSkillsProfile',
//               'fetchRelevantContentForUser',
//               'currentUserPreferredTypes',
//               'fetchStatsGrowthData'
//             ]}
//             onCompleted={() => this.props.onFormChanged(false)}
//           >
//             {(profileGrowthChangeMutation, { loading, error }) => {
//               if (loading) return <LoadingSpinner />
//               if (error) {
//                 captureFilteredError(error)
//                 return null
//               }
//               return (
//                 <Button
//                   nativeType="submit"
//                   type="primary"
//                   onClick={e => {
//                     e.preventDefault()
//                     this.myRef.current.validate(valid => {
//                       if (valid) {
//                         const selectedInterests = this.props
//                           .interestSelectorProps.selectedInterests
//                         const neededWorkSkills = this.props.selectorProps
//                           .skills
//                         profileGrowthChangeMutation({
//                           variables: {
//                             UserProfileGrowthChangeInput: {
//                               selectedInterests: removeTypename(
//                                 selectedInterests
//                               ),
//                               neededWorkSkills: removeTypename(
//                                 neededWorkSkills
//                               )
//                             }
//                           }
//                         })
//                           .then(res => {
//                             if (
//                               res.data &&
//                               res.data.profileGrowthChangeMutation ===
//                                 'Success'
//                             )
//                               Notification({
//                                 type: 'success',
//                                 message: 'Your changes have been submitted',
//                                 duration: 1500,
//                                 offset: 90
//                               })
//                             else
//                               Notification({
//                                 type: 'warning',
//                                 message: 'Oops something went wrong',
//                                 duration: 2500,
//                                 offset: 90
//                               })
//                           })
//                           .catch(e => {
//                             Notification({
//                               type: 'error',
//                               message: 'Oops something went wrong',
//                               duration: 2500,
//                               offset: 90,
//                               iconClass: 'el-icon-error'
//                             })
//                           })
//                       }
//                     })
//                   }}
//                 >
//                   Submit Changes
//                 </Button>
//               )
//             }}
//           </Mutation>
//         )}
//       </div> */
//     )
//   }
// }
