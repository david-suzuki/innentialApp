import React, { useEffect } from 'react'
import ApolloCacheUpdater from 'apollo-cache-updater'
import { useMutation, ApolloConsumer } from 'react-apollo'
import { FormGroup, GoalItem } from '../../ui-components'
import {
  Button,
  Input,
  Notification,
  Select,
  Message,
  MessageBox
} from 'element-react'
import { Prompt } from 'react-router-dom'
import { GoalItemEdit } from '../../goals'
import { DevelopmentPlanSetting } from '../../development-plans'
import { TextEditor } from '../../ui-components'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  createLearningPath,
  fetchOrganizationLearningPath,
  updateLearningPath,
  fetchTeamLearningPath,
  deleteLearningPathBanner,
  fetchBannerUploadLink
} from '../../../api'

import pathTemplateFormStyle from '$/styles/pathTemplateFormStyle'
import PlusCircle from '$/static/plus-circle-white.svg'
import { ReactComponent as ContentIcon } from '$/static/content-type-icon.svg'
import axios from 'axios'
import { LoadingSpinner } from '../../general'
import { UploadIcon } from './Icons'
import { ReactComponent as OrderIcon } from '$/static/order-icon.svg'

const SingleTeamSelector = ({
  teams,
  selectedTeam,
  handleTeamChange,
  leader
}) => {
  useEffect(() => {
    if (teams.length === 1 && leader) {
      const { _id: teamId, teamName } = teams[0]
      handleTeamChange({ teamId, teamName })
    }
  }, [])

  if (teams.length === 0) return null

  const selectOptions = teams.map(({ _id: teamId, teamName }) => (
    <Select.Option
      label={teamName}
      value={teamId}
      key={`team-option:${teamId}`}
    />
  ))

  if (!leader) {
    selectOptions.unshift(
      <Select.Option
        label='Organization'
        value={null}
        key={`team-option:org`}
      />
    )
  }

  return (
    <FormGroup
      mainLabel={
        leader ? (
          <span className='path-template__label'>
            Choose which team the path will belong to
          </span>
        ) : (
          <span className='path-template__label'>
            Would you like this path to belong to a specific team?
          </span>
        )
      }
    >
      <Select
        className={leader ? '' : 'smaller-font'}
        onChange={teamId =>
          handleTeamChange({
            teamId,
            teamName: teams.find(t => t._id === teamId)?.teamName || ''
          })
        }
        onClear={() => handleTeamChange(null)}
        value={selectedTeam?.teamId || null}
        placeholder={
          leader
            ? 'Choose a team'
            : 'If no team is chosen, this path will only be available to admins in the organization'
        }
        clearable={!leader}
      >
        {selectOptions}
      </Select>
    </FormGroup>
  )
}

const Submit = ({
  label,
  data,
  callback,
  validate,
  goBack,
  props,
  setState
}) => {
  const isEdit = !!data._id
  const [mutation] = useMutation(
    isEdit ? updateLearningPath : createLearningPath
  )
  const [deleteBannerMutation] = useMutation(deleteLearningPathBanner)
  const mutationKey = isEdit ? 'updateLearningPath' : 'createLearningPath'
  const handleSubmit = async () => {
    const {
      _id: id,
      name,
      description,
      goalTemplates: goalTemplate,
      roles,
      team,
      active,
      duration
    } = data

    const isValid = validate()
    if (isValid) {
      setState({ ...data, loading: true })
      if (data._id && data.imageDeleted) {
        await deleteBannerMutation({
          variables: {
            pathId: data._id,
            key: 'learning-paths/banners'
          }
        })
      }
      mutation({
        variables: {
          input: {
            id,
            name,
            duration,
            description,
            goalTemplate: goalTemplate.map(
              (
                { _id: id, __typename, content, relatedSkills, ...rest },
                ix
              ) => ({
                id,
                order: ix,
                content: content.map((c, i) => ({
                  contentId: c._id,
                  order: i,
                  note: c.note
                })),
                relatedSkills: relatedSkills.map(s => s._id),
                ...rest
              })
            ),
            active,
            roles,
            skills: goalTemplate.reduce((acc, { relatedSkills }) => {
              const array = []
              relatedSkills.forEach(({ _id }) => {
                if (!array.some(skillId => _id === skillId)) array.push(_id)
              })
              return [...acc, ...array]
            }, []),
            team: team?.teamId === null ? null : team
          }
        },
        update: (proxy, { data: { [mutationKey]: mutationResult = {} } }) => {
          // your mutation response

          if (!isEdit) {
            try {
              const updates = ApolloCacheUpdater({
                proxy, // apollo proxy
                queriesToUpdate: [fetchOrganizationLearningPath],
                searchVariables: {},
                mutationResult,
                ID: '_id'
              })
            } catch (err) {}
          }
        }
      })
        .then(async res => {
          const message = isEdit ? 'Successfully updated' : 'Successfully added'
          if (!isEdit && data?.chosenImage?.name) {
            const uploadLink = await props.client.query({
              query: fetchBannerUploadLink,
              variables: {
                pathId: res.data.createLearningPath._id,
                contentType: data?.chosenImage?.type
              }
            })
            await axios.put(
              uploadLink.data.fetchBannerUploadLink,
              data?.chosenImage,
              {
                headers: {
                  'Content-Type': data?.chosenImage.type
                }
              }
            )
            Notification({
              type: 'success',
              message,
              duration: 2500,
              offset: 90
            })
            setState({ ...data, loading: false })
            callback()
          } else {
            if (!data.chosenImage.name) {
              Notification({
                type: 'success',
                message,
                duration: 2500,
                offset: 90
              })
              setState({ ...data, loading: false })
              callback()
            } else {
              setState({ ...data, loading: false })
              callback()
            }
          }
        })
        .catch(e => {})
    }
  }
  return (
    <div className='page-footer page-footer--fixed-path'>
      <div className='path-template__footer'>
        <div className='path-template__footer-back' onClick={goBack}>
          <i className='page-heading__back__button icon icon-small-right icon-rotate-180' />
          Back
        </div>
        <Button type='primary' size='large' onClick={handleSubmit}>
          {label}
        </Button>
      </div>
    </div>
  )
}

const headerString = isEditing => `${isEditing ? 'Edit' : 'New'} Learning Path`
const buttonLabel = isEditing => (isEditing ? 'Confirm' : 'Save Path')

class PathForm extends React.Component {
  constructor(props) {
    super(props)

    const {
      initialData: {
        _id,
        name,
        duration,
        description,
        imageLink,
        goalTemplates = [],
        team = null,
        active
      }
    } = props

    this.state = {
      _id,
      name,
      description,
      imageLink,
      goalTemplates,
      active,
      addingTemplates: false,
      activeTemplate: null,
      nameChanged: !!_id,
      changeHappened: false,
      submitted: false,
      headingVisible: true,
      team,
      skills: [],
      showChangeOrder: false,
      chosenImage: {},
      uploadLink: '',
      chosenImageLink: null,
      loading: false,
      imageDeleted: false,
      duration,
      nameError: false
    }
  }

  // selectorRef = React.createRef()
  handleContentChangingOrder = (goalIndex, content) => {
    let goals = this.state.goalTemplates
    let goal = goals[goalIndex]
    goal = { ...goal, content }

    goals.splice(goalIndex, 1, goal)
    this.setState({ ...this.state, goalTemplates: goals })
  }
  handleDeleteContent = async (goalIndex, contentIndex) => {
    try {
      await MessageBox.confirm(
        'Are you sure you want to remove this content?',
        'Warning',
        {
          type: 'warning'
        }
      )
      let goals = this.state.goalTemplates
      let goal = goals[goalIndex]
      goal.content.splice(contentIndex, 1)
      goals.splice(goalIndex, 1, goal)
      this.setState({ ...this.state, goalTemplates: goals })
      Notification({
        type: 'info',
        message: 'Changes will be saved once you finish editing path.',
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-info'
      })
    } catch (e) {}
  }
  handleContentDetailsChange = (goalIndex, contentIndex, noteValue) => {
    let goals = this.state.goalTemplates
    let goal = goals[goalIndex]

    let selectedContent = goal.content[contentIndex]
    goal.content.splice(contentIndex, 1, {
      ...selectedContent,
      note: noteValue
    })
    goals.splice(goalIndex, 1, goal)
    this.setState({ ...this.state, goalTemplates: goals })
  }
  handleChange = (key, value) => {
    this.setState(({ nameChanged }) => ({
      [key]: value,
      changeHappened: true,
      nameChanged: nameChanged || key === 'name'
    }))
    if (key === 'name' && value.length > 0) {
      this.setState({ nameError: false })
    }
  }
  handleFileDelete = () => {
    if (this.state.imageLink && this.state.imageLink !== '') {
      this.setState({ ...this.state, imageDeleted: true, imageLink: null })
    } else if (this.state.chosenImage && this.state.chosenImage?.name) {
      this.setState({ ...this.state, chosenImage: {}, imageLink: null })
    }
  }

  handleAddingTemplate = () => {
    this.setState(({ goalTemplates }) => {
      return {
        goalTemplates: [
          ...goalTemplates,
          {
            goalName: '',
            goalType: 'PERSONAL',
            relatedSkills: [],
            measures: [],
            content: [],
            mentors: [],
            tasks: []
          }
        ],
        changeHappened: true
      }
    })
  }

  handleTemplateDeletion = ix => {
    this.setState(({ goalTemplates }) => {
      goalTemplates.splice(ix, 1)
      if (goalTemplates.length === 1) {
        return {
          name: goalTemplates[0].goalName,
          nameChanged: false,
          goalTemplates,
          changeHappened: true
        }
      }
      return {
        goalTemplates,
        changeHappened: true
      }
    })
  }

  handleDeleteGoalContent = (contentIx, goalIx) => {
    this.setState(({ goalTemplates }) => {
      // contentIx: 1 goalIx: 0
      // [{ content: [{ 1 }, { 2 }]}, { content: [{ 3 }]}]
      const goalTemplate = goalTemplates[goalIx] // the one you want to delete from { content: [{ 1 }, { 2 }]}
      const goalContent = goalTemplate.content // content array [{ 1 }, { 2 }]
      goalContent.splice(contentIx, 1) // remove item [{ 1 }]
      goalTemplates.splice(goalIx, 1, {
        ...goalTemplate,
        content: goalContent // { content: [{ 1 }]}
      }) // Re-add updated goal template [{ content: [{ 1 }]}, { content: [{ 3 }]}]
      return {
        goalTemplates: goalTemplates
      }
    })
  }
  handleFileChange = async e => {
    if (this.props.initialData._id) {
      const bannerLink = await this.props.client.query({
        query: fetchBannerUploadLink,
        variables: {
          pathId: this.props.initialData._id,
          contentType: e.type
        }
      })
      this.setState({
        ...this.state,
        uploadLink: bannerLink.data.fetchBannerUploadLink,
        chosenImage: e,
        chosenImageLink: URL.createObjectURL(e)
      })
    } else {
      this.setState({
        ...this.state,
        chosenImageLink: URL.createObjectURL(e),
        chosenImage: e
      })
    }
  }
  handleSettingRelatedSkills = (templateIndex, relatedSkills) => {
    this.setState(({ goalTemplates }) => {
      const goalTemplate = goalTemplates[templateIndex]
      goalTemplates.splice(templateIndex, 1, {
        ...goalTemplate,
        relatedSkills
      })
      return {
        goalTemplates,
        changeHappened: true
      }
    })
  }

  handleAddingMeasure = templateIndex => {
    this.setState(({ goalTemplates }) => {
      const { measures, ...rest } = goalTemplates[templateIndex]
      goalTemplates.splice(templateIndex, 1, {
        ...rest,
        measures: [...measures, '']
      })
      return {
        goalTemplates,
        changeHappened: true
      }
    })
  }

  handleDeletingMeasure = (templateIndex, measureIndex) => {
    this.setState(({ goalTemplates }) => {
      const { measures, ...rest } = goalTemplates[templateIndex]
      measures.splice(measureIndex, 1)
      goalTemplates.splice(templateIndex, 1, {
        ...rest,
        measures
      })
      return {
        goalTemplates,
        changeHappened: true
      }
    })
  }

  handleChangingGoalName = (templateIndex, value) => {
    this.setState(({ nameChanged, goalTemplates }) => {
      const goalTemplate = goalTemplates[templateIndex]
      goalTemplates.splice(templateIndex, 1, {
        ...goalTemplate,
        goalName: value
      })
      const setName = !nameChanged && templateIndex === 0
      if (setName) {
        return {
          name: value,
          goalTemplates,
          changeHappened: true
        }
      } else
        return {
          goalTemplates,
          changeHappened: true
        }
    })
  }

  handleChangingMeasure = (templateIndex, measureIndex, value) => {
    this.setState(({ goalTemplates }) => {
      const { measures, ...rest } = goalTemplates[templateIndex]
      measures.splice(measureIndex, 1, value)
      goalTemplates.splice(templateIndex, 1, {
        ...rest,
        measures
      })
      return {
        goalTemplates,
        changeHappened: true
      }
    })
  }

  toggleSettingDevelopmentPlan = templateIndex => {
    this.setState(({ settingDevelopmentPlan: value }) => ({
      activeTemplate: templateIndex,
      settingDevelopmentPlan: !value
    }))
  }

  setPlanForGoal = (content, mentors) => {
    this.setState(({ activeTemplate, goalTemplates }) => {
      const goalTemplate = goalTemplates[activeTemplate]
      goalTemplates.splice(activeTemplate, 1, {
        ...goalTemplate,
        content,
        mentors
      })
      return {
        goalTemplates,
        changeHappened: true
      }
    })
  }

  handleTeamChange = team => {
    this.setState({
      team
    })
  }

  // setActiveDialog = (activeTemplate, skills) => {
  //   if (this.selectorRef.current) this.selectorRef.current.toggleVisibility()
  //   this.setState({
  //     activeTemplate,
  //     skills
  //   })
  // }
  uploadImg = async e => {
    this.setState({ ...this.state, loading: true })
    await axios.put(this.state.uploadLink, this.state.chosenImage, {
      headers: {
        'Content-Type': this.state.chosenImage.type
      }
    })
    this.setState({ ...this.state, loading: false })
    Notification({
      type: 'success',
      message: 'Successfully updated!'
    })
  }
  validate = () => {
    const { goalTemplates, name, description, team } = this.state
    if (
      goalTemplates.some(
        ({ goalName, measures }) =>
          goalName?.length === 0 ||
          measures.some(measureName => measureName?.length === 0)
      )
    ) {
      Notification({
        type: 'error',
        message: 'Please provide all the goal and measure names',
        duration: 4500,
        iconClass: 'el-icon-error',
        offset: 90
      })
      return false
    }
    if (name?.length === 0) {
      Notification({
        type: 'error',
        message: 'Please provide the learning path name',
        duration: 4500,
        iconClass: 'el-icon-error',
        offset: 90
      })
      this.setState({ nameError: true })
      return false
    }
    // if (name?.length > 32) {
    //   Notification({
    //     type: 'error',
    //     message: 'The title must contain a maximum of 32 characters',
    //     duration: 4500,
    //     iconClass: 'el-icon-error',
    //     offset: 90
    //   })
    //   return false
    // }
    // if (description?.length === 0) {
    //   Notification({
    //     type: 'error',
    //     message: 'Please provide the learning path description',
    //     duration: 4500,
    //     iconClass: 'el-icon-error',
    //     offset: 90
    //   })
    //   return false
    // }
    if (this.props.currentUser.roles.indexOf('ADMIN') === -1 && team === null) {
      Notification({
        type: 'error',
        message: 'You must choose a team',
        duration: 4500,
        iconClass: 'el-icon-error',
        offset: 90
      })
      return false
    }
    return true
  }

  handleSubmit = async () => {
    const { history } = this.props

    if (this.state.uploadLink && this.state.uploadLink !== '') {
      await this.uploadImg()
    }

    this.setState({ submitted: true }, () => {
      if (this.state.team) {
        history.replace('/learning-paths/organization?tab=team')
      } else history.replace('/learning-paths/organization')
    })
  }

  render() {
    const { history, currentUser, teams } = this.props
    const {
      _id,
      name,
      description,
      goalTemplates,
      submitted,
      changeHappened,
      activeTemplate,
      skills,
      settingDevelopmentPlan,
      team,
      duration
    } = this.state
    if (settingDevelopmentPlan) {
      const activeTemplateInfo = goalTemplates[activeTemplate]
      const {
        content,
        mentors,
        tasks,
        relatedSkills,
        measures
      } = activeTemplateInfo

      const neededSkills = relatedSkills.map(({ _id, name }) => ({ _id, name }))

      return (
        <DevelopmentPlanSetting
          onBackButtonClick={this.toggleSettingDevelopmentPlan}
          selectedContent={content}
          selectedMentors={mentors}
          selectedTasks={tasks}
          neededSkills={neededSkills}
          isOnGoalSetting
          setPlanForGoal={this.setPlanForGoal}
          user={currentUser._id}
          currentUser={currentUser}
          status='ACTIVE'
          saveButton
          handleSavePlan={this.toggleSettingDevelopmentPlan}
          handleSettingRelatedSkills={this.handleSettingRelatedSkills}
          activeTemplate={activeTemplate}
        >
          <GoalItem
            {...activeTemplateInfo}
            measures={[]}
            hideMeasureCount
            goalIndex={activeTemplate}
            handleChangingGoalName={this.handleChangingGoalName}
          />
        </DevelopmentPlanSetting>
      )
    }

    const handlers = {
      removeGoal: this.handleTemplateDeletion,
      addNewMeasure: this.handleAddingMeasure,
      deleteMeasure: this.handleDeletingMeasure,
      onChangeName: this.handleChangingGoalName,
      onChangeMeasure: this.handleChangingMeasure,
      // setActiveDialog: this.setActiveDialog,
      onDevelopmentPlanClick: this.toggleSettingDevelopmentPlan,
      onSave: this.handleSubmit,
      validate: this.validate
    }
    const handleOnDragEnd = result => {
      if (!result.destination) return

      const items = goalTemplates
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      this.setState({ goalTemplates: items, changeHappened: true })
    }

    return (
      <>
        {this.state.loading ? (
          <LoadingSpinner />
        ) : (
          <div className='path-template__container'>
            <Prompt
              when={!submitted && changeHappened}
              message='Are you sure you want to leave? All changes will be lost'
            />
            {/* <ListSkillSelector
          skills={skills}
          forwardRef={this.selectorRef}
          onSkillsSubmit={selected =>
            this.handleSettingRelatedSkills(activeTemplate, selected)
          }
          hideLoading
          clearState
        /> */}
            <div className='path-template__header'>
              {/* <i
            className='page-heading__back__button icon icon-small-right icon-rotate-180'
            onClick={history.goBack}
          /> */}
              <div className='path-template__header-info'>
                <div className='path-template__header-info__title'>
                  {headerString(_id !== undefined, goalTemplates.length > 1)}
                </div>
                <div className='path-template__header-info__duration'>
                  <div className='path-template__header-info__duration-title'>
                    <i className='el-icon-time' />
                    Duration:
                  </div>
                  <Input
                    value={duration}
                    onChange={value => {
                      this.handleChange('duration', value)
                    }}
                    placeholder='Duration'
                    onFocus={e => (e.target.placeholder = '')}
                    onBlur={e => (e.target.placeholder = 'Duration')}
                  />
                </div>
              </div>
              {/* <div className='path-template__header-duplicate'>
                <ContentIcon className='duplicate-icon' />
                Duplicate path
              </div> */}
            </div>
            <div className='path-template__form'>
              <div className='path-template__form-inputs'>
                <FormGroup>
                  <Input
                    value={name}
                    placeholder='Enter path title'
                    onChange={value => this.handleChange('name', value)}
                    className={
                      this.state.nameError
                        ? 'error-border'
                        : name !== ''
                        ? 'darker-border'
                        : ''
                    }
                    maxLength={52}
                    onFocus={e => (e.target.placeholder = '')}
                    onBlur={e => (e.target.placeholder = 'Enter path title')}
                  />
                  <div
                    className={
                      this.state.nameError
                        ? 'path-template__form-info--error'
                        : 'path-template__form-info'
                    }
                  >
                    {this.state.nameError
                      ? 'Please provide the learning path name'
                      : 'The title must contain a maximum of 52 characters'}
                  </div>
                  {/* <Input
                value={description}
                placeholder='Provide path details'
                onChange={value => this.handleChange('description', value)}
                type='textarea'
              /> */}
                  <div className={description !== '' ? 'darker-border' : ''}>
                    <TextEditor
                      value={description}
                      placeholder='Provide path details'
                      handleChange={value =>
                        this.handleChange('description', value)
                      }
                      onFocus={e => (e.target.placeholder = '')}
                      onBlur={e =>
                        (e.target.placeholder = 'Provide path details')
                      }
                    />
                  </div>
                </FormGroup>
                <br />
                <SingleTeamSelector
                  teams={teams}
                  selectedTeam={team}
                  handleTeamChange={this.handleTeamChange}
                  leader={currentUser.roles.indexOf('ADMIN') === -1}
                />
              </div>

              {this?.state?.chosenImage?.name ? (
                <div
                  style={{
                    backgroundImage: ` linear-gradient(rgba(
                     0, 0, 0, 0.6), rgba(
                     0, 0, 0, 0.6)), url(${this.state.chosenImageLink})`
                  }}
                  className='path-template__form-upload path-template__form-upload--uploaded'
                >
                  <div
                    className='path-template__form-upload__delete'
                    onClick={this.handleFileDelete}
                  >
                    Delete <i className='el-icon-close'></i>
                  </div>
                  <label htmlFor='file-input' style={{ cursor: 'pointer' }}>
                    <div className='path-template__form-upload__icon path-template__form-upload__icon--uploaded'>
                      <UploadIcon fill='#FFFFFF' />
                    </div>
                  </label>
                  <input
                    id='file-input'
                    type='file'
                    onChange={async e => {
                      await this.handleFileChange(
                        e.target.files[e.target.files.length - 1]
                      )
                    }}
                    style={{ display: 'none' }}
                  />
                  <span>
                    <b>Click</b> to change image
                  </span>
                  <span>JPEG, PNG (max 800x400)</span>
                </div>
              ) : this.state.imageLink ? (
                <div
                  style={{
                    backgroundImage: ` linear-gradient(rgba(
                       0, 0, 0, 0.6), rgba(
                       0, 0, 0, 0.6)), url(${this.state.imageLink})`
                  }}
                  className='path-template__form-upload path-template__form-upload--uploaded'
                >
                  <div
                    className='path-template__form-upload__delete'
                    onClick={this.handleFileDelete}
                  >
                    Delete <i className='el-icon-close'></i>
                  </div>
                  <label htmlFor='file-input' style={{ cursor: 'pointer' }}>
                    <div className='path-template__form-upload__icon path-template__form-upload__icon--uploaded'>
                      <UploadIcon fill='#FFFFFF' />
                    </div>
                  </label>
                  <input
                    id='file-input'
                    type='file'
                    onChange={async e => {
                      await this.handleFileChange(
                        e.target.files[e.target.files.length - 1]
                      )
                    }}
                    style={{ display: 'none' }}
                  />
                  <span>
                    <b>Click</b> to change image
                  </span>
                  <span>JPEG, PNG (max 800x400)</span>
                </div>
              ) : (
                <div className='path-template__form-upload'>
                  <label htmlFor='file-input' style={{ cursor: 'pointer' }}>
                    <div className='path-template__form-upload__icon'>
                      <UploadIcon fill='#556685' />
                    </div>
                  </label>
                  <input
                    id='file-input'
                    type='file'
                    onChange={async e => {
                      await this.handleFileChange(
                        e.target.files[e.target.files.length - 1]
                      )
                    }}
                    style={{ display: 'none' }}
                  />
                  <span>
                    <b>Click</b> to upload preview image
                  </span>
                  <span>JPEG, PNG (max 800x400)</span>
                </div>
              )}
            </div>

            {/* GOAL TEMPLATES OVERVIEW */}
            {this.state.showChangeOrder && (
              <div className='goals-order'>
                <div className='goals-order__goals'>
                  <div className='goals-order__goals-title'>Path Goals</div>
                  <div className='goals-order__goals-number'>
                    {goalTemplates.length}
                  </div>
                </div>
                <div className='goals-order__order-buttons'>
                  <div
                    className='goals-order__order-buttons__confirm'
                    onClick={() =>
                      this.setState({
                        showChangeOrder: !this.state.showChangeOrder
                      })
                    }
                  >
                    <OrderIcon className='order__icon--green' />
                    Confirm
                  </div>
                  <div
                    className='goals-order__order-buttons__reset'
                    onClick={() =>
                      this.setState({
                        showChangeOrder: !this.state.showChangeOrder
                      })
                    }
                  >
                    Cancel
                  </div>
                </div>
              </div>
            )}
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable
                droppableId='goalTemplates'
                isDropDisabled={!this.state.showChangeOrder}
              >
                {provided => (
                  <div
                    className='goal-item__list'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {goalTemplates.map((template, index) => {
                      const { content, mentors, tasks } = template
                      const developmentPlan = { content, mentors, tasks }
                      const selectorProps = {
                        skills: template.relatedSkills,
                        onSkillsSubmit: selected =>
                          this.handleSettingRelatedSkills(index, selected),
                        clearState: true,
                        buttonValue:
                          template.relatedSkills.length > 0
                            ? 'Change'
                            : 'Click to choose',
                        buttonClass:
                          template.relatedSkills.length > 0
                            ? 'list-skill-selector__button-input--selected'
                            : 'list-skill-selector__button-input'
                        // neededSkillsSelector: true
                      }
                      return (
                        <Draggable
                          key={index}
                          draggableId={`template.${index}`}
                          index={index}
                          isDragDisabled={!this.state.showChangeOrder}
                        >
                          {provided => (
                            <div
                              className='goal-item__list-item'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              key={index}
                            >
                              <GoalItemEdit
                                key={`template.${index}`}
                                goalIndex={index}
                                {...template}
                                developmentPlan={developmentPlan}
                                {...handlers}
                                initialGoalNo={1}
                                handleContentChangingOrder={
                                  this.handleContentChangingOrder
                                }
                                handleContentDetailsChange={
                                  this.handleContentDetailsChange
                                }
                                total={goalTemplates.length}
                                selectorProps={selectorProps}
                                active
                                showLPIndex
                                setShowChangeOrder={() =>
                                  this.setState({
                                    showChangeOrder: !this.state.showChangeOrder
                                  })
                                }
                                showChangeOrder={this.state.showChangeOrder}
                                handleDeleteContent={this.handleDeleteContent}
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {!this.state.showChangeOrder && (
              <div
                style={{
                  position: 'relative',
                  bottom: '27px',
                  textAlign: 'left',
                  zIndex: '3'
                }}
              >
                <Button
                  type='primary'
                  className='el-button--lilac'
                  onClick={this.handleAddingTemplate}
                >
                  <img src={PlusCircle} alt='plus circle image' />
                  Add another goal
                </Button>
              </div>
            )}
            <Submit
              label={buttonLabel(_id !== undefined, goalTemplates.length > 1)}
              data={this.state}
              validate={handlers.validate}
              callback={handlers.onSave}
              goBack={history.goBack}
              props={this.props}
              setState={newObject => {
                this.setState({ ...newObject })
              }}
            />
            <style jsx>{pathTemplateFormStyle}</style>
          </div>
        )}
      </>
    )
  }
}

export default props => {
  return (
    <ApolloConsumer>
      {client => {
        return <PathForm {...props} client={client} />
      }}
    </ApolloConsumer>
  )
}
