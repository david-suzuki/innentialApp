import React, { useContext, useEffect, useState } from 'react'
import {
  DevelopmentPlanContent,
  DevelopmentPlanWorkshop,
  NoteBox,
  remapLearningContentForUI,
  ChooseYourReasonBox,
  LearningItemFeedbackBox,
  LearningItemDashboard
} from './'
import { LoadingSpinner, captureFilteredError } from '../general'
import Container from '../../globalState'
import { useMutation } from 'react-apollo'
import {
  setGoalStatus,
  removeItemFromDevPlan,
  moveToSavedForLater,
  requestLearningContent,
  fetchUserGoals,
  requestLearningContentDelivery,
  addLearningItemFeedback
} from '../../api'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { MessageBox, Notification, Button } from 'element-react'
import { useHistory } from 'react-router-dom'
import actionDropdownStyle from '../../styles/actionDropdownStyle'
import { ReactComponent as OrderIcon } from '../../static/order-icon.svg'
import { UserContext } from '../../utils'

const ActionDropdown = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z'
        fill='#8C88C4'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z'
        fill='#8C88C4'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12Z'
        fill='#8C88C4'
      />
    </svg>
  )
}

const mapRelatedSkills = ({ _id, name, frameworkId, category }) => ({
  _id,
  name,
  frameworkId,
  category,
  level: NaN
})

const checkIfGoalShouldComplete = async ({
  goal,
  goalStatusMutation,
  history
}) => {
  if (goal?.developmentPlan?.content) {
    const {
      developmentPlan: { content }
    } = goal

    if (content.every(({ status }) => status === 'COMPLETED')) {
      const {
        data: { setGoalStatus: result }
      } = await goalStatusMutation({
        variables: {
          goalId: goal._id,
          status: 'PAST'
        }
      })
      window.analytics &&
        window.analytics.track('finished_goal', {
          goalId: goal._id
        })
      history.push('/goal-feedback', {
        skills: result.relatedSkills.map(mapRelatedSkills),
        finishedPath: result.finishedPath,
        onlyGoal: result.isUserOnlyGoal,
        result
      })
    }
  } else {
    throw new Error(`There was an issue with completing user goal`)
  }
}

const getMinutes = duration => {
  if (duration) {
    let { basis, hoursMin, hoursMax, hours, minutes, weeks } = duration
    if (basis === 'PER WEEK') {
      if (!weeks) {
        weeks = 4
      }
      const averageTimePerWeek = (hoursMin + hoursMax) / 2
      const totalTime = averageTimePerWeek * weeks

      return totalTime * 60
    } else if (hours || minutes) {
      return (hours || 0) * 60 + (minutes || 0)
    }
  }
  return null
}

const DashboardItems = ({ heading, content, notHighlight }) => (
  <>
    <div
      className='development-plan__status-heading'
      style={{ background: 'transparent' }}
    >
      <div style={{ position: 'relative' }}>
        {heading} <span className='numbers'>{content.length}</span>
      </div>
    </div>
    {content.map((c, i) => (
      <LearningItemDashboard
        idx={i}
        contentStatus={
          c?.status.toLowerCase().replaceAll(' ', '-') || 'not-started'
        }
        notHighlight={notHighlight}
        key={`${c._id}:${i}`}
        {...c}
      />
    ))}
  </>
)

export default ({
  content = [],
  inManagement,
  inSummary,
  onSelect = () => {},
  limit,
  // contentKey,
  neededSkills = [],
  setContentStatusMutation,
  setLimit,
  fetchMore,
  displayCompleted,
  isSearching,
  canRecommend,
  children,
  filters,
  setLibraryHighlight,
  setHighlightCompleted,
  pathId,
  selectedGoalId,
  onEdit,
  isOnGoalSetting,
  setOrder,
  draggable,
  showChangeOrderOptions,
  setContentOrder,
  confirmOrder,
  handleChangingNote,
  totalRelatedContent
}) => {
  const { _id: userId } = useContext(UserContext)
  let timeout = null

  const initialFeedbackValue = 0
  const initialInteresting = null

  // LEARNING FEEDBACK STATE
  const [canSetStatus, setCanSetStatus] = useState(true)
  const [submitId, setSubmitId] = useState(null)
  const [value, setValue] = useState(initialFeedbackValue)
  const [interesting, setInteresting] = useState(initialInteresting)
  const [showCompleted, setShowCompleted] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(false)
  const [limitState, setLimitState] = useState(limit)

  // const container = Container.useContainer()

  const history = useHistory()

  useEffect(() => {
    return () => {
      clearTimeout(timeout)
    }
  })

  useEffect(() => {
    setShowCompleted(false)
  }, [selectedGoalId])

  const [goalStatusMutation] = useMutation(setGoalStatus)
  const [removeItemMutation] = useMutation(removeItemFromDevPlan)
  const [saveForLaterMutation] = useMutation(moveToSavedForLater)
  const [requestMutation] = useMutation(requestLearningContent)
  const [requestDeliveryMutation] = useMutation(requestLearningContentDelivery)
  const [addLearningItemFeedbackMutation] = useMutation(addLearningItemFeedback)

  useEffect(() => {
    // WORKAROUND TO PREVENT MEMORY LEAK WHEN SUBMITTING
    ;(async () => {
      if (submitId) {
        const contentId = submitId
        setSubmitId(null)
        await addLearningItemFeedbackMutation({
          variables: {
            value,
            interesting,
            contentId
          }
        })
        Notification({
          type: 'success',
          message: `Thank you for your feedback!`,
          duration: 2500,
          offset: 90
        })
        // ADD HOTJAR METRIC
        window.hj &&
          window.hj('identify', userId, {
            'Gave learning feedback': true
          })

        // KEY EVENT TRACKING
        window.analytics
          ? window.analytics.track('rated_content', {
              contentId,
              relevant: interesting,
              value: value > 0 ? value : null
            })
          : captureFilteredError(`Segment interface empty`)

        setValue(initialFeedbackValue)
        setInteresting(initialInteresting)
      }
    })()
  }, [submitId, value, interesting])

  const handleRequestingFulfillment = async (contentId, content) => {
    try {
      await MessageBox.confirm(
        'Once requested, this item will be purchased using your learning budget. It should arrive within 1-2 working days.',
        'Request this item?',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          showClose: false,
          type: 'warning'
        }
      )
      try {
        await requestDeliveryMutation({
          variables: { contentId },
          update: (
            cache,
            { data: { requestLearningContentDelivery: fulfillmentRequest } }
          ) => {
            try {
              const { fetchUserGoals: goals } = cache.readQuery({
                query: fetchUserGoals
              })

              const goalIndex = goals.findIndex(
                ({ _id }) => _id === selectedGoalId
              )
              const goal = goals[goalIndex]

              goals.splice(goalIndex, 1, {
                ...goal,
                developmentPlan: {
                  ...goal.developmentPlan,
                  content: goal.developmentPlan.content.map(
                    ({ content, ...rest }) => {
                      if (content._id === contentId) {
                        return {
                          ...rest,
                          content,
                          fulfillmentRequest
                        }
                      }
                      return {
                        content,
                        ...rest
                      }
                    }
                  )
                }
              })

              cache.writeQuery({
                query: fetchUserGoals,
                data: {
                  fetchUserGoals: [...goals]
                }
              })
            } catch (err) {
              console.error(err)
            }
          }
        })

        window.analytics &&
          window.analytics.track('requested_fulfillment', {
            contentId,
            value: content?.price?.value || 0
          })

        Notification({
          type: 'success',
          message: `Our delivery team has been notified about your request. We'll realise it as soon as possible`,
          duration: 2500,
          offset: 90
        })
      } catch (e) {
        captureFilteredError(e)
        Notification({
          type: 'error',
          message: `Oops, something went wrong!`,
          duration: 2500,
          offset: 90,
          iconClass: 'el-icon-error'
        })
      }
    } catch (e) {
      /* CANCELLED */
    }
  }

  const handleSettingStatus = async ({ variables, content }) => {
    if (canSetStatus) {
      try {
        setCanSetStatus(false)

        const {
          data: { setContentStatus: goal }
        } = await setContentStatusMutation({
          variables
        })

        // ADD HOTJAR METRIC
        window.hj &&
          window.hj('identify', userId, {
            'Changed learning status': true
          })

        if (variables.status === 'COMPLETED') {
          setLibraryHighlight(true)
          setHighlightCompleted(true)
          try {
            await MessageBox.alert(
              <LearningItemFeedbackBox
                initialFeedbackValue={initialFeedbackValue}
                initialInteresting={initialInteresting}
                setValue={setValue}
                setInteresting={setInteresting}
              />,
              ' ',
              {
                confirmButtonText: 'Send feedback',
                customClass: 'learning-feedback-messagebox',
                confirmButtonClass: 'learning-feedback-messagebox_button',
                showClose: true
              }
            )
            setSubmitId(variables.contentId)
          } catch (err) {
            setValue(initialFeedbackValue)
            setInteresting(initialInteresting)
          }
          Notification({
            type: 'success',
            message: `You can view your completed items in the Library`,
            duration: 2500,
            offset: 90
          })
        }

        const durationInMinutes = getMinutes(content.duration)

        window.analytics &&
          window.analytics.track(
            variables.status === 'COMPLETED'
              ? 'finished_content'
              : 'started_content',
            {
              contentId: variables.contentId,
              duration: durationInMinutes
            }
          )
        window.analytics &&
          window.analytics.track('bump_content', {
            contentId: variables.contentId
          })

        await checkIfGoalShouldComplete({
          goal,
          goalStatusMutation,
          history
        })
      } catch (e) {
        captureFilteredError(e)
      } finally {
        setCanSetStatus(true)
      }
    }
  }

  const handleSavingForLater = async contentId => {
    try {
      await saveForLaterMutation({
        variables: { contentId }
      }).then(() => {
        setLibraryHighlight(true)
        Notification({
          type: 'success',
          message: `The item has been saved in your private list`,
          duration: 2500,
          offset: 90
        })
      })
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-error'
      })
    }
  }

  const handleRemoving = async (contentId, showPopup) => {
    const callback = async () => {
      try {
        const {
          data: { removeItemFromDevPlan: goal }
        } = await removeItemMutation({
          variables: { contentId }
        })
        Notification({
          type: 'success',
          message: `The item has been removed from your development plan`,
          duration: 2500,
          offset: 90
        })
        window.analytics &&
          window.analytics.track('skipped_content', {
            contentId,
            pathId
          })
        await checkIfGoalShouldComplete({
          goal,
          goalStatusMutation,
          history
        })
      } catch (e) {
        captureFilteredError(e)
        Notification({
          type: 'error',
          message: `Oops, something went wrong!`,
          duration: 2500,
          offset: 90,
          iconClass: 'el-icon-error'
        })
      }
    }
    if (showPopup) {
      try {
        await MessageBox.confirm(
          '',
          'Are you sure you want to skip this learning item?',
          {
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'No, keep it',
            showClose: false,
            type: 'warning'
          }
        )
        await callback()
        if (pathId)
          timeout = setTimeout(() => {
            try {
              MessageBox.alert(
                <ChooseYourReasonBox pathId={pathId} contentId={contentId} />,
                'Tell us the reason behind your decision',
                {
                  showClose: true,
                  showConfirmButton: false
                }
              )
            } catch (e) {}
          }, 50)
      } catch (e) {}
    } else await callback()
  }

  const handleRequesting = async (contentId, content) => {
    try {
      await requestMutation({
        variables: { contentId },
        update: (cache, { data: { requestLearningContent: request } }) => {
          try {
            const { fetchUserGoals: goals } = cache.readQuery({
              query: fetchUserGoals
            })

            const goalIndex = goals.findIndex(
              ({ _id }) => _id === selectedGoalId
            )
            const goal = goals[goalIndex]

            goals.splice(goalIndex, 1, {
              ...goal,
              developmentPlan: {
                ...goal.developmentPlan,
                content: goal.developmentPlan.content.map(
                  ({ content, ...rest }) => {
                    if (content._id === contentId) {
                      return {
                        ...rest,
                        content,
                        request
                      }
                    }
                    return {
                      content,
                      ...rest
                    }
                  }
                )
              }
            })

            cache.writeQuery({
              query: fetchUserGoals,
              data: {
                fetchUserGoals: [...goals]
              }
            })
          } catch (e) {
            console.error(e)
          }
        }
      })
      Notification({
        type: 'success',
        message: `Item has been requested`,
        duration: 2500,
        offset: 90
      })
      window.analytics &&
        window.analytics.track('requested_content', {
          contentId,
          value: content?.price?.value || 0
        })
      window.analytics &&
        window.analytics.track('bump_content', {
          contentId
        })
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-error'
      })
    }
  }

  if (inManagement || inSummary) {
    content.sort((a, b) => {
      return a.order - b.order
    })

    const handlers = {
      setInProgress: (contentId, content) =>
        handleSettingStatus({
          variables: { status: 'IN PROGRESS', contentId },
          content
        }),
      setCompleted: (contentId, content) =>
        handleSettingStatus({
          variables: { status: 'COMPLETED', contentId },
          content
        }),
      handleSkip: handleRemoving,
      handleRequesting,
      handleRequestingFulfillment,
      handleSavingForLater
    }

    const inProgressContent = content
      .filter(({ status }) => status === 'IN PROGRESS')
      .map(content => {
        const { goalName, goalId, goalCompleted, goalEnds, note } = content
        const goalInfo =
          !!goalId && !!goalName
            ? { goalName, goalId, goalCompleted, goalEnds }
            : null
        return {
          ...remapLearningContentForUI({
            content,
            neededWorkSkills: neededSkills,
            options: [],
            goalInfo
          }),
          skillTags: [],
          note,
          ...handlers
        }
      })

    const completedContent = content
      .filter(({ status }) => status === 'COMPLETED')
      .map(content => {
        const { goalName, goalId, goalCompleted, goalEnds, note } = content

        const goalInfo =
          !!goalId && !!goalName
            ? { goalName, goalId, goalCompleted, goalEnds }
            : null
        return {
          ...remapLearningContentForUI({
            content,
            neededWorkSkills: neededSkills,
            options: [],
            goalInfo
          }),
          skillTags: [],
          note,
          ...handlers
        }
      })

    const notStartedContent = content
      .filter(
        ({ status }) =>
          status === 'NOT STARTED' ||
          status === 'INACTIVE' ||
          status === 'AWAITING FULFILLMENT'
      )
      .map(content => {
        const { goalName, goalId, goalCompleted, goalEnds, note } = content
        const goalInfo =
          !!goalId && !!goalName
            ? { goalName, goalId, goalCompleted, goalEnds }
            : null
        return {
          ...remapLearningContentForUI({
            content,
            neededWorkSkills: neededSkills,
            options: [],
            goalInfo
            // cta: status === 'NOT STARTED' && !!approved,
            // status,
            // updateStatus: contentId =>
            //   handleSettingStatus({
            //     variables: { status: 'IN PROGRESS', contentId }
            //   })
          }),
          skillTags: [],
          note,
          ...handlers
        }
      })

    return (
      <div>
        <style jsx>{actionDropdownStyle}</style>
        {Array.isArray(completedContent) && completedContent.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              top: '-63px',
              right: '0px',
              position: 'absolute'
            }}
          >
            {(notStartedContent.length > 0 || inProgressContent.length > 0) && (
              <>
                <Button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className='development-plan__completed'
                >
                  <span className='development-plan__completed__span'>
                    {!showCompleted ? 'See completed' : 'Go Back to Active'}
                  </span>
                </Button>
                <Button
                  onClick={() => setActiveDropdown(!activeDropdown)}
                  className='development-plan__completed-mobile'
                >
                  <ActionDropdown />
                </Button>
              </>
            )}
            <div
              className={
                activeDropdown ? 'action-dropdown is-active' : 'action-dropdown'
              }
            >
              <ul>
                <li onClick={() => setShowCompleted(!showCompleted)}>
                  <span className='development-plan__completed__span'>
                    {!showCompleted ? 'See completed' : 'Go Back to Active'}
                  </span>
                </li>
              </ul>
            </div>
            <div>{children}</div>
          </div>
        )}
        {(showCompleted ||
          (notStartedContent.length === 0 && inProgressContent.length === 0)) &&
          Array.isArray(completedContent) &&
          completedContent.length > 0 && (
            <>
              {completedContent.map((c, i) => (
                <LearningItemDashboard idx={i} key={`${c._id}:${i}`} {...c} />
              ))}
            </>
          )}
        {!showCompleted &&
          (notStartedContent.length > 0 || inProgressContent.length > 0) && (
            <>
              {inProgressContent.length > 0 &&
                Array.isArray(inProgressContent) && (
                  <DashboardItems
                    heading='In Progress'
                    content={inProgressContent}
                  />
                )}
              {notStartedContent.length > 0 &&
                Array.isArray(notStartedContent) && (
                  <DashboardItems
                    heading='Not Started'
                    content={notStartedContent}
                    notHighlight={inProgressContent.length > 0}
                  />
                )}
            </>
          )}
      </div>
    )
  } else {
    const [loading, setLoading] = useState(false)
    const [noMoreContent, setNoMoreContent] = useState(false)
    const {
      setFetchMoreSearched,
      loadingMore,
      noMoreSearchedContent
    } = Container.useContainer()

    const activeContent = content.filter(
      ({ status }) => !status || status !== 'COMPLETED'
    )
    const completedContent = content.filter(
      ({ status }) => status && status === 'COMPLETED'
    )

    const [contentDnd, setContentDnd] = useState(activeContent)

    useEffect(() => {
      if (setLimitState && setNoMoreContent) {
        setLimitState(10)
        setNoMoreContent(false)
      }
    }, [filters])

    useEffect(() => {
      if (limitState) {
        const handleScroll = async event => {
          // const limit = { ...limit }[contentKey]
          if (
            !event ||
            !event.target ||
            !event.target.scrollingElement ||
            noMoreContent
          )
            return

          !isSearching && setLoading(true)

          const {
            scrollHeight,
            scrollTop,
            clientHeight
          } = event.target.scrollingElement

          if (scrollTop + clientHeight >= scrollHeight * 0.8 && !isSearching) {
            try {
              await fetchMore({
                variables: {
                  limit: limitState + 10,
                  neededSkills
                },
                updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                  if (
                    prev.fetchDevelopmentPlanRelatedContent.relatedContent
                      .length === totalRelatedContent
                  ) {
                    setNoMoreContent(true)
                    return prev
                  } else return fetchMoreResult
                }
              })
            } catch (e) {
            } finally {
              setLoading(false)
              if (!noMoreContent) {
                setLimitState(limitState + 10)
              }
            }
          } else if (scrollTop + clientHeight === scrollHeight && isSearching) {
            if (!noMoreSearchedContent) {
              setFetchMoreSearched(true)
            }
          }
        }
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
      }
    }, [
      limitState,
      noMoreContent,
      setLimitState,
      setLoading,
      setNoMoreContent,
      fetchMore,
      neededSkills
    ])

    function handleOnDragEnd(result) {
      if (!result.destination) return

      const items = [...contentDnd]
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      setContentDnd(items)
      // setContentOrder(items)
    }

    const ordering = () => {
      setContentOrder(contentDnd)
      confirmOrder()
    }

    // useEffect(() => {
    //   ordering()
    // }, [confirmOrderClicked])

    // LAZY LOAD ON SCROLL

    return (
      <>
        {!draggable ? (
          <>
            {activeContent.map((item, i) => {
              const { relatedPrimarySkills, status, endDate, selected } = item
              const mainTags = (relatedPrimarySkills || []).filter(tag =>
                neededSkills.length
                  ? neededSkills.some(
                      skill => tag._id.indexOf(skill._id) !== -1
                    )
                  : true
              )
              const secondaryTags = (relatedPrimarySkills || []).filter(
                skill =>
                  !mainTags.some(tag => tag._id.indexOf(skill._id) !== -1)
              )
              if (item.type === 'WORKSHOP' || item.type === 'EVENT') {
                return (
                  <DevelopmentPlanWorkshop
                    key={item._id}
                    {...item}
                    mainTags={mainTags}
                    secondaryTags={secondaryTags}
                    onSelect={() => onSelect(item, 'selectedContent')}
                  />
                )
              } else {
                return (
                  <DevelopmentPlanContent
                    key={item._id}
                    {...remapLearningContentForUI({
                      content: item,
                      neededWorkSkills: neededSkills || [],
                      options: [],
                      goalInfo: []
                    })}
                    {...{ status, endDate, selected }}
                    onSelect={() => {
                      onSelect(item, 'selectedContent')
                      setContentDnd(contentDnd.filter(i => i._id !== item._id))
                    }}
                    onEdit={onEdit}
                    isOnGoalSetting={isOnGoalSetting}
                    setOrder={setOrder}
                    index={i}
                    totalItems={activeContent.length}
                    handleChangingNote={handleChangingNote}
                  />
                )
              }
            })}
          </>
        ) : (
          <>
            <div className='tabs-label__order'>
              <div
                style={{
                  paddingRight: '16px',
                  color: '#1CB55C',
                  position: 'absolute',
                  right: '30px',
                  bottom: '28px'
                }}
                onClick={ordering}
              >
                <OrderIcon className='order__icon order__icon--green' />
                Confirm
              </div>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId='contentDnd'>
                {provided => (
                  <ul
                    className='goal-item__list'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      position: 'relative',
                      left: '30px',
                      maxWidth: '550px'
                    }}
                  >
                    {contentDnd.map((item, index) => {
                      const {
                        relatedPrimarySkills,
                        status,
                        endDate,
                        selected
                      } = item
                      const mainTags = (
                        relatedPrimarySkills || []
                      ).filter(tag =>
                        neededSkills.length
                          ? neededSkills.some(
                              skill => tag._id.indexOf(skill._id) !== -1
                            )
                          : true
                      )
                      const secondaryTags = (relatedPrimarySkills || []).filter(
                        skill =>
                          !mainTags.some(
                            tag => tag._id.indexOf(skill._id) !== -1
                          )
                      )
                      if (item.type === 'WORKSHOP' || item.type === 'EVENT') {
                        return (
                          <DevelopmentPlanWorkshop
                            key={item._id}
                            {...item}
                            mainTags={mainTags}
                            secondaryTags={secondaryTags}
                            onSelect={() => onSelect(item, 'selectedContent')}
                          />
                        )
                      } else {
                        return (
                          <Draggable
                            key={item._id}
                            draggableId={item._id}
                            index={index}
                          >
                            {provided => (
                              <li
                                className='goal-item__list-item'
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <DevelopmentPlanContent
                                  key={item._id}
                                  {...remapLearningContentForUI({
                                    content: item,
                                    neededWorkSkills: neededSkills || [],
                                    options: [],
                                    goalInfo: []
                                  })}
                                  {...{ status, endDate, selected }}
                                  onSelect={() => {
                                    onSelect(item, 'selectedContent')
                                    setContentDnd(
                                      contentDnd.filter(i => i._id !== item._id)
                                    )
                                  }}
                                  onEdit={onEdit}
                                  isOnGoalSetting={isOnGoalSetting}
                                  setOrder={setOrder}
                                  index={index}
                                  totalItems={activeContent.length}
                                  draggable={draggable}
                                  handleChangingNote={handleChangingNote}
                                />
                              </li>
                            )}
                          </Draggable>
                        )
                      }
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}

        {completedContent.map((item, i) => {
          if (i > 3 && !displayCompleted) return null

          const { relatedPrimarySkills, status, endDate, selected } = item
          const mainTags = (relatedPrimarySkills || []).filter(tag =>
            neededSkills.length
              ? neededSkills.some(skill => tag._id.indexOf(skill._id) !== -1)
              : true
          )
          const secondaryTags = (relatedPrimarySkills || []).filter(
            skill => !mainTags.some(tag => tag._id.indexOf(skill._id) !== -1)
          )
          if (item.type === 'WORKSHOP' || item.type === 'EVENT') {
            return (
              <DevelopmentPlanWorkshop
                key={item._id}
                {...item}
                mainTags={mainTags}
                secondaryTags={secondaryTags}
                onSelect={() => onSelect(item, 'selectedContent')}
                onEdit={onEdit}
                status='COMPLETED'
              />
            )
          } else {
            return (
              <DevelopmentPlanContent
                key={item._id}
                index={i}
                {...item}
                {...remapLearningContentForUI({
                  content: item,
                  neededWorkSkills: neededSkills || [],
                  options: [],
                  goalInfo: []
                })}
                {...{ status, endDate, selected }}
                onSelect={() => onSelect(item, 'selectedContent')}
                onEdit={onEdit}
                handleChangingNote={handleChangingNote}
              />
            )
          }
        })}
        {(loading || loadingMore) && limit && <LoadingSpinner />}
        {(noMoreContent || noMoreSearchedContent) && (
          <p style={{ marginTop: '40px' }}>No more learning items available</p>
        )}
      </>
    )
  }
}
