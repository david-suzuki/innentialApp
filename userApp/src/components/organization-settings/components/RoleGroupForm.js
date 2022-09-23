import React from 'react'
import SingleRoleForm from './SingleRoleForm'
import { Notification, Input } from 'element-react'
import formDefaults from '../constants/_roleFormDefaults'
import roleFormStyle from '../../../styles/roleFormStyle'
import SubmitButton from './SubmitButton'
import { captureFilteredError } from '../../general'
import { Prompt } from 'react-router-dom'
import { FormGroup } from '../../ui-components'

class RoleGroupForm extends React.Component {
  constructor(props) {
    super(props)

    const {
      initialData: { _id, groupName, relatedRoles: roles }
    } = props

    this.state = {
      _id,
      groupName,
      roles,
      activeRole: null,
      changeHappened: false,
      submitted: false
    }
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value, changeHappened: true })
  }

  handleEdittingRole = ix => {
    this.setState({ activeRole: ix })
  }

  handleRoleDeletion = ix => {
    this.setState(({ roles }) => {
      roles.splice(ix, 1)
      return {
        roles,
        changeHappened:
          roles.length !== this.props.initialData.relatedRoles.length
      }
    })
  }

  handleRoleChange = (role, ix) => {
    this.setState(({ roles }) => {
      roles.splice(ix, 1, role)
      return {
        roles,
        activeRole: null,
        changeHappened: true
      }
    })
  }

  handleRoleSwap = (ix, dir) => {
    const role = this.state.roles[ix]
    this.setState(({ roles }) => {
      roles.splice(ix, 1)
      roles.splice(ix + dir, 0, role)
      return {
        roles,
        changeHappened: true
      }
    })
  }

  validate = () => {
    const { roles, groupName } = this.state
    if (groupName.length === 0) {
      Notification({
        type: 'info',
        message: 'Please provide the group name',
        duration: 2500,
        iconClass: 'el-icon-info',
        offset: 90
      })
      return false
    }
    if (roles.length === 0) {
      Notification({
        type: 'info',
        message: `You haven't added any roles`,
        duration: 2500,
        iconClass: 'el-icon-info',
        offset: 90
      })
      return false
    }
    return true
  }

  handleSubmit = (mutation, form = [], mutationName) => {
    const isValid = this.validate()
    if (isValid) {
      const { _id, groupName } = this.state
      const inputData = {
        _id,
        groupName,
        relatedRoles: form.map(
          ({ _id, title, description, coreSkills, secondarySkills }) => ({
            _id,
            title,
            description,
            coreSkills: coreSkills.map(
              ({ level, fullSkill: { _id, slug } }) => ({
                skillId: _id,
                slug,
                level
              })
            ),
            secondarySkills: secondarySkills.map(
              ({ fullSkill: { _id, slug } }) => ({
                skillId: _id,
                slug,
                level: 0
              })
            )
          })
        )
      }
      mutation({
        variables: {
          inputData
        }
      })
        .then(({ data: { [mutationName]: result } }) => {
          if (result !== null) {
            Notification({
              type: 'success',
              message: 'Your changes have been saved!',
              duration: 2500,
              offset: 90
            })
            this.setState({ submitted: true }, () => {
              this.props.history.goBack()
            })
          } else
            Notification({
              type: 'warning',
              message: 'Oops, something went wrong!',
              duration: 2500,
              offset: 90
            })
        })
        .catch(err => {
          captureFilteredError(err)
          Notification({
            type: 'warning',
            message: 'Oops, something went wrong!',
            duration: 2500,
            offset: 90
          })
        })
    }
  }

  /* {
    groupName: String!
    _id: ID
    relatedRoles: [CreateRoleInput]
  } */

  render() {
    const {
      _id,
      activeRole,
      roles,
      changeHappened,
      submitted,
      groupName
    } = this.state
    const isActive = activeRole !== null
    const nextIx = roles.length
    const initialData =
      isActive &&
      (roles[activeRole] ||
        (roles[activeRole - 1] && {
          ...roles[activeRole - 1],
          title: '',
          description: '',
          _id: null
        }) ||
        formDefaults)

    const edit = !!_id

    return (
      <div>
        <Prompt
          when={!submitted && changeHappened}
          message='Are you sure you want to leave? All changes will be lost'
        />
        <div className='role-setting__heading'>
          <i
            className='role-setting__back__button icon icon-small-right icon-rotate-180'
            onClick={e => {
              e.preventDefault()
              if (isActive) this.handleEdittingRole(null)
              else this.props.history.goBack()
            }}
          />
          <div className='role-setting__heading-info'>
            <h1>{isActive ? 'Add step' : 'Create role progression'}</h1>
            {!isActive && (
              <div className='role-setting__heading-info__subtitle'>
                Define a full progression of roles, starting with the lowest
                level
              </div>
            )}
          </div>
        </div>
        {isActive ? (
          <SingleRoleForm
            initialData={initialData}
            setFrameworkState={this.props.setFrameworkState}
            group
            onSubmitRole={role => this.handleRoleChange(role, activeRole)}
          />
        ) : (
          <>
            <FormGroup mainLabel='Group name'>
              <Input
                value={groupName}
                onChange={value => this.handleChange('groupName', value)}
                placeholder='Enter the name of the group'
              />
            </FormGroup>
            <FormGroup mainLabel='Roles'>
              {roles.map(({ title }, i, { length }) => (
                <div
                  key={`role:${title}:${i}`}
                  className='role-setting__form__next-steps'
                >
                  <span
                    style={{
                      display: 'flex',
                      height: '32px',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '5px'
                      }}
                    >
                      {i !== 0 && (
                        <i
                          className='icon icon-small-down icon-rotate-180 icon-clickable'
                          onClick={() => this.handleRoleSwap(i, -1)}
                        />
                      )}
                      {i + 1 < length && (
                        <i
                          className='icon icon-small-down icon-clickable'
                          onClick={() => this.handleRoleSwap(i, 1)}
                        />
                      )}
                    </div>
                    <div>
                      {i + 1}. {title}
                    </div>
                  </span>
                  <span>
                    <i
                      className='el-icon-edit icon-edit-black'
                      onClick={() => this.handleEdittingRole(i)}
                    />
                    <i
                      className='el-icon-delete icon-delete-red'
                      onClick={() => this.handleRoleDeletion(i)}
                    />
                  </span>
                </div>
              ))}
              <div
                className='role-setting__form__next-steps role-setting__form__add-step'
                onClick={() => this.handleEdittingRole(nextIx)}
              >
                <span>Add {nextIx > 0 ? 'another ' : ''}role</span>
                <i className='el-icon-plus' />
              </div>
            </FormGroup>
            <div style={{ padding: '10px 0px', marginTop: '20px' }}>
              <SubmitButton
                form={roles}
                label='Create role progression'
                onSubmit={(mutation, form) => this.handleSubmit(mutation, form)}
                group
                edit={edit}
              />
            </div>
          </>
        )}
        <style jsx>{roleFormStyle}</style>
      </div>
    )
  }
}

export default RoleGroupForm
