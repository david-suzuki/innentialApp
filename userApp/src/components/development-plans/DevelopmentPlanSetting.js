import React, { useEffect, Component, useState } from 'react'
import developmentPlanStyle from '../../styles/developmentPlanStyle'
import bottomNavStyle from '../../styles/bottomNavStyle'
import { Button, Checkbox, MessageBox, Notification } from 'element-react'
import {
  Statement,
  LearningContentSearchBar,
  DevelopmentPlanSettingTabs
  // MobilePreferences
} from '../ui-components'
import { UploadManager, ContentEdit } from '../learning-content/components'
import { Mutation, useMutation, useQuery } from 'react-apollo'
import {
  disableApprovalPrompt,
  fetchDevelopmentPlanRelatedContent,
  onboardingMutation,
  setDevelopmentPlan,
  updateGoalRelatedSkills,
  fetchContentPlanForGoal
  // fetchUserGoals,
  // fetchContentPlanForGoal
} from '../../api'

import { LoadingSpinner, captureFilteredError } from '../general'
import Container from '../../globalState'
import history from '../../history'
import UploadWhiteIcon from '$/static/upload-white.svg'
import { FiltersNew } from '../learning-content/components/filters'
// import { DevelopmentPlanGoalSelect } from './components'

const mapRelatedSkills = ({ _id, name, frameworkId, category }) => ({
  _id,
  name,
  frameworkId,
  category,
  level: NaN
})

const ContentList = ({
  neededSkills,
  userId,
  searchedContent = [],
  searchedAnything,
  selectedContent,
  selectedMentors,
  onSelect,
  setContentUploadVisible,
  limit,
  setLimit,
  goToRecommended,
  isOnGoalSetting,
  // fetchPolicy,
  filters,
  onEdit,
  setOrder,
  setContentOrder,
  handleChangingNote
}) => {
  // const [fetchPolicy, setFetchPolicy] = useState('cache-and-network')

  const { data, error, loading, fetchMore } = useQuery(
    fetchDevelopmentPlanRelatedContent,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        neededSkills,
        limit: 10,
        userId,
        filters,
        inPath: isOnGoalSetting
      }
    }
  )

  // const [dataContent, setDataContent] = useState([])

  // useEffect(() => {
  //   if (!dataContent.length && data) {
  //     if (error) {
  //       captureFilteredError(error)
  //       return <Statement content='Oops! Something went wrong' />
  //     }
  //   }

  //   if (data && data.fetchDevelopmentPlanRelatedContent) {
  //     const {
  //       fetchDevelopmentPlanRelatedContent: {
  //         relatedContentLength,
  //         relatedContent,
  //         relatedMentors,
  //         recommended,
  //         savedForLater
  //       }
  //     } = data

  //     const content =
  //       searchedContent.length > 0 ? searchedContent : relatedContent

  //     const searchedContentIds = searchedContent.map(s => s._id)

  //     setDataContent(content)
  //   }
  // }, [data, error, loading, fetchMore])

  // useEffect(() => {
  //   setFetchPolicy('cache-and-network')
  // }, [filters])

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data && data.fetchDevelopmentPlanRelatedContent) {
    const {
      fetchDevelopmentPlanRelatedContent: {
        relatedContentLength,
        relatedContent,
        relatedMentors,
        recommended,
        savedForLater,
        totalRelatedContent
      }
    } = data

    const content =
      searchedContent.length > 0 ? searchedContent : relatedContent

    const searchedContentIds = searchedContent.map(s => s._id)

    if (
      content.length === 0 ||
      (searchedAnything && searchedContent.length === 0)
    ) {
      window.Intercom('update', { 'Needs Learning': true })
    }

    return (
      <DevelopmentPlanSettingTabs
        relatedContentLength={relatedContentLength}
        content={content}
        totalRelatedContent={totalRelatedContent}
        searchedContentIds={searchedContentIds}
        // recommended={recommended}
        mentors={relatedMentors}
        onSelect={onSelect}
        selectedContent={selectedContent}
        selectedMentors={selectedMentors}
        // selectedGoalId={selectedGoalId}
        neededSkills={
          neededSkills
          /* selectedGoalId ? selectedGoalSkills : neededSkills */
        }
        setContentUploadVisible={setContentUploadVisible}
        limit={limit}
        setLimit={setLimit}
        fetchMore={fetchMore}
        recommended={recommended}
        goToRecommended={goToRecommended}
        filters={filters}
        savedForLater={savedForLater}
        onEdit={onEdit}
        isOnGoalSetting={isOnGoalSetting}
        setOrder={setOrder}
        setContentOrder={setContentOrder}
        handleChangingNote={handleChangingNote}
      />
    )
  }
  return loading && <LoadingSpinner />
}

class DevelopmentPlanSetting extends Component {
  constructor(props) {
    super(props)
    const { selectedContent = [], selectedMentors = [] } = props

    this.state = {
      onContentUpload: false,
      editingContent: null,
      // recommended: selectedContent,
      selectedContent,
      selectedMentors,
      searchedContent: [],
      // selectedGoalId: null,
      selectedGoalSkills: [],
      timeout: false,
      limit: 10,
      disablePrompt: false,
      redirectToFeedback: false
    }
  }

  timeoutForNotification = null
  timeoutForIntercom = null

  componentDidMount = () => {
    window.scrollTo(0, 0)
    if (this.props.addContent)
      this.addContentToDevelopmentPlan(this.props.addContent)

    this.timeoutForIntercom = setTimeout(() => {
      if (this.state.selectedContent.length === 0)
        window.Intercom('update', { 'Needs Learning': true })
    }, 30000)

    this.props.setDisplayFilters(false)
    // const mainWrapper = document.getElementById('main-wrapper')
    // mainWrapper.className = 'container-main__wrapper wrapper--right'
  }

  // componentWillReceiveProps = ({ selectedContent }) => {
  //   this.setState(({ selectedContent: [...selectedContent] }))
  // }

  componentWillUnmount = () => {
    clearTimeout(this.timeoutForNotification)
    clearTimeout(this.timeoutForIntercom)
    this.props.setDisplayFilters(false)
    // const mainWrapper = document.getElementById('main-wrapper')
    // mainWrapper.className = 'container-main__wrapper wrapper'
  }

  isSelected = (id, key) => {
    return this.state[key].some(({ _id: selectedId }) => id === selectedId)
  }

  selectCallback = () => {
    if (this.props.isDashboardDraft) return

    const { selectedContent, selectedMentors, timeout } = this.state
    if (this.props.isOnGoalSetting || this.props.isOnGoalApproval) {
      this.props.setPlanForGoal(selectedContent, selectedMentors)
    }
    if (!this.props.isOnGoalSetting) {
      this.mutateDevelopmentPlan()
    } else {
      if (!timeout) {
        Notification({
          type: 'info',
          message:
            'Your development plan will be saved once you finish editing the path',
          duration: 2500,
          offset: 90,
          iconClass: 'el-icon-info'
        })
        this.setState(
          {
            timeout: true
          },
          () => {
            this.timeoutForNotification = setTimeout(
              () => this.setState({ timeout: false }),
              3000
            )
          }
        )
      }
    }
  }

  onSelect = async (item, key) => {
    const setBy = this.props.currentUser?._id || null
    if (!this.isSelected(item._id, key)) {
      if (
        item.needsApproval &&
        !this.props.currentUser.approvalPromptDisabled
      ) {
        try {
          await MessageBox.confirm(
            <div>
              This learning item will need to be approved by an admin first.
              Would you still like to add it to your development plan?
              <div className='align-left' style={{ paddingTop: '15px' }}>
                <Checkbox
                  checked={this.state.disablePrompt}
                  onChange={value => this.setState({ disablePrompt: value })}
                >
                  Don't show me this again
                </Checkbox>
              </div>
            </div>,
            'This item requires approval',
            {
              showClose: false,
              cancelButtonText: 'No',
              confirmButtonText: 'Yes'
            }
          )
          const { goalId } = this.props
          this.setState(
            {
              [key]: [...this.state[key], { ...item, goalId, setBy }]
            },
            this.selectCallback
          )
        } catch (e) {}
        if (this.state.disablePrompt) {
          await this.props.disableMutation()
        }
      } else {
        const { goalId } = this.props
        this.setState(
          {
            [key]: [...this.state[key], { ...item, goalId, setBy }]
          },
          this.selectCallback
        )
      }
    } else {
      const newItems = this.state[key].filter(
        ({ _id: selectedId }) => item._id !== selectedId
      )
      if (
        !this.props.isOnGoalSetting &&
        newItems.every(({ status }) => status === 'COMPLETED')
      ) {
        try {
          await MessageBox.confirm(
            `All remaining items are completed. Removing this one will close the goal. Are you sure you want to continue?`,
            'This is the last remaining item',
            {
              showClose: false,
              cancelButtonText: 'No',
              confirmButtonText: 'Yes',
              type: 'warning'
            }
          )
        } catch (err) {
          return
        }
      }
      this.setState(
        {
          [key]: newItems
        },
        this.selectCallback
      )
    }
  }
  mutateGoalRelatedSkills = async skills => {
    this.props
      .updateGoalRelatedSkillsMutation({
        variables: {
          goalId: this.props.goalId,
          skills: skills.map(skill => {
            return skill._id
          })
        },
        refetchQueries: [
          {
            query: fetchContentPlanForGoal,
            variables: {
              goalId: this.props.goalId
            }
          }
        ]
      })
      .then(res => {
        if (res?.data?.updateGoalRelatedSkills) {
          Notification({
            type: 'success',
            message: 'Your changes have been saved',
            duration: 2500,
            offset: 90
          })
        } else {
          Notification({
            type: 'warning',
            message: 'Oops! Something went wrong',
            duration: 2500,
            offset: 90
          })
        }
      })
      .catch(e => {
        Notification({
          type: 'warning',
          message: 'Oops! Something went wrong',
          duration: 2500,
          offset: 90
        })
      })
  }
  mutateDevelopmentPlan = async () => {
    const { user, goalId, status: goalStatus /*, reviewId */ } = this.props
    const { selectedContent, selectedMentors } = this.state

    const inputData = {
      user,
      goalId,
      content: selectedContent.map(
        ({
          _id: contentId,
          type: contentType,
          status,
          setBy,
          approved,
          price: { value: price },
          note,
          availableWithSubscription
        }) => {
          return {
            contentId,
            contentType,
            goalId,
            status: status || (goalStatus === 'DRAFT' ? 'INACTIVE' : null),
            setBy,
            approved,
            price,
            note,
            subscriptionAvailable: availableWithSubscription
          }
        }
      ),
      mentors: selectedMentors.map(({ _id: mentorId, goalId }) => ({
        mentorId,
        goalId
      }))
    }

    try {
      const {
        data: { setDevelopmentPlan: goal }
      } = await this.props.setDevelopmentPlanMutation({
        variables: {
          inputData
        }
      })
      if (!this.state.timeout) {
        if (goal?.status === 'PAST') {
          this.setState({
            redirectToFeedback: () =>
              history.replace('/goal-feedback', {
                skills: goal.relatedSkills.map(mapRelatedSkills),
                onlyGoal: goal.isUserOnlyGoal,
                result: goal
              })
          })
          Notification({
            type: 'success',
            message:
              'All remaining items have been completed. The goal will now close.',
            duration: 2500,
            offset: 90
          })
        } else {
          Notification({
            type: 'success',
            message: 'Your changes have been saved',
            duration: 2500,
            offset: 90
          })
        }
        this.setState(
          {
            timeout: true
          },
          () => setTimeout(() => this.setState({ timeout: false }), 3000)
        )
      }

      return true
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'warning',
        message: 'Oops! Something went wrong',
        duration: 2500,
        offset: 90
      })
      return false
    }
  }

  setContentUploadVisible = (value, type) => {
    // this.props.setDisplayFilters(!value)
    this.setState({ onContentUpload: value, contentType: type })
  }

  setSearchedContent = value => {
    this.setState({ searchedContent: value })
  }

  setLimit = value => {
    this.setState({
      limit: value
    })
  }

  addContentToDevelopmentPlan = async content => {
    if (!this.isSelected(content._id, 'selectedContent')) {
      this.onSelect(content, 'selectedContent')
      return 0
    } else {
      return 1
    }
  }

  setEditingContent = contentId => {
    // this.props.setDisplayFilters(!contentId)
    this.setState({ editingContent: contentId })
  }

  setOrder = (contentIx, direction) => {
    this.setState(
      ({ selectedContent }) => {
        const copy = [...selectedContent]

        const content = copy[contentIx]

        copy.splice(contentIx, 1)
        copy.splice(contentIx + direction, 0, content)

        return {
          selectedContent: copy
        }
      },
      () => {
        this.props.setPlanForGoal(
          this.state.selectedContent,
          this.state.selectedMentors
        )
      }
    )
  }

  setContentOrder = contentOrder => {
    this.setState(
      ({ selectedContent }) => {
        const copy = [...contentOrder]

        return {
          selectedContent: copy
        }
      },
      () => {
        this.props.setPlanForGoal(
          this.state.selectedContent,
          this.state.selectedMentors
        )
      }
    )
  }

  handleEditSubmit = content => {
    const contentId = this.state.editingContent

    const ix = this.state.selectedContent.findIndex(
      item => item._id === contentId
    )

    if (ix !== -1) {
      const items = this.state.selectedContent
      if (content) {
        items.splice(ix, 1, content)
      } else {
        items.splice(ix, 1)
      }
      this.setState({
        selectedContent: items
      })
      this.setEditingContent(null)
    }
  }
  handleChangingNote = async (contentId, value) => {
    clearTimeout(this.timer)
    let contents = this.state.selectedContent
    let contentIndex
    let selectedContent = contents.find((content, i) => {
      if (content._id === contentId) {
        contentIndex = i
      }
      return content._id === contentId
    })
    selectedContent = { ...selectedContent, note: value }
    contents.splice(contentIndex, 1, selectedContent)
    this.setState({ ...this.state, selectedContent: contents })

    if (!this.props.isOnGoalSetting) {
      this.timer = await setTimeout(async () => {
        await this.mutateDevelopmentPlan()
      }, 1000)
    }
  }
  render() {
    const {
      onContentUpload,
      editingContent,
      // recommended,
      selectedContent,
      selectedMentors,
      searchedContent,
      // selectedGoalId,
      // selectedGoalSkills,
      contentType,
      limit,
      searchedAnything,
      redirectToFeedback
      // fetchPolicy
    } = this.state

    const {
      onBackButtonClick = function() {},
      handleSavePlan = function() {},
      children,
      neededSkills,
      extraSkills,
      user: userId,
      currentUser,
      goToRecommended,
      filters,
      noBackButton,
      isOnGoalSetting
    } = this.props

    const contentListProps = {
      neededSkills: [...neededSkills, ...extraSkills],
      userId,
      // fetchPolicy,
      searchedContent,
      searchedAnything,
      selectedContent,
      selectedMentors,
      onSelect: this.onSelect,
      setContentUploadVisible: this.setContentUploadVisible,
      limit,
      setLimit: this.setLimit,
      goToRecommended,
      filters,
      onEdit: this.setEditingContent,
      isOnGoalSetting,
      setOrder: this.setOrder,
      setContentOrder: this.setContentOrder,
      handleChangingNote: this.handleChangingNote
    }

    if (onContentUpload) {
      return (
        <div>
          <UploadManager
            addContentToDevelopmentPlan={this.addContentToDevelopmentPlan}
            backToDevelopmentPlan={() => this.setContentUploadVisible(false)}
            contentType={contentType}
            inDevelopmentPlan
            currentUser={currentUser}
          />
          <style jsx>{developmentPlanStyle}</style>
        </div>
      )
    } else if (editingContent) {
      return (
        <div style={{ maxWidth: '640px', margin: '0px auto' }}>
          <div className='page-heading'>
            <i
              className='page-heading__back__button icon icon-small-right icon-rotate-180'
              onClick={() => this.setEditingContent(null)}
            />
            <div className='page-heading-info'>
              <h1>Learning item edit</h1>
            </div>
          </div>
          <ContentEdit
            contentId={editingContent}
            handleSubmit={this.handleEditSubmit}
          />
        </div>
      )
    } else {
      return (
        <div>
          {children}
          <div className='development-plan__milestones-wrapper'>
            <div className='development-plan__milestones-heading setting-heading'>
              <div>Add content to your goal</div>
            </div>
            <div className='development-plan__milestones__search-container'>
              <div className='development-plan__milestones__search-bar'>
                <LearningContentSearchBar
                  setDisplayedContent={content =>
                    this.setSearchedContent(content)
                  }
                  dontDisplayContent
                  setInitiallySearched={() =>
                    this.setState({ searchedAnything: true })
                  }
                  setNoMoreContent={() => {}}
                />
              </div>
              <Button
                className='development-plan__workshop-button el-buttton el-button--green'
                onClick={() => this.setContentUploadVisible(true)}
              >
                <img src={UploadWhiteIcon} alt='upload image' />
                Add own content
              </Button>
            </div>
            <div className='development-plan__filters'>
              <FiltersNew
                handleSettingRelatedSkills={
                  this.props.handleSettingRelatedSkills ||
                  this.props.setRelatedSkills ||
                  (!isOnGoalSetting && this.mutateGoalRelatedSkills)
                }
                activeTemplate={this.props.activeTemplate}
              />
            </div>
            <div className='development-plan__content-list'>
              {neededSkills.length > 0 ? (
                <ContentList {...contentListProps} />
              ) : (
                <Statement content='Select a skill to get started' />
              )}
            </div>
            <div className='development-plan__heading development-plan__heading--fixed'>
              {noBackButton ? (
                <div />
              ) : (
                <div
                  onClick={
                    typeof redirectToFeedback === 'function'
                      ? redirectToFeedback
                      : onBackButtonClick
                  }
                  className='bottom-nav__previous'
                >
                  <i className='development-plan__back-button icon icon-small-right icon-rotate-180' />
                  <span>Back</span>
                </div>
              )}
              {/* <i
                className='development-plan__back-button icon icon-small-right icon-rotate-180'
                onClick={onBackButtonClick}
              /> */}
              <div className='development-plan__heading-info'>
                {/* <h1>Development Plan</h1> */}
              </div>
              {this.props.saveButton && (
                <>
                  <Button
                    className='development-plan__save-button development-plan__save-button--desktop'
                    type='success'
                    onClick={handleSavePlan}
                  >
                    Confirm
                  </Button>
                  <Button
                    className='development-plan__save-button development-plan__save-button--mobile'
                    type='success'
                    onClick={handleSavePlan}
                  >
                    <img src={require('../../static/check.svg')} alt='check' />
                  </Button>
                </>
              )}
            </div>
          </div>
          <style>{bottomNavStyle}</style>
          <style jsx>{developmentPlanStyle}</style>
        </div>
      )
    }
  }
}

export default props => {
  const {
    setNeededSkills,
    setUser,
    filters,
    extraSkills = [],
    setDisplayFilters,
    setInDPSetting
  } = Container.useContainer()

  useEffect(() => {
    setUser(props.user)
    setInDPSetting(true)
  }, [])

  useEffect(() => {
    setNeededSkills(props.neededSkills)
  }, [props.neededSkills])

  const [disableMutation] = useMutation(disableApprovalPrompt)
  const [updateGoalRelatedSkillsMutation] = useMutation(updateGoalRelatedSkills)

  return (
    <Mutation mutation={setDevelopmentPlan}>
      {setDevelopmentPlanMutation => (
        <DevelopmentPlanSetting
          {...props}
          extraSkills={extraSkills}
          filters={filters}
          setDevelopmentPlanMutation={setDevelopmentPlanMutation}
          updateGoalRelatedSkillsMutation={updateGoalRelatedSkillsMutation}
          setDisplayFilters={setDisplayFilters}
          disableMutation={disableMutation}
        />
      )}
    </Mutation>
  )
}
