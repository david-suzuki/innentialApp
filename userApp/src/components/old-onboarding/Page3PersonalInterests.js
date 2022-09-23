import React, { Component } from 'react'
import { Button, Loading, Form } from 'element-react'
import {
  FormGroup,
  InterestsSelector,
  // MultipleSkillsSelector,
  ListSkillSelector,
  Page,
  OnboardingStatement
} from '../ui-components'
import { onboardingMutation } from '../../api'
import { Mutation } from 'react-apollo'
import { removeTypename } from './utilities'
import { captureFilteredError, LoadingSpinner } from '../general'
import history from '../../history'

export default props => {
  const {
    onboardingSkills,
    onboardingFunctions: {
      removeSkill,
      onSkillsSubmit,
      onInterestChange,
      onInterestRemove
    }
  } = props.container.useContainer()

  const {
    form: { selectedInterests, neededWorkSkills }
  } = onboardingSkills

  return (
    <Ptsd
      {...props}
      finalForm={onboardingSkills.form}
      selectorProps={{
        skills: neededWorkSkills,
        buttonValue: 'Find skills...',
        buttonClass: 'list-skill-selector__button-input',
        onSkillsSubmit: skills => onSkillsSubmit(skills, 'neededWorkSkills'),
        onSkillRemove: removeSkill,
        formKey: 'neededWorkSkills',
        item: 'selectedSkillsLength'
        // clearState: true
      }}
      interestSelectorProps={{
        onInterestChange: onInterestChange,
        onInterestRemove: onInterestRemove,
        selectedInterests
      }}
    />
  )
}
class Ptsd extends Component {
  state = {
    selectedSkillsLength: this.props.selectorProps.skills.length,
    selectedInterestsLength: this.props.interestSelectorProps.selectedInterests
      .length
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedSkillsLength: nextProps.selectorProps.skills.length,
      selectedInterestsLength:
        nextProps.interestSelectorProps.selectedInterests.length
    })
  }

  myRef = React.createRef()

  formRules = {
    selectedSkillsLength: [
      { type: 'number', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value === 0) {
            callback(new Error('You must select at least one skill'))
          } else if (value > 3) {
            callback(new Error('Please select up to 3 skills'))
          } else {
            callback()
          }
        }
      }
    ]
  }

  render() {
    const { finalForm, uuid } = this.props
    return (
      <Page>
        <div style={{ minHeight: '50vh' }}>
          <OnboardingStatement
            content={`
              Based on the information provided here
              we will personalise your future content recommendations
            `}
          />
          <Form
            ref={this.myRef}
            model={this.state}
            rules={this.formRules}
            onSubmit={e => e.preventDefault()}
          >
            <FormGroup mainLabel='Select up to 3 skills you want to learn'>
              {/* <MultipleSkillsSelector
                  {...this.props.selectorProps}
                  displayChildren
                  neededSkillsSelector
                  placeholder="Select skills"
                /> */}
              <Form.Item prop='selectedSkillsLength'>
                <ListSkillSelector {...this.props.selectorProps} />
                <div style={{ marginTop: 25 }}>
                  {this.props.selectorProps.skills.map(s => (
                    <Button
                      key={s._id}
                      type='primary'
                      style={{ margin: '4px 10px 4px 0' }}
                      className='el-button--cascader'
                      onClick={e =>
                        this.props.selectorProps.onSkillRemove(
                          e,
                          s._id,
                          this.props.selectorProps.formKey
                        )
                      }
                    >
                      {s.name} <i className='icon icon-e-remove' />
                    </Button>
                  ))}
                </div>
              </Form.Item>
            </FormGroup>
            <FormGroup mainLabel='What are your interests (Not mandatory)'>
              <Form.Item prop='selectedInterestsLength'>
                <InterestsSelector
                  {...this.props.interestSelectorProps}
                  placeholder='Select interests'
                />
              </Form.Item>
            </FormGroup>
          </Form>
        </div>
        <div className='bottom-nav'>
          <div className='bottom-nav__previous'>
            {!this.props.cantGoBack && (
              <a
                onClick={() =>
                  history.push(
                    '/onboarding/my-skill-levels',
                    this.props.routeState
                  )
                }
              >
                <i className='icon icon-tail-left' />
                <span>Previous step</span>
              </a>
            )}
          </div>
          <Mutation
            mutation={onboardingMutation}
            refetchQueries={[
              'currentUserSkillsProfile',
              'currentUser',
              'currentUserProfile'
            ]}
          >
            {(onboardingMutation, { loading, error }) => {
              if (loading) return <LoadingSpinner />
              if (error) return 'Oops something went wrong'
              return (
                <Button
                  type='primary'
                  onClick={e => {
                    e.preventDefault()
                    this.myRef.current.validate(valid => {
                      if (valid) {
                        const finalSelectedSkills = finalForm.selectedWorkSkills.map(
                          sk => ({
                            _id: sk.skillId || sk._id,
                            name: sk.name,
                            level: sk.level,
                            category: sk.category,
                            slug: sk.slug
                          })
                        )
                        const finalNeededSkills = finalForm.neededWorkSkills.map(
                          sk => ({
                            _id: sk.skillId || sk._id,
                            name: sk.name,
                            level: sk.level,
                            category: sk.category,
                            slug: sk.slug
                          })
                        )
                        const formFinal = {
                          ...finalForm,
                          selectedWorkSkills: removeTypename(
                            finalSelectedSkills
                          ),
                          neededWorkSkills: removeTypename(finalNeededSkills),
                          selectedInterests: removeTypename(
                            finalForm.selectedInterests
                          )
                        }
                        const data = { ...formFinal, user: uuid }
                        onboardingMutation({
                          variables: { UserProfileInput: data }
                        })
                          .then(() => {
                            history.replace(
                              '/onboarding/congratulations',
                              this.props.routeState
                            )
                          })
                          .catch(e => {
                            captureFilteredError(e)
                          })
                      }
                    })
                  }}
                >
                  <i className='icon icon-tail-right' />
                </Button>
              )
            }}
          </Mutation>
        </div>
      </Page>
    )
  }
}

// export const Page3PersonalInterests = (props) => {
//   const {
//     onboardingSkills,
//     onboardingFunctions: {
//       setFocusedFramework,
//       onChangeInput,
//       onSkillsChange,
//       removeSkill,
//       setSkillLevel,
//       onInterestChange,
//       onInterestRemove
//     } } = Container.useContainer()

//   const {
//     form: {
//       selectedInterests,
//       neededWorkSkills
//     }
//   } = onboardingSkills
//   const finalForm = onboardingSkills
//   const selectorProps ={
//     skills: neededWorkSkills,
//     onSkillAdd: onSkillsChange,
//     onSkillRemove: removeSkill,
//     onboarding: true,
//     formKey: 'neededWorkSkills',
//     item: 'selectedSkillsLength'
//   }
//   const interestSelectorProps={
//     onInterestChange: onInterestChange,
//     onInterestRemove: onInterestRemove,
//     selectedInterests
//   }
//   const selectedSkillsLength = selectorProps.skills.length
//   const selectedInterestsLength = interestSelectorProps.selectedInterests.length
//   const isValid = selectedSkillsLength > 0 && selectedInterestsLength > 0

//   return (
//     <Page>
//       <div style={{ minHeight: '50vh' }}>
//         <h3>
//           Based on the choices below we will select tailored learning actions
//           just for you
//         </h3>{' '}
//         <br />
//         <FormGroup mainLabel="Select skills you would like to learn">
//           <ListSkillSelector {...selectorProps} />
//         </FormGroup>
//         <FormGroup mainLabel="What are your other interests">
//           <InterestsSelector {...interestSelectorProps} />
//         </FormGroup>
//       </div>
//       <div className="bottom-nav">
//         <div className="bottom-nav__previous">
//           <a onClick={() => informParent(-1)}>
//             <i className="icon icon-tail-left" />
//             <span>Previous step</span>
//           </a>
//         </div>
//         <Mutation
//           mutation={onboardingMutation}
//           refetchQueries={['currentUserSkillsProfile', 'currentUser']}
//         >
//           {(onboardingMutation, { loading, error }) => {
//             if (loading) return <LoadingSpinner />
//             if (error) return 'Oops something went wrong'
//             return (
//               <Button
//                 type="primary"
//                 className={isValid ? '' : 'is-disabled'}
//                 onClick={e => {
//                   e.preventDefault()
//                   const formFinal = {
//                     ...finalForm,
//                     selectedWorkSkills: removeTypename(
//                       finalForm.selectedWorkSkills
//                     ),
//                     neededWorkSkills: removeTypename(
//                       finalForm.neededWorkSkills
//                     ),
//                     selectedInterests: removeTypename(
//                       finalForm.selectedInterests
//                     )
//                   }
//                   const data = { ...formFinal, user: uuid }
//                   isValid &&
//                     onboardingMutation({
//                       variables: { UserProfileInput: data }
//                     }).then(() => informParent(1))
//                 }}
//               >
//                 <i className="icon icon-tail-right" />
//               </Button>
//             )
//           }}
//         </Mutation>
//       </div>
//     </Page>
//   )
// }
