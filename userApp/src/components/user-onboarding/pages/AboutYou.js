import React, { /* Component, */ useRef } from 'react'
import { Button, Form, Input } from 'element-react'
import {
  FormGroup,
  // LinesOfWorkSelector,
  // MultipleSkillsSelector,
  // ListSkillSelector,
  Page,
  // UserSetLocation,
  RoleSelector
} from '../../ui-components'
import history from '../../../history'
import { useMutation } from 'react-apollo'
import {
  onboardUserPersonalInfo,
} from '../../../api'
import { captureFilteredError } from '../../general'
import { NextButton } from './components'

// export default props => {
//   const {
//     onboardingSkills,
//     onboardingFunctions: {
//       onChangeInput,
//       handleSuggestRole,
//       removeSkill,
//       onSkillsSubmit
//     }
//   } = props.container.useContainer()

//   const {
//     form: { roleAtWork, selectedWorkSkills }
//   } = onboardingSkills

//   return (
//     <Page1WorkInfo
//       {...props}
//       roleProps={{
//         value: roleAtWork,
//         onChange: onChangeInput,
//         handleSuggestRole
//       }}
//       selectorProps={{
//         skills: selectedWorkSkills,
//         // clearState: true,
//         onSkillRemove: removeSkill,
//         buttonValue: 'Find skills...',
//         buttonClass: 'list-skill-selector__button-input',
//         onSkillsSubmit: skills => onSkillsSubmit(skills, 'selectedWorkSkills'),
//         formKey: 'selectedWorkSkills',
//         item: 'selectedSkillsLength'
//       }}
//     />
//   )
// }

const AboutYou = ({
  routeState,
  // firstName: initialName,
  // lastName: initialSurname,
  // roleId: initialId = null,
  // roleAtWork: initialTitle = '',
  container,
  technicianOnboarding,
  hasAssignedPath,
  organizationName
  // setShowSkillPage,
  // skip
}) => {
  // const [firstName, setFirstName] = useState(initialName)
  // const [lastName, setLastName] = useState(initialSurname)
  // const [roleAtWork, setRoleAtWork] = useState({ _id: initialId, title: initialTitle })

  const {
    onboardingState: { firstName, lastName, roleAtWork /*, technician */ },
    onboardingFunctions: { handleOnboardingChange, onSkillsSubmit }
  } = container.useContainer()

  const form = useRef()

  const { title } = roleAtWork

  const [mutate, { loading }] = useMutation(onboardUserPersonalInfo)

  const formRules = {
    firstName: {
      required: true,
      message: 'Required',
      trigger: 'blur'
    },
    lastName: {
      required: true,
      message: 'Required',
      trigger: 'blur'
    },
    roleAtWork: {
      type: 'object',
      validator: (rule, value, callback) => {
        if (value.title !== '' || technicianOnboarding) {
          callback()
        } else callback(new Error('Required'))
        // else if (technicianOnboarding === null) {
        //   callback(new Error('Required'))
        // } else if (technicianOnboarding === false && value.title === '') {
        //   callback(new Error('Required'))
        // } else callback()
      },
      trigger: 'submit'
      // fields: {
      //   title: {
      //     required: true,
      //     message: 'Required',
      //     trigger: 'submit'
      //   }
      // }
    }
  }

  return (
    <Page>
      <div className='page-content-align'>
        <h2 style={{ paddingLeft: '0' }}>A bit about you</h2>
        <div style={{ minHeight: '50vh', minWidth: '300px' }}>
          <Form
            model={{
              firstName,
              lastName,
              roleAtWork
            }}
            ref={form}
            rules={formRules}
          >
            <FormGroup mainLabel="Let's get to know each other!">
              <div className='onboarding__form-item'>
                <Form.Item label='First Name' prop='firstName'>
                  <div className='onboarding__input'>
                    <Input
                      type='text'
                      value={firstName}
                      onChange={val => handleOnboardingChange(val, 'firstName')}
                      trim
                    />
                  </div>
                </Form.Item>
              </div>

              <div className='onboarding__form-item'>
                <Form.Item label='Last Name' prop='lastName'>
                  <div className='onboarding__input'>
                    <Input
                      type='text'
                      value={lastName}
                      onChange={val => handleOnboardingChange(val, 'lastName')}
                      trim
                    />
                  </div>
                </Form.Item>
              </div>

              {!technicianOnboarding && (
                <div className='onboarding__form-item'>
                  <Form.Item prop='roleAtWork' label='Organization role'>
                    {/* CODE BELOW IS FOR SMA - REMOVED AS OF 31.08.21 */}
                    {/* {technicianOnboarding && (
                    <span>
                      <Button
                        className={`el-button-technician ${
                          technician === true
                            ? 'el-button-technician--active'
                            : ''
                        }`}
                        onClick={() =>
                          handleOnboardingChange(true, 'technician')
                        }
                      >
                        Service Technician
                      </Button>
                      <Button
                        className={`el-button-technician ${
                          technician === false
                            ? 'el-button-technician--active'
                            : ''
                        }`}
                        onClick={() =>
                          handleOnboardingChange(false, 'technician')
                        }
                      >
                        {organizationName} Employee
                      </Button>
                    </span>
                  )} */}
                    {/* {(!technicianOnboarding || technician === false) && ( */}
                    <div className='onboarding__input'>
                      <RoleSelector
                        value={title}
                        handleRoleSelect={({ _id, title }) =>
                          handleOnboardingChange({ _id, title }, 'roleAtWork')
                        }
                        handleRoleChange={value =>
                          handleOnboardingChange(
                            { _id: null, title: value },
                            'roleAtWork'
                          )
                        }
                        placeholder={`What's your role?`}
                        canSuggest={false}
                        // handleRoleSuggest={title => {
                        //   this.props.roleProps.handleSuggestRole(title)
                        // }}
                      />
                    </div>
                    {/* )} */}
                  </Form.Item>
                </div>
              )}

              {/* <div
                className='onboarding__signup-button'
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                  paddingTop: '32px'
                }}
              >
                <Button
                  type='primary'
                  loading={loading}
                  onClick={() => {
                    form.current.validate(valid => {
                      if (valid) {
                        const inputData = {
                          firstName,
                          lastName,
                          roleAtWork: roleAtWork.title,
                          roleId: roleAtWork._id
                        }
                        mutate({
                          variables: {
                            inputData
                          }
                        })
                          .then(
                            ({ data: { onboardUserPersonalInfo: skills } }) => {
                              const newState = {
                                ...routeState,
                                user: {
                                  ...routeState.user,
                                  ...inputData
                                }
                              }
                              if (Array.isArray(skills)) {
                                if (skills.length > 0) {
                                  onSkillsSubmit(skills, 'selectedWorkSkills')
                                  setShowSkillPage(true)
                                  history.replace(
                                    '/onboarding/my-skill-levels',
                                    newState
                                  )
                                } else {
                                  history.replace(
                                    '/onboarding/skill-preferences',
                                    newState
                                  )
                                }
                              }
                            }
                          )
                          .catch(err => {
                            captureFilteredError(err)
                            history.push('/error-page/500')
                          })
                      }
                    })
                  }}
                >
                  {!loading && <NextButton />}
                </Button>
              </div> */}
            </FormGroup>
            {/* <UserSetLocation selected={{}} onboarding /> */}
            {/* <FormGroup mainLabel="Select minimum 5 most important skills that you have"> */}
            {/* <Form.Item prop="selectedSkillsLength">
              <ListSkillSelector {...this.props.selectorProps} />
              <div style={{ marginTop: 25 }}>
                {this.props.selectorProps.skills.map(s => (
                  <Button
                    key={s._id}
                    type="primary"
                    style={{ margin: '4px 10px 4px 0' }}
                    className="el-button--cascader"
                    onClick={e =>
                      this.props.selectorProps.onSkillRemove(
                        e,
                        s._id,
                        this.props.selectorProps.formKey
                      )
                    }
                  >
                    {s.name} <i className="icon icon-e-remove" />
                  </Button>
                ))}
              </div>
            </Form.Item> */}
            {/* </FormGroup> */}
          </Form>
        </div>
      </div>

      <div className='bottom-nav-contained'>
        <div />
        <Button
          type='primary'
          loading={loading}
          onClick={() => {
            form.current.validate(valid => {
              if (valid) {
                const inputData = {
                  firstName,
                  lastName,
                  roleAtWork: technicianOnboarding
                    ? 'Technician'
                    : roleAtWork.title,
                  roleId: roleAtWork._id,
                  technician: technicianOnboarding
                }
                mutate({
                  variables: {
                    inputData
                  }
                })
                  .then(
                    (/* { data: { onboardUserPersonalInfo: skills } } */) => {
                      if (technicianOnboarding) {
                        window.Intercom('update', { Technician: true })
                        history.replace('/onboarding/almost-done', routeState)
                      } else if (hasAssignedPath) {
                        history.replace(
                          '/onboarding/assigned-paths',
                          routeState
                        )
                      } else {
                        const newState = {
                          ...routeState,
                          user: {
                            ...routeState.user,
                            ...inputData
                          }
                        }
                        history.replace('/onboarding/how-to', newState)
                      }
                      // if (skip) {
                      //   history.replace('/onboarding/almost-done', newState)
                      // } else if (Array.isArray(skills)) {
                      //   if (skills.length > 0) {
                      //     onSkillsSubmit(skills, 'selectedWorkSkills')
                      //     setShowSkillPage(true)
                      //     history.replace('/onboarding/my-skill-levels', newState)
                      //   } else {
                      //     history.replace('/onboarding/how-to', newState)
                      //   }
                      // }
                    }
                  )
                  .catch(err => {
                    captureFilteredError(err)
                    history.push('/error-page/500')
                  })
              }
            })
          }}
        >
          {!loading && (
            <NextButton
              label={technicianOnboarding ? 'Finish setup' : undefined}
            />
          )}
        </Button>
      </div>
    </Page>
  )
}

export default AboutYou
