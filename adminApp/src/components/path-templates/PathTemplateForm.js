import React, { Component, useState } from 'react'
import {
  Form,
  Input,
  Button,
  MessageBox,
  DatePicker,
  // Select,
  Checkbox
} from 'element-react'
import {
  SubmitButton,
  GoalRelatedContent,
  BannerUpload,
  AuthorImageUpload,
  CompanyLogoUpload,
  OrganizationSelect
} from './components'
import { createLearningPath, updateLearningPath } from '../../api'
import formDefaults from './constants/_formDefaults'
import { MultipleSkillsSelector } from '../learning-content/components'
import { LearningContentForm } from '../learning-content'
import { withRouter } from 'react-router-dom'
import { TextEditor } from '../misc'
import PathTemplateContentList from './PathTemplateContentList'

// const targets = ['Leaders', 'Developers', 'HR Managers', 'First time leaders']

// const TargetSelect = ({ value, handleChange }) => (
//   <Select
//     value={value}
//     onChange={handleChange}
//     placeholder="Select a target group"
//   >
//     {targets.map((target, i) => (
//       <Select.Option value={target} label={target} key={`lp_target:${i}`} />
//     ))}
//   </Select>
// )

const goalDeletePopup = () =>
  MessageBox.confirm(
    `Are you sure you want to delete this goal template? It will be removed once you submit the form`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )

const ExpandList = ({
  content = [],
  onContentRemove = () => {},
  onNoteUpdate = () => {},
  onOrderUpdate = () => {}
}) => {
  const [showList, toggleShowList] = useState(false)

  // TODO remove because unnecessary
  // useEffect(() => {
  //   content.forEach(c => {
  //     onOrderUpdate(c._id, c.order)
  //   })
  // }, [])

  return (
    <div style={{ padding: '15px 0px 0px' }}>
      <Button type='text' onClick={() => toggleShowList(!showList)}>
        <i className={`el-icon-arrow-${showList ? 'up' : 'down'}`} />
        {'  '}
        {`${showList ? 'Hide' : 'See'} development plan`}
      </Button>
      {showList && (
        <>
          <PathTemplateContentList
            content={content}
            onContentRemove={onContentRemove}
            onNoteUpdate={onNoteUpdate}
            onOrderUpdate={onOrderUpdate}
          />
        </>
      )}
    </div>
  )
}

class PathTemplateForm extends Component {
  constructor(props) {
    super(props)

    const { initialValues } = props

    const { ...formData } = initialValues || {
      ...formDefaults,
      goalTemplates: [...formDefaults.goalTemplates]
    }

    const { displayName, propTypes, WrappedComponent, ...rest } = formData // eslint-disable-line

    this.state = {
      form: {
        ...rest
      },
      activeGoalIndex: null,
      uploadingItem: false
    }
  }

  form = React.createRef()

  handleChange = (key, value) => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        [key]: value
      }
    }))
  }

  handleAddingGoalTemplate = () => {
    this.setState(({ form: { goalTemplates, ...rest } }) => ({
      form: {
        ...rest,
        goalTemplates: [
          ...goalTemplates,
          {
            goalName: '',
            goalType: 'PERSONAL',
            relatedSkills: [{ key: 0, value: [] }],
            measures: [],
            content: []
            // mentors: [],
            // tasks: []
          }
        ]
      }
    }))
  }

  handleDeletingGoalTemplate = goalIndex => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      goalTemplates.splice(goalIndex, 1)
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleChangeGoal = (key, value, goalIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      goalTemplates.splice(goalIndex, 1, {
        ...goalTemplates[goalIndex],
        [key]: value
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleAddingMeasure = goalIndex => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { measures, ...goalRest } = goalTemplates[goalIndex]
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        measures: [...measures, '']
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleChangingMeasure = (value, goalIndex, measureIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { measures, ...goalRest } = goalTemplates[goalIndex]
      measures.splice(measureIndex, 1, value)
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        measures
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleAddingSkill = goalIndex => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { relatedSkills, ...goalRest } = goalTemplates[goalIndex]
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        relatedSkills: [
          ...relatedSkills,
          { key: relatedSkills.length, value: [] }
        ]
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleSkillsChange = (key, value, goalIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { relatedSkills, ...goalRest } = goalTemplates[goalIndex]
      relatedSkills.splice(key, 1, { key, value })
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        relatedSkills
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleDeletingSkill = (key, goalIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { relatedSkills, ...goalRest } = goalTemplates[goalIndex]
      relatedSkills.splice(key, 1)
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        relatedSkills
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleDeletingMeasure = (measureIndex, goalIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { measures, ...goalRest } = goalTemplates[goalIndex]
      measures.splice(measureIndex, 1)
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        measures
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleClearingSkill = (key, goalIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { relatedSkills, ...goalRest } = goalTemplates[goalIndex]
      relatedSkills.splice(key, 1, { key, value: [] })
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        relatedSkills
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  toggleDevelopmentPlan = activeGoalIndex => {
    this.setState({ activeGoalIndex })
  }

  handleAddingContent = item => {
    this.setState(({ form: { goalTemplates, ...rest }, activeGoalIndex }) => {
      const { content, ...goalRest } = goalTemplates[activeGoalIndex]
      content.unshift({ ...item, note: '' })
      goalTemplates.splice(activeGoalIndex, 1, {
        ...goalRest,
        content
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleRemovingContent = (contentId, goalIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { content, ...goalRest } = goalTemplates[goalIndex]
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        content: content.filter(({ _id }) => _id !== contentId)
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleUpdatingNote = (contentId, note, goalIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { content, ...goalRest } = goalTemplates[goalIndex]
      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        content: content.map(item => {
          if (item._id === contentId) {
            return {
              ...item,
              note
            }
          }
          return item
        })
      })
      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleUpdatingOrder = (contentIndex, direction, goalIndex) => {
    this.setState(({ form: { goalTemplates, ...rest } }) => {
      const { content: contents, ...goalRest } = goalTemplates[goalIndex]

      const newContents = contents.slice()

      const ix = contentIndex
      const dir = direction

      const content = newContents[ix]
      newContents.splice(ix, 1)
      newContents.splice(ix + dir, 0, content)

      goalTemplates.splice(goalIndex, 1, {
        ...goalRest,
        content: newContents
      })

      return {
        form: {
          ...rest,
          goalTemplates
        }
      }
    })
  }

  handleAddingStartCondition = () => {
    this.setState(({ form: { startConditions, ...rest } }) => {
      return {
        form: {
          ...rest,
          startConditions: [...startConditions, '']
        }
      }
    })
  }

  handleChangingStartCondition = (value, startCondIndex) => {
    this.setState(({ form: { startConditions, ...rest } }) => {
      startConditions.splice(startCondIndex, 1, value)
      return {
        form: {
          ...rest,
          startConditions
        }
      }
    })
  }

  handleDeletingStartCondition = startCondIndex => {
    this.setState(({ form: { startConditions, ...rest } }) => {
      startConditions.splice(startCondIndex, 1)
      return {
        form: {
          ...rest,
          startConditions
        }
      }
    })
  }

  render() {
    const { goBack } = this.props
    const { form, activeGoalIndex, uploadingItem } = this.state
    const {
      _id: pathId,
      name,
      description,
      targetGroup,
      abstract,
      duration,
      organizationId,
      prerequisites,
      publishedDate,
      goalTemplates,
      imageLink,
      authorImageLink,
      author,
      authorDescription,
      internalNotes,
      trending,
      authorPosition,
      authorCompanyLogoImageLink,
      startConditions
    } = form

    const activeGoal =
      activeGoalIndex !== null ? goalTemplates[activeGoalIndex] : null
    const activeSkills = activeGoal && activeGoal.relatedSkills
    const activeContent = activeGoal && activeGoal.content

    const neededSkills =
      activeSkills &&
      activeSkills.map(({ value: [name, _id] }) => ({ _id, name }))

    return (
      <div>
        {uploadingItem && (
          <LearningContentForm>
            <Button onClick={() => this.setState({ uploadingItem: false })}>
              Hide
            </Button>
          </LearningContentForm>
        )}
        {neededSkills && neededSkills.length > 0 && (
          <GoalRelatedContent
            selectedContent={activeContent}
            neededSkills={neededSkills}
            toggleDevelopmentPlan={() => this.toggleDevelopmentPlan(null)}
            onContentAdd={item => this.handleAddingContent(item)}
          >
            <Button
              type='primary'
              onClick={() => this.setState({ uploadingItem: true })}
            >
              Add learning
            </Button>
          </GoalRelatedContent>
        )}
        <Form
          ref={this.form}
          labelPosition='top'
          className='en-US'
          model={this.state.form}
          labelWidth='120'
        >
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Item
              label='Path name'
              prop='name'
              style={{ width: '77%' }}
              rules={{
                required: true,
                message: 'Please enter a name',
                trigger: 'blur'
              }}
            >
              <Input
                value={name}
                onChange={value => this.handleChange('name', value)}
              />
            </Form.Item>
            <Form.Item
              label='Category'
              prop='targetGroup'
              style={{ width: '20%' }}
            >
              <Input
                value={targetGroup}
                onChange={value => this.handleChange('targetGroup', value)}
                placeholder='If empty, will display as "Other"'
              />
              {/* <TargetSelect
                value={targetGroup}
                handleChange={value => this.handleChange('targetGroup', value)}
              /> */}
            </Form.Item>
          </span>
          <Form.Item label='Organization' prop='organizationId'>
            <OrganizationSelect
              value={organizationId}
              handleChange={value => this.handleChange('organizationId', value)}
            />
          </Form.Item>
          <Form.Item label='Abstract' prop='abstract'>
            <Input
              value={abstract}
              onChange={value => this.handleChange('abstract', value)}
              placeholder='Provide a short description that will be displayed on the path dashboard'
            />
          </Form.Item>
          <Form.Item label='Duration' prop='duration'>
            <Input
              value={duration}
              onChange={value => this.handleChange('duration', value)}
              placeholder='How much time to complete this path? (e.g. 5h, 2h for 4 weeks etc.)'
            />
          </Form.Item>
          <Form.Item label='Path description' prop='description'>
            <TextEditor
              value={description}
              handleChange={value => this.handleChange('description', value)}
            />
            {/* <Input
              value={description}
              onChange={value => this.handleChange('description', value)}
              type="textarea"
              autosize={{ minRows: 3 }}
              placeholder="Provide a short description of the path"
            /> */}
          </Form.Item>
          <Form.Item label='Path prerequisites' prop='prerequisites'>
            <Input
              value={prerequisites}
              onChange={value => this.handleChange('prerequisites', value)}
              type='textarea'
              autosize={{ minRows: 1, maxRows: 1 }}
              placeholder='What do you need beforehand to start this path (leave empty if no prerequisites are required)'
            />
          </Form.Item>
          <Form.Item label='Start conditions'>
            <span>
              {startConditions.map((startCond, ix) => (
                <span key={`startCond:${ix}`}>
                  <Input
                    value={startCond}
                    style={{ width: '93%', paddingTop: '20px' }}
                    placeholder={`Start Condition #${ix + 1}`}
                    onChange={value =>
                      this.handleChangingStartCondition(value, ix)
                    }
                  />
                  <Button
                    type='danger'
                    style={{ width: '7%', textAlign: 'center' }}
                    onClick={() => this.handleDeletingStartCondition(ix)}
                  >
                    <i className='el-icon-delete' />
                  </Button>
                </span>
              ))}
              <div
                style={{
                  marginTop: startConditions.length > 0 ? '20px' : '0px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  onClick={() => this.handleAddingStartCondition()}
                  type='primary'
                >
                  Add start conditions
                </Button>
              </div>
            </span>
          </Form.Item>
          <Form.Item label='Published date' prop='publishedDate'>
            <DatePicker
              name='date'
              value={new Date(publishedDate)}
              placeholder='Choose the published date'
              onChange={value => {
                this.handleChange('publishedDate', value)
              }}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={trending}
              onChange={value => this.handleChange('trending', value)}
            >
              Display in "Recommended for your role"
            </Checkbox>
          </Form.Item>
          <Form.Item label='Author' prop='author'>
            <Input
              value={author}
              onChange={value => this.handleChange('author', value)}
              placeholder='Name of the author (leave empty for internal paths)'
            />
            <Input
              value={authorPosition}
              onChange={value => this.handleChange('authorPosition', value)}
              placeholder="Author's role/title"
            />
            <Input
              value={authorDescription}
              onChange={value => this.handleChange('authorDescription', value)}
              placeholder='Description of the author (leave empty for internal paths)'
              type='textarea'
              autosize={{ minRows: 3 }}
            />
            {pathId && (
              <div style={{ marginTop: '40px' }}>
                <h3>Author image: </h3>
                <AuthorImageUpload
                  pathId={pathId}
                  imageLink={authorImageLink}
                />
                <h3>Company logo: </h3>
                <CompanyLogoUpload
                  pathId={pathId}
                  imageLink={authorCompanyLogoImageLink}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label='Internal notes' prop='internalNotes'>
            <Input
              value={internalNotes}
              onChange={value => this.handleChange('internalNotes', value)}
              type='textarea'
              autosize={{ minRows: 3 }}
              placeholder='Those notes are for internal use only and will not be displayed to the users'
            />
          </Form.Item>
          <h3>Goal templates</h3>
          <Form.Item
            prop={`goalTemplates`}
            rules={{
              type: 'array'
            }}
          >
            {goalTemplates.map(
              (
                {
                  _id: goalId,
                  goalName,
                  relatedSkills,
                  measures,
                  content
                  // mentors,
                  // tasks
                },
                i
              ) => {
                const updatedSkillsForUI =
                  relatedSkills.length === 0
                    ? [{ key: 0, value: [] }]
                    : relatedSkills

                return (
                  <Form.Item
                    key={`goal-template:${i}`}
                    // label={`Goal template ${i + 1}`}
                    prop={`goalTemplates.${i}`}
                    rules={{
                      type: 'object',
                      fields: {
                        goalName: {
                          required: true,
                          message: 'Please input the name of the goal',
                          trigger: 'blur'
                        }
                        // relatedSkills: {

                        // },
                        // measures: {

                        // }
                      }
                    }}
                    style={{ paddingTop: '15px' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 0px'
                      }}
                    >
                      <p>Goal template {i + 1}</p>
                      {(goalId || i !== 0) && (
                        <Button
                          type='danger'
                          onClick={async () => {
                            try {
                              if (goalId) await goalDeletePopup()
                              this.handleDeletingGoalTemplate(i)
                            } catch (e) {}
                          }}
                        >
                          <i className='el-icon-delete' />
                        </Button>
                      )}
                    </div>
                    <div
                      style={{
                        padding: '20px',
                        backgroundColor: '#eef1f6',
                        borderRadius: '5px'
                      }}
                    >
                      <React.Fragment>
                        <Input
                          value={goalName}
                          onChange={value =>
                            this.handleChangeGoal('goalName', value, i)
                          }
                          placeholder='Goal name'
                        />
                        <MultipleSkillsSelector
                          selectedSecondarySkills={updatedSkillsForUI}
                          onSkillsChange={(key, value) =>
                            this.handleSkillsChange(key, value, i)
                          }
                          addNewItem={() => this.handleAddingSkill(i)}
                          removeItem={(key1, key2, key, e) =>
                            this.handleDeletingSkill(key, i)
                          }
                          clearSecondarySkills={key =>
                            this.handleClearingSkill(key, i)
                          }
                        />
                        {measures.map((measureName, ix) => (
                          <span key={`measure:${i}:${ix}`}>
                            <Input
                              value={measureName}
                              style={{ width: '93%', paddingTop: '20px' }}
                              placeholder={`Measure #${ix + 1}`}
                              onChange={value =>
                                this.handleChangingMeasure(value, i, ix)
                              }
                            />
                            <Button
                              type='danger'
                              style={{ width: '7%', textAlign: 'center' }}
                              onClick={() => this.handleDeletingMeasure(ix, i)}
                            >
                              <i className='el-icon-delete' />
                            </Button>
                          </span>
                        ))}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '20px'
                          }}
                        >
                          <Button
                            disabled={relatedSkills.some(
                              ({ value }) => value.length === 0
                            )}
                            onClick={() => this.toggleDevelopmentPlan(i)}
                          >
                            Set development plan
                          </Button>
                          <Button
                            onClick={() => this.handleAddingMeasure(i)}
                            type='primary'
                          >
                            Add success measure
                          </Button>
                        </div>
                        <ExpandList
                          content={content}
                          onContentRemove={contentId =>
                            this.handleRemovingContent(contentId, i)
                          }
                          onNoteUpdate={(contentId, note) =>
                            this.handleUpdatingNote(contentId, note, i)
                          }
                          onOrderUpdate={(contentIndex, direction) =>
                            this.handleUpdatingOrder(contentIndex, direction, i)
                          }
                        />
                      </React.Fragment>
                    </div>
                  </Form.Item>
                )
              }
            )}
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              <SubmitButton
                formRef={this.form}
                form={this.state.form}
                goBack={goBack}
                mutation={
                  this.props.initialValues &&
                  Object.keys(this.props.initialValues).length > 0
                    ? updateLearningPath
                    : createLearningPath
                }
                variables={
                  this.props.initialValues &&
                  Object.keys(this.props.initialValues).length > 0
                    ? { id: this.props.initialValues._id }
                    : null
                }
              />
              <Button size='large' onClick={() => goBack()}>
                Go back
              </Button>
            </span>
            <Button
              type='primary'
              size='large'
              onClick={this.handleAddingGoalTemplate}
            >
              Add another goal template
            </Button>
          </div>
        </Form>
        {pathId && (
          <div style={{ marginTop: '40px' }}>
            <h3>Banner upload: </h3>
            <BannerUpload pathId={pathId} imageLink={imageLink} />
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(({ history, ...props }) => (
  <PathTemplateForm {...props} goBack={history.goBack} />
))
