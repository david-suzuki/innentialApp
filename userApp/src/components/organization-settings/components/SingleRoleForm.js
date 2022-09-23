import React from 'react'
import {
  ListSkillSelector,
  StarBar,
  FormGroup,
  SelectedSkills,
  RoleSelector
} from '../../ui-components'
import { Button, Form, Input, Notification } from 'element-react'
import SubmitButton from './SubmitButton'
import formDefaults from '../constants/_roleFormDefaults'
import { captureFilteredError } from '../../general'
import { Prompt } from 'react-router-dom'

class RoleForm extends React.Component {
  constructor(props) {
    super(props)

    const { initialData } = props
    const {
      suggestion,
      coreSkills,
      secondarySkills,
      title,
      _id,
      description = '',
      nextSteps = []
    } = initialData

    this.state = {
      form: {
        _id,
        title,
        description,
        nextStepsSearch: '',
        nextSteps,
        coreSkills: coreSkills.map(
          ({
            level,
            fullSkill: { _id, name, slug, category, frameworkId }
          }) => ({ _id, name, slug, category, frameworkId, level })
        ),
        secondarySkills: secondarySkills.map(
          ({
            level,
            fullSkill: { _id, name, slug, category, frameworkId }
          }) => ({ _id, name, slug, category, frameworkId, level })
        )
      },
      suggestion,
      changeHappened: false,
      submitted: false
    }
  }

  form = React.createRef()

  componentDidMount = () => {
    this.props.setFrameworkState({
      visible: true
    })
  }

  componentWillUnmount = () => {
    this.props.setFrameworkState({
      visible: false
    })
  }

  handleHover = (id, level, name) => {
    this.props.setFrameworkState({
      visible: true,
      frameworkId: id,
      level,
      skillName: name
    })
  }

  handleChange = (key, value) => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        [key]: value
      },
      changeHappened: true
    }))
  }

  handleSkillLevelChange = (skillId, value) => {
    const prevSkills = this.state.form.coreSkills
    const newSkills = prevSkills.map(skill => {
      if (skill._id === skillId) {
        return {
          ...skill,
          level: value
        }
      } else return skill
    })

    this.setState(({ form }) => ({
      form: {
        ...form,
        coreSkills: newSkills
      },
      changeHappened: true
    }))
  }

  handleSkillRemove = (key, skillId) => {
    const prevSkills = this.state.form[key]
    const newSkills = prevSkills.reduce((acc, curr) => {
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

    this.setState(({ form }) => ({
      form: {
        ...form,
        [key]: newSkills
      },
      changeHappened: true
    }))
  }

  handleRoleChange = value => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        nextStepsSearch: value
      }
    })
  }

  handleRoleSelect = (title, _id) => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        nextSteps: [...form.nextSteps, { title, _id }],
        nextStepsSearch: ''
      },
      changeHappened: true
    })
  }

  handleRoleDelete = roleId => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        nextSteps: form.nextSteps.filter(({ _id }) => _id !== roleId)
      },
      changeHappened: true
    })
  }

  resetForm = () => {
    this.setState({
      form: {
        ...formDefaults
      },
      changeHappened: false
    })
    if (this.form && this.form.current) this.form.current.resetFields()
  }

  handleSubmit = (mutation, form, mutationName) => {
    this.form.current.validate(async valid => {
      if (valid) {
        const {
          _id,
          title,
          description,
          nextSteps,
          coreSkills,
          secondarySkills
        } = form
        if (this.props.group) {
          this.props.onSubmitRole({
            _id,
            title,
            description,
            nextSteps,
            coreSkills: coreSkills.map(
              ({ _id, name, frameworkId, category, slug, level }) => ({
                level,
                fullSkill: { _id, name, slug, category, frameworkId }
              })
            ),
            secondarySkills: secondarySkills.map(
              ({ _id, name, frameworkId, category, slug, level }) => ({
                level,
                fullSkill: { _id, name, slug, category, frameworkId }
              })
            )
          })
        } else {
          const inputData = {
            _id,
            title,
            description,
            coreSkills: coreSkills.map(({ _id, slug, level }) => ({
              skillId: _id,
              slug,
              level
            })),
            secondarySkills: secondarySkills.map(({ _id, slug }) => ({
              skillId: _id,
              slug,
              level: 0
            })),
            nextSteps: nextSteps.map(({ _id }) => _id)
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
                this.setState({ submitted: true }, () => this.props.goBack())
              }
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
    })
  }

  filterRoles = ({ _id, grouped, suggestion }) => {
    return this.props.group
      ? !suggestion && !grouped
      : !suggestion &&
          !this.state.form.nextSteps.some(
            ({ _id: selectedId }) => _id === selectedId
          )
  }

  render() {
    const { group } = this.props
    const { form, suggestion, submitted, changeHappened } = this.state
    const {
      _id,
      title,
      description,
      coreSkills,
      secondarySkills,
      nextSteps,
      nextStepsSearch
    } = form
    const edit = !!_id

    return (
      <>
        <Prompt
          when={!group && !submitted && changeHappened}
          message='Are you sure you want to leave? All changes will be lost'
        />
        <Form ref={this.form} model={form} onSubmit={e => e.preventDefault()}>
          <FormGroup>
            <Form.Item
              label='Role title'
              prop='title'
              rules={{
                required: true,
                trigger: 'blur',
                message: 'Please provide the title'
              }}
            >
              {group ? (
                <RoleSelector
                  value={title}
                  handleRoleChange={value => this.handleChange('title', value)}
                  handleRoleSelect={suggestion =>
                    this.setState(({ form }) => ({
                      form: { ...form, ...suggestion }
                    }))
                  }
                  placeholder='Enter a new title (e.g. Junior Developer) or add an existing role from suggestions'
                  organizationOnly
                  filterRoles={this.filterRoles}
                  canSuggest={false}
                />
              ) : (
                <Input
                  value={title}
                  placeholder='e.g. Senior Scrum Master, Junior Developer'
                  onChange={value => this.handleChange('title', value)}
                />
              )}
            </Form.Item>
            <Form.Item label='Role description' prop='description'>
              <Input
                type='textarea'
                autosize={{ minRows: 3, maxRows: 5 }}
                placeholder='Optionally, provide a short description of the role'
                value={description}
                onChange={value => this.handleChange('description', value)}
                style={{ margin: '10px 0px' }}
              />
            </Form.Item>
            <Form.Item label='Core skills' prop='coreSkills'>
              <ListSkillSelector
                buttonValue='Skills mandatory for the role'
                buttonClass='list-skill-selector__button-input'
                skills={[]}
                onSkillsSubmit={skills => {
                  const newSkills = [...skills, ...coreSkills]
                  this.handleChange('coreSkills', newSkills)
                }}
                filterSkills={[...coreSkills, ...secondarySkills]}
                clearState
              />
              <p className='role-form__sublabel'>
                These skills will be automatically suggested to employees
                choosing this role during onboarding
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                  margin: '10px 0px'
                }}
              >
                {coreSkills.map(skill => (
                  <div
                    key={skill._id}
                    style={{ position: 'relative', padding: '15px' }}
                  >
                    <StarBar
                      name={skill.name}
                      subtitle={skill.category}
                      level={skill.level}
                      updateSkillLevels={(name, level) =>
                        this.handleSkillLevelChange(skill._id, level)
                      }
                      handleHover={level => {
                        const { frameworkId, name } = skill
                        if (frameworkId) {
                          this.handleHover(frameworkId, level, name)
                        } else {
                          this.handleHover('no_framework', 0, name)
                        }
                      }}
                    />
                    <i
                      className='el-icon-delete icon-delete-red icon-delete-red--fixed'
                      onClick={() =>
                        this.handleSkillRemove('coreSkills', skill._id)
                      }
                    />
                  </div>
                ))}
              </div>
            </Form.Item>
            <Form.Item label='Nice to have skills' prop='secondarySkills'>
              <ListSkillSelector
                buttonValue='Skills that are not necessary, but add value to the role'
                buttonClass='list-skill-selector__button-input'
                skills={[]}
                onSkillsSubmit={skills => {
                  const newSkills = [...skills, ...secondarySkills]
                  this.handleChange('secondarySkills', newSkills)
                }}
                filterSkills={[...coreSkills, ...secondarySkills]}
                clearState
              />
              <SelectedSkills
                skills={secondarySkills}
                onSkillRemove={skill =>
                  this.handleSkillRemove(
                    'secondarySkills',
                    skill._id || skill.skillId
                  )
                }
              />
            </Form.Item>
            {!group && (
              <Form.Item label='Next steps' prop='nextSteps'>
                <RoleSelector
                  value={nextStepsSearch}
                  handleRoleChange={value => this.handleRoleChange(value)}
                  handleRoleSelect={({ title, _id }) =>
                    this.handleRoleSelect(title, _id)
                  }
                  placeholder='Add existing roles as a progression for this role'
                  organizationOnly
                  canSuggest={false}
                  filterRoles={this.filterRoles}
                />
                <div style={{ marginTop: '5px' }}>
                  {nextSteps.map(({ title, _id }) => (
                    <div key={_id} className='role-setting__form__next-steps'>
                      <span>{title}</span>
                      <i
                        className='el-icon-delete icon-delete-red'
                        onClick={() => this.handleRoleDelete(_id)}
                      />
                    </div>
                  ))}
                </div>
              </Form.Item>
            )}
          </FormGroup>
        </Form>
        <div style={{ padding: '10px 0px' }}>
          <SubmitButton
            form={form}
            label={
              group
                ? 'Save role'
                : suggestion
                ? 'Approve suggestion'
                : edit
                ? 'Save role'
                : 'Create role'
            }
            onSubmit={(mutation, form) => this.handleSubmit(mutation, form)}
            edit={edit}
            suggestion={suggestion}
          />
          {!_id && (
            <Button type='warning' onClick={this.resetForm}>
              Reset
            </Button>
          )}
        </div>
      </>
    )
  }
}

export default RoleForm
