import React, { Component } from 'react'
import { Form, Input, Button, Notification } from 'element-react'
import {
  FormGroup,
  RoleSelector,
  ListSkillSelector,
  UserSetLocation
} from '../ui-components'
import { captureFilteredError } from '../general'
import { useMutation } from 'react-apollo'
import { editDisabledProfile } from '../../api'
// import Container from '../../globalState'
import defaultValues from './constants/_defaultFormValues'
import { removeDuplicates } from '../../utils'
import ApolloCacheUpdater from 'apollo-cache-updater'

class ProfileForm extends Component {
  constructor(props) {
    super(props)

    const {
      initialData: { skills, ...rest }
    } = props

    this.state = {
      form: {
        ...defaultValues,
        ...rest,
        skills: skills.map(({ _id, skillId, ...skill }) => ({
          _id: skillId || _id,
          ...skill
        }))
      }
    }
  }

  formRef = React.createRef()

  handleChange = (key, value) => {
    this.setState(({ form }) => ({ form: { ...form, [key]: value } }))
  }

  handleRoleChange = value => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        roleAtWork: value,
        roleId: null
      }
      // changeHappened: this.props.roleAtWork !== value
    })
  }

  handleRoleSelect = ({ _id, title, coreSkills }) => {
    const { form } = this.state
    const allSkills = [
      ...form.skills,
      ...coreSkills
    ].map(({ skillId, _id, ...skill }) => ({ ...skill, _id: skillId || _id }))

    // console.log({ allSkills })

    const skills = removeDuplicates(allSkills, '_id')
    this.setState({
      form: {
        ...form,
        roleAtWork: title,
        roleId: _id,
        skills
      }
      // changeHappened: this.props.roleAtWork !== title
    })
  }

  handleRoleSuggest = (title, mutation) => {
    mutation({
      variables: {
        title
      }
    })
      .then(({ data: { addRoleSuggestion: result } }) => {
        if (result !== null) {
          this.setState(({ form }) => ({
            form: {
              ...form,
              roleId: result._id
            }
          }))
          Notification({
            type: 'success',
            message: 'Your suggestion has been added',
            duration: 2500,
            offset: 90
          })
        }
      })
      .catch(err => {
        captureFilteredError(err)
        Notification({
          type: 'warning',
          message: 'Oops! Something went wrong',
          duration: 2500,
          offset: 90
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

  handleSkillRemove = skillId => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        skills: form.skills.reduce((acc, curr) => {
          if (curr.skillId === skillId || curr._id === skillId) return [...acc]
          else return [...acc, { ...curr }]
        }, [])
      }
    }))
  }

  render() {
    const {
      form: {
        firstName,
        lastName,
        // location,
        roleAtWork,
        // roleId,
        skills
      }
    } = this.state
    const { currentUser, onSubmit } = this.props

    const selectorProps = {
      skills,
      clearState: true,
      buttonValue: 'Find skills...',
      buttonClass: 'list-skill-selector__button-input',
      onSkillsSubmit: value => this.handleChange('skills', value)
    }

    return (
      <>
        <Form
          ref={this.formRef}
          model={this.state.form}
          onSubmit={e => e.preventDefault()}
        >
          <FormGroup>
            <span className='double-input'>
              <Form.Item label='First Name' prop='firstName'>
                <Input
                  type='text'
                  value={firstName}
                  onChange={val => this.handleChange('firstName', val)}
                  trim
                />
              </Form.Item>
              <Form.Item label='Last Name' prop='lastName'>
                <Input
                  type='text'
                  value={lastName}
                  onChange={val => this.handleChange('lastName', val)}
                  trim
                />
              </Form.Item>
            </span>
            {/* <UserSetLocation selected={location} /> */}
            <Form.Item
              label='Position'
              prop='roleAtWork'
              style={{ marginTop: '20px' }}
            >
              <RoleSelector
                placeholder='Start typing to view suggestions'
                value={roleAtWork}
                handleRoleChange={value => this.handleRoleChange(value)}
                handleRoleSelect={role => this.handleRoleSelect(role)}
                handleRoleSuggest={(title, mutation) =>
                  this.handleRoleSuggest(title, mutation)
                }
                currentUserId={currentUser._id}
              />
            </Form.Item>
            <Form.Item
              label='Employee skills'
              prop='skills'
              style={{ marginTop: '20px' }}
            >
              <ListSkillSelector {...selectorProps} />
              <div style={{ marginTop: 25 }}>
                {skills.map(s => (
                  <Button
                    key={s._id}
                    type='primary'
                    style={{ margin: '4px 10px 4px 0' }}
                    className='el-button--cascader'
                    onClick={() => this.handleSkillRemove(s.skillId || s._id)}
                  >
                    {s.name} <i className='icon icon-e-remove' />
                  </Button>
                ))}
              </div>
            </Form.Item>
          </FormGroup>
        </Form>
        <div className='page-footer'>
          <Button
            onClick={() => onSubmit(this.state.form)}
            className='el-button--green'
            size='large'
          >
            Save
          </Button>
        </div>
      </>
    )
  }
}

export default ({ initialData, user, history, currentUser }) => {
  const [mutate] = useMutation(editDisabledProfile)

  const onSubmit = form => {
    const { skills, ...rest } = form
    const inputData = {
      ...rest,
      user,
      selectedWorkSkills: skills.map(
        ({ category, level, name, slug, _id }) => ({
          category,
          level,
          name,
          slug,
          _id
        })
      )
    }

    mutate({
      variables: {
        inputData
      }
    })
      .then(() => {
        history.goBack()
        Notification({
          type: 'success',
          message: 'Successfully updated profile',
          duration: 2500,
          offset: 90
        })
      })
      .catch(err => {
        captureFilteredError(err)
        Notification({
          type: 'warning',
          message: 'Oops! Something went wrong',
          duration: 2500,
          offset: 90
        })
      })
  }

  return (
    <>
      <div className='page-heading__header'>
        <i
          className='page-heading__back__button icon icon-small-right icon-rotate-180'
          onClick={history.goBack}
        />
        <div className='page-heading__header-info'>
          <h1>Edit user profile</h1>
        </div>
      </div>
      <ProfileForm
        currentUser={currentUser}
        history={history}
        initialData={initialData}
        user={user}
        onSubmit={onSubmit}
      />
    </>
  )
}
