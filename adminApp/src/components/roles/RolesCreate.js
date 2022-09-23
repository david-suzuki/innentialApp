import React from 'react'
import {
  Layout,
  Button,
  Form,
  // Select,
  Input,
  // Message,
  // DatePicker,
  Cascader,
  Slider,
  Loading,
  Select,
  Tag
} from 'element-react'
import { SubmitButton, OrganizationSelector } from './components'
import { fetchRegularSkills, fetchAllRoles } from '../../api'
import { Query } from 'react-apollo'
import { normalizeSkills } from './utilities'

const NextStepSelector = ({
  edittingId,
  organizationId,
  filterRoles,
  handleAddingStep
}) => (
  <Query query={fetchAllRoles}>
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      if (error) {
        console.error(error)
        return null
      }

      const roleData =
        data &&
        data.fetchAllRoles.filter(
          role => !filterRoles.some(next => next._id === role._id)
        )
      return (
        <Select
          value={{}}
          onChange={value => handleAddingStep(value)}
          placeholder='Pick a role'
        >
          {roleData
            .filter(({ _id, organization }) => {
              return edittingId !== _id && organizationId
                ? organization && organization._id === organizationId
                : !organization
            })
            .map(({ _id, title }) => (
              <Select.Option label={title} key={_id} value={{ _id, title }} />
            ))}
        </Select>
      )
    }}
  </Query>
)

const formRules = {
  title: [
    {
      required: true,
      message: 'Please add role title',
      trigger: 'blur'
    }
  ]
}

const defaultForm = {
  title: '',
  organizationId: null,
  description: '',
  coreSkills: [],
  secondarySkills: [],
  nextSteps: []
}

export default class RolesPage extends React.Component {
  state = {
    form: {
      ...defaultForm,
      organizationId: this.props.specificOrganizationId || null
    }
  }
  formRef = React.createRef()

  onChange(key, value, shouldParseInt) {
    this.setState(() => ({
      form: Object.assign({}, this.state.form, {
        [key]: shouldParseInt ? parseInt(value !== '' ? value : '0', 10) : value
      })
    }))
  }

  onChangeSelect(value) {
    this.setState(({ form }) => {
      return {
        form: {
          ...form,
          organizationId: value
        }
      }
    })
  }

  // onChangeRequirements(val, idx) {
  //   this.setState(({ form }) => {
  //     return {
  //       form: {
  //         ...form,
  //         otherRequirements: form.otherRequirements.map((v, i) =>
  //           idx === i ? val : v
  //         )
  //       }
  //     }
  //   })
  // }

  handleAddingStep = value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        nextSteps: [...form.nextSteps, value]
      }
    }))
  }

  handleRemovingStep = roleId => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        nextSteps: form.nextSteps.filter(({ _id }) => _id !== roleId)
      }
    }))
  }

  addNewItem = (itemPropertyKey, e) => {
    const addedObj =
      itemPropertyKey === 'nextSteps'
        ? { _id: null, title: '' }
        : { skillLevel: 3 }
    e.preventDefault()
    this.setState(({ form }) => {
      return {
        form: {
          ...form,
          [itemPropertyKey]: [...form[itemPropertyKey], addedObj]
        }
      }
    })
  }

  removeItem = (itemPropertyKey, index, e) => {
    e.preventDefault()
    this.setState(({ form }) => {
      return {
        form: {
          ...form,
          [itemPropertyKey]: form[itemPropertyKey].filter(
            (i, idx) => idx !== index
          )
        }
      }
    })
  }

  onSkillsChange = (key, idx, value, fullSkill) => {
    this.setState(({ form }) => {
      return {
        form: {
          ...form,
          [key]: form[key].map((val, i) => {
            if (i === idx) {
              return {
                value,
                fullSkill,
                level: val.level
              }
            } else return val
          })
        }
      }
    })
  }

  componentWillReceiveProps(props) {
    if (props.editedRole) {
      this.setState({
        form: {
          ...props.editedRole,
          organizationId: props.editedRole.organization
            ? props.editedRole.organization._id
            : null
        }
      })
    } else if (props.specificOrganizationId) {
      this.setState({
        form: {
          ...defaultForm,
          organizationId: props.specificOrganizationId
        }
      })
    }
  }

  resetForm() {
    this.setState({
      form: {
        ...defaultForm,
        organizationId: this.props.specificOrganizationId || null
      }
    })
  }

  onSkillLevelChange = (key, idx, value) => {
    this.setState(({ form }) => {
      return {
        form: {
          ...form,
          [key]: form[key].map((val, i) => {
            if (i === idx) {
              return {
                ...val,
                level: value
              }
            } else return val
          })
        }
      }
    })
  }

  render() {
    const {
      form,
      form: {
        _id: edittingId,
        title,
        organizationId,
        coreSkills,
        secondarySkills,
        description,
        nextSteps
      }
    } = this.state
    return (
      <Layout.Row>
        <Layout.Col span='24'>
          <Form
            ref={this.myRef}
            className='en-US'
            model={form}
            rules={formRules}
            labelWidth='120'
            onSubmit={e => e.preventDefault()}
          >
            <Form.Item label='Title' prop='title' style={{ width: '600px' }}>
              <Input
                name={'title'}
                value={title}
                onChange={value => this.onChange('title', value)}
              />
            </Form.Item>
            <Form.Item
              label='Description'
              prop='description'
              style={{ width: '600px' }}
            >
              <Input
                value={description}
                type='textarea'
                autosize={{ minRows: 2, maxRows: 4 }}
                placeholder='Provide a short description of the role'
                onChange={value => this.onChange('description', value)}
              />
            </Form.Item>
            {/* <Form.Item
              label="Organization"
              prop="organization"
              style={{ width: '600px' }}
            >
              <OrganizationSelector
                value={organizationId}
                onChangeSelect={val => this.onChangeSelect(val)}
                disableSelect={this.props.specificOrganizationId}
              />
            </Form.Item> */}
            <Query query={fetchRegularSkills}>
              {({ data, loading, error }) => {
                if (loading) return 'Loading...'
                if (error) return `Error! ${error.message}`
                const cascaderOptions =
                  data && normalizeSkills(data.fetchRegularSkills)
                const allSkills = data && data.fetchRegularSkills

                return (
                  <React.Fragment>
                    <Form.Item label='Core Skills' style={{ width: '700px' }}>
                      <Button onClick={e => this.addNewItem('coreSkills', e)}>
                        Add new Skill
                      </Button>
                      {coreSkills.map((skill, idx) => {
                        return (
                          <div key={idx}>
                            <Cascader
                              name={'secondaryskill'}
                              placeholder='Select required skills'
                              options={cascaderOptions}
                              value={skill.value}
                              filterable
                              onChange={value => {
                                this.onSkillsChange(
                                  'coreSkills',
                                  idx,
                                  value,
                                  allSkills.filter(d => d._id === value[1])[0]
                                )
                              }}
                            />
                            <Button
                              onClick={e =>
                                this.removeItem('coreSkills', idx, e)
                              }
                              style={{ display: 'inline-block' }}
                            >
                              Remove Skill
                            </Button>
                            <Slider
                              value={skill.level}
                              showStops
                              min={0}
                              max={5}
                              showInput
                              onChange={value =>
                                this.onSkillLevelChange(
                                  'coreSkills',
                                  idx,
                                  value
                                )
                              }
                            />
                          </div>
                        )
                      })}
                    </Form.Item>

                    <Form.Item
                      label='Secondary Skills'
                      style={{ width: '700px' }}
                    >
                      <Button
                        onClick={e => this.addNewItem('secondarySkills', e)}
                      >
                        Add new Skill
                      </Button>
                      {secondarySkills.map((skill, idx) => {
                        return (
                          <div key={idx}>
                            <Cascader
                              name={'secondaryskill'}
                              placeholder='Select required skills'
                              options={cascaderOptions}
                              value={skill.value}
                              filterable
                              onChange={value => {
                                this.onSkillsChange(
                                  'secondarySkills',
                                  idx,
                                  value,
                                  allSkills.filter(d => d._id === value[1])[0]
                                )
                              }}
                            />
                            <Button
                              onClick={e =>
                                this.removeItem('secondarySkills', idx, e)
                              }
                              style={{ display: 'inline-block' }}
                            >
                              Remove Skill
                            </Button>
                            <Slider
                              value={skill.level}
                              showStops
                              min={0}
                              max={5}
                              showInput
                              onChange={value =>
                                this.onSkillLevelChange(
                                  'secondarySkills',
                                  idx,
                                  value
                                )
                              }
                            />
                          </div>
                        )
                      })}
                    </Form.Item>
                  </React.Fragment>
                )
              }}
            </Query>
            <Form.Item label='Next steps' prop='nextSteps'>
              <NextStepSelector
                edittingId={edittingId}
                organizationId={organizationId}
                filterRoles={nextSteps}
                handleAddingStep={this.handleAddingStep}
              />
              <div>
                {nextSteps.map(({ _id, title }, i) => (
                  <Tag
                    key={_id}
                    closable
                    type='primary'
                    closeTransition={false}
                    onClose={() => this.handleRemovingStep(_id)}
                  >
                    {title}
                  </Tag>
                ))}
              </div>
            </Form.Item>
            {/* <Form.Item label="Other Requirements / Tags">
              <Button onClick={e => this.addNewItem('otherRequirements', e)}>
                Add New Requirement
              </Button>
              {otherRequirements.map((requirement, idx) => (
                <div key={idx}>
                  <Input
                    style={{ width: '600px' }}
                    value={requirement}
                    onChange={val => this.onChangeRequirements(val, idx)}
                  />
                  <Button
                    style={{ display: 'inline-block' }}
                    onClick={e => this.removeItem('otherRequirements', idx, e)}
                  >
                    Remove Requirement
                  </Button>
                </div>
              ))}
            </Form.Item> */}
            <SubmitButton form={form} />
            <Button
              onClick={e => this.resetForm()}
              type='warning'
              style={{ marginBottom: '50px' }}
            >
              Reset Form
            </Button>
          </Form>
        </Layout.Col>
      </Layout.Row>
    )
  }
}
