import React, { Component } from 'react'
import { Button, Form } from 'element-react'
import {
  FormGroup,
  // LinesOfWorkSelector,
  // MultipleSkillsSelector,
  ListSkillSelector,
  Page,
  UserSetLocation,
  RoleSelector
} from '../ui-components'
import history from '../../history'

export default props => {
  const {
    onboardingSkills,
    onboardingFunctions: {
      onChangeInput,
      handleSuggestRole,
      removeSkill,
      onSkillsSubmit
    }
  } = props.container.useContainer()

  const {
    form: { roleAtWork, selectedWorkSkills }
  } = onboardingSkills

  return (
    <Page1WorkInfo
      {...props}
      roleProps={{
        value: roleAtWork,
        onChange: onChangeInput,
        handleSuggestRole
      }}
      selectorProps={{
        skills: selectedWorkSkills,
        // clearState: true,
        onSkillRemove: removeSkill,
        buttonValue: 'Find skills...',
        buttonClass: 'list-skill-selector__button-input',
        onSkillsSubmit: skills => onSkillsSubmit(skills, 'selectedWorkSkills'),
        formKey: 'selectedWorkSkills',
        item: 'selectedSkillsLength'
      }}
    />
  )
}

class Page1WorkInfo extends Component {
  state = {
    workRole: this.props.roleProps.value,
    selectedSkillsLength: this.props.selectorProps.skills.length
  }

  timeout = null
  timeout2 = null

  selectedSkillsRules = {
    selectedSkillsLength: [
      { type: 'number', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value === 0) {
            callback(new Error('You must select at least one skill'))
          }
          // else if (value > 6) {
          //   callback(new Error('Please select up to six skills'))
          // }
          else {
            callback()
          }
        }
      }
    ]
  }

  myRef = React.createRef()

  componentWillReceiveProps(nextProps) {
    this.setState({
      workRole: nextProps.roleProps.value,
      selectedSkillsLength: nextProps.selectorProps.skills.length
    })
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout)
    if (this.timeout2) clearTimeout(this.timeout2)
  }

  render() {
    return (
      <Page>
        <div style={{ minHeight: '50vh' }}>
          <Form
            model={this.state}
            ref={this.myRef}
            rules={this.selectedSkillsRules}
          >
            <FormGroup mainLabel='What is your role'>
              <Form.Item
                prop='workRole'
                rules={{
                  required: true,
                  message: 'Required',
                  trigger: 'blur'
                }}
              >
                <RoleSelector
                  value={this.props.roleProps.value}
                  handleRoleSelect={({ _id, title, coreSkills }) => {
                    this.props.roleProps.onChange(title, 'roleAtWork')
                    this.timeout = setTimeout(
                      () =>
                        this.props.selectorProps.onSkillsSubmit(
                          coreSkills.map(skill => ({ ...skill, level: 0 })),
                          'selectedWorkSkills'
                        ),
                      100
                    )
                    this.timeout2 = setTimeout(
                      () => this.props.roleProps.onChange(_id, 'roleId'),
                      200
                    )
                  }}
                  handleRoleChange={value =>
                    this.props.roleProps.onChange(value, 'roleAtWork')
                  }
                  handleRoleSuggest={title => {
                    this.props.roleProps.handleSuggestRole(title)
                  }}
                />
              </Form.Item>
            </FormGroup>
            <UserSetLocation selected={{}} onboarding />
            <FormGroup mainLabel='Select minimum 5 most important skills that you have'>
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
          </Form>
        </div>
        <div className='bottom-nav'>
          <Button
            type='primary'
            onClick={() => {
              this.myRef.current.validate(valid => {
                if (valid) {
                  history.push(
                    '/onboarding/my-skill-levels',
                    this.props.routeState
                  )
                }
              })
            }}
          >
            <i className='icon icon-tail-right' />
          </Button>
        </div>
      </Page>
    )
  }
}
