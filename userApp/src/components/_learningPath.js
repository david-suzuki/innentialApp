import React, { useContext, useState } from 'react'
import {
  fetchLearningPathById,
  transformLearningPathToGoals,
  fetchUserGoals,
  fetchUserDevelopmentPlan,
  changeGoalPreferences,
  fetchTeamLearningPathsProgress,
  fetchCurrentUserOrganizationTeams,
  fetchCurrentUserOrganizationWithoutImages
} from '../api'
import { useQuery, useMutation } from 'react-apollo'
import { withRouter, Redirect, Link } from 'react-router-dom'
import { captureFilteredError, LoadingSpinner, SentryDispatch } from './general'
// import {
//   GoalItem,
//   List,
//   remapLearningContentForUI,
//   LearningItemNew,
//   BodyPortal
// } from './ui-components'
import learningPathPageNewStyle from '../styles/learningPathPageNewStyle'
import { Button, MessageBox, Notification } from 'element-react'
// import { PathTemplateAssignmentForm } from './organization-settings/components'
import ApolloCacheUpdater from 'apollo-cache-updater'
import Container from '../globalState'
import ExtraItem from './ui-components/ExtraItem'
import Ribbon from './ui-components/ribbon'
import StepCard from './ui-components/StepCard'
import {
  remapLearningContentForUI,
  LearningPathQuestions
} from './ui-components'

import Pattern from '../static/pattern.svg'
import Clock from '../static/clock.svg'
import HelpIcon from '../static/help-circle-dark.svg'
import PlusIcon from '../static/plus-circle-white.svg'
import { UserContext } from '../utils'

export const LearningPathDetails = props => {
  const {
    name,
    description,
    imageLink,
    author,
    authorImageLink,
    goalTemplate = [],
    skills,
    startConditions,
    duration
  } = props

  const imgSrc =
    imageLink === null
      ? require('../static/learning-path-picture.png')
      : imageLink
  const authorSrc =
    authorImageLink === null ? require('../static/nobody.jpg') : authorImageLink

  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <div className='learning-path__path-panel'>
        <div className='learning-path__info-panel'>
          <div className='learning-path__author-info'>
            <div style={{ display: 'flex' }}>
              <Ribbon
                text='LEARNING PATH'
                customStyle={{
                  background: '#E7F9F7',
                  borderRadius: '2px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#29A399',
                  marginRight: '17px',
                  height: 'fit-content'
                }}
              />
              {duration && (
                <span className='step-card__duration'>
                  <img src={Clock} alt='duration' />
                  {duration}
                </span>
              )}
            </div>
            {author && (
              <div className='learning-path__author-avatar'>
                <div className='learning-path__information'>
                  <span>Curated by</span>
                  <span>{author}</span>
                </div>
              </div>
            )}
          </div>
          <h1 className='learning-path__title'>{name}</h1>
          {description && (
            <div
              className={`learning-path__description ${
                showMore ? 'read-more' : 'limit'
              }`}
              dangerouslySetInnerHTML={{
                __html: description
              }}
            />
          )}
          <span
            className='learning-path__details-button'
            onClick={() => setShowMore(!showMore)}
          >
            {!showMore && (
              <>
                Read More
                <i className='icon icon-small-right' />
              </>
            )}
            {showMore && <>Hide Description</>}
          </span>
          <div className='learning-path__extra-info'>
            {startConditions && startConditions.length > 0 && (
              <div>
                <h2>Start this path if:</h2>
                {startConditions.map(cond => (
                  <ExtraItem text={cond} />
                ))}
              </div>
            )}
          </div>
          {skills.length > 0 && (
            <div className='learning-path__skill-sets'>
              <div className='learning-path__skill-sets-title'>
                Skills you will learn
              </div>
              <div className='learning-path__skill-sets-body'>
                {skills.map((el, index) => (
                  <Ribbon
                    key={`skill-ribbon-${index}`}
                    text={el.name}
                    customStyle={{
                      background: '#F9F8FC',
                      borderRadius: '4px',
                      padding: '8px 15px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      lineHeight: '18px',
                      color: '#5A55AB',
                      height: 'fit-content'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <img
          className='learning-path__background'
          src={imgSrc}
          alt='background'
        />
      </div>
      <div className='learning-path__goal-steps' id='learning-details'>
        {goalTemplate.map(({ _id: templateId, ...template }, i) => {
          return (
            <div
              className={`learning-path__step-container ${
                i === 0 ? 'first' : ''
              } ${i === goalTemplate.length - 1 ? 'last' : ''}`}
              key={`goal-template:${templateId}`}
            >
              <div className='learning-path__step-title'>
                <div className='learning-path__title-icon'>
                  <span>goal</span>
                  <span>{i + 1}</span>
                  <img src={Pattern} alt='pattern' />
                </div>
                <h2>{template.goalName}</h2>
              </div>
              {template.content
                .sort((a, b) => a.order - b.order)
                .map(({ content: item, note }) => {
                  const uiContent = remapLearningContentForUI({
                    content: item
                  })
                  return (
                    <StepCard
                      key={`goal-template:${template.goalName}:content:${item._id}`}
                      description={note}
                      {...uiContent}
                    />
                  )
                })}

              {/* {i === goalTemplate.length - 1 && template.content.length > 0 && (
                <>
                  <div
                    className='learning-path__border-element'
                    style={{
                      height: `${87 + 200 * (template.content.length - 1)}px`
                    }}
                  />
                </>
              )} */}
            </div>
          )
        })}
      </div>
      {goalTemplate.length > 0 && (
        <div id='learning-details'>
          <br />
          <br />
          <br />
        </div>
        // <div className='learning-path__section-title' >
        //   Goals of the path
        // </div>
      )}
    </>
  )
}

const LearningPathPage = ({
  teams,
  _id: pathId,
  currentUser,
  // users = {},
  history,
  ...LPprops
}) => {
  const {
    setAssigningPath,
    resetNextStepState
    // setCurrentAssignee
  } = Container.useContainer()
  // const [dialogVisible, setDialogVisible] = useState(false)
  const [assignLearningPathMutation] = useMutation(transformLearningPathToGoals)
  const [changePreferencesMutation] = useMutation(changeGoalPreferences)

  const { noPaid: disablePaidContent, approvals } = useContext(UserContext)

  const { paid: pathHasPaidContent } = LPprops

  const warn = disablePaidContent && pathHasPaidContent

  const assignLearningPath = async (pathId, user, forApproval) => {
    if (pathId && user) {
      try {
        await assignLearningPathMutation({
          variables: {
            id: pathId,
            targetUser: user,
            forApproval
          },
          update: (
            proxy,
            { data: { transformLearningPathToGoals: mutationResults = [] } }
          ) => {
            try {
              for (const team of teams) {
                let usersProps = [...team.members, team.leader]
                let userProps = usersProps.filter(value => {
                  return value._id == user
                })[0]

                let readQuery = proxy.readQuery({
                  query: fetchTeamLearningPathsProgress,
                  variables: { teamId: team._id, filter: 'ALL_TIME' }
                })
                let foundedPath = readQuery.fetchTeamLearningPathsProgress.filter(
                  value => {
                    return value.pathId == pathId
                  }
                )
                let newUser = {
                  _id: `${user}:${team._id}`,
                  userId: user,
                  firstName: userProps.firstName,
                  lastName: userProps.lastName,
                  imageLink: userProps.imageLink,
                  status: 'NOT STARTED',
                  __typename: 'AssignedToUser'
                }
                if (foundedPath.length == 0) {
                  const newPath = {
                    _id: `${pathId}:${team._id}`,
                    pathId: pathId,
                    pathName: LPprops.name,
                    __typename: 'TeamPathStatistics',
                    assignedTo: [newUser]
                  }
                  readQuery.fetchTeamLearningPathsProgress = [
                    ...readQuery.fetchTeamLearningPathsProgress,
                    newPath
                  ]
                  proxy.writeQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team._id, filter: 'ALL_TIME' },
                    data: readQuery
                  })
                } else if (foundedPath.length !== 0) {
                  let newUser = {
                    _id: `${user}:${team._id}`,
                    userId: user,
                    firstName: userProps.firstName,
                    lastName: userProps.lastName,
                    imageLink: userProps.imageLink,
                    status: 'NOT STARTED',
                    __typename: 'AssignedToUser'
                  }
                  let readQueryWithoutFoundedPath = readQuery.fetchTeamLearningPathsProgress.filter(
                    value => {
                      return value.pathId != pathId
                    }
                  )
                  readQuery.fetchTeamLearningPathsProgress = [
                    ...readQueryWithoutFoundedPath,
                    {
                      ...foundedPath[0],
                      assignedTo: [...foundedPath[0].assignedTo, newUser]
                    }
                  ]
                  proxy.writeQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team._id, filter: 'ALL_TIME' },
                    data: readQuery
                  })
                }
              }
            } catch (e) {}

            mutationResults.forEach(function add(mutationResult, i) {
              if (mutationResult.user === mutationResult.setBy) {
                ApolloCacheUpdater({
                  proxy, // apollo proxy
                  queriesToUpdate: [fetchUserGoals],
                  searchVariables: {},
                  mutationResult,
                  ID: '_id'
                })
              }
            })
          },
          refetchQueries: [{ query: fetchUserDevelopmentPlan }]
        })
        Notification({
          type: 'success',
          message:
            user === currentUser._id
              ? 'Success! You can now begin your learning path'
              : 'Assignment was successful',
          duration: 2500,
          offset: 90
        })
      } catch (e) {
        if (e?.graphQLErrors[0]?.message === 'already_assigned') {
          Notification({
            type: 'info',
            iconClass: 'el-icon-info',
            message:
              'One or more learning goals from the path is already assigned',
            duration: 2500,
            offset: 90
          })
        } else {
          captureFilteredError(e)
          Notification({
            type: 'warning',
            message: 'Oops! Something went wrong',
            duration: 2500,
            offset: 90
          })
        }
      }
    }
  }

  // const requestLearningPath = () => {
  //   MessageBox.confirm(``, `Would you like to request this learning path?`, {
  //     type: 'info'
  //   })
  //     .then(() => {
  //       assignLearningPath(pathId, currentUser._id, true)
  //       history.push(`/goals?tab=draft`)
  //     })
  //     .catch(() => {})
  // }

  const claimLearningPath = () => {
    MessageBox.confirm(
      warn ? (
        <p>
          This path contains paid content. Your organisation has paid content
          turned off and you won't be able to request its purchase.{' '}
          {approvals ? (
            <strong>
              You can still ask for budget approval or simply skip it.
            </strong>
          ) : (
            <strong>You can still access it or simply skip it.</strong>
          )}{' '}
          Would you like to begin anyway?
        </p>
      ) : (
        ``
      ),
      warn ? `Warning` : `Would you like to begin this learning path?`,
      {
        type: warn ? 'warning' : 'info'
      }
    )
      .then(async () => {
        await assignLearningPath(pathId, currentUser._id, false)
        resetNextStepState()
        // ADD HOTJAR METRIC
        window.hj &&
          window.hj('identify', currentUser._id, {
            'Started path': true
          })
        window.analytics &&
          window.analytics.track('started_LP', {
            pathId
          })
        history.push(`/?learner=true`)
      })
      .catch(() => {})
  }

  const goToDashboardPath = () => {
    changePreferencesMutation({
      variables: {
        pathId
      }
    })
      .then(() => history.push(`/?learner=true`))
      .catch(err => captureFilteredError(err))
  }

  const handleAssign = async () => {
    if (warn) {
      try {
        await MessageBox.confirm(
          `This path has paid items that are not approved by your organization. Would you like to assign it anyway?`,
          `Warning`,
          {
            type: 'warning'
          }
        )
      } catch (err) {
        return
      }
    }
    setAssigningPath({ _id: pathId, ...LPprops })
    // setCurrentAssignee(LPprops.assignee)
  }

  const priviledges =
    currentUser.roles.indexOf('ADMIN') !== -1 || currentUser.leader

  // const [showDetails, setShowDetails] = useState(true)
  const userProgress = LPprops.userProgress

  const minHistoryLength = 3

  return (
    <div className='component-block--paths'>
      <div
        className='learning-path__back__button--secondary'
        onClick={() => {
          if (history.length < minHistoryLength) {
            history.replace('/learning-paths/dashboard')
          } else {
            history.goBack()
          }
        }}
      >
        <i className='icon icon-small-right icon-rotate-180' />
        Back
      </div>

      <LearningPathDetails {...LPprops} />

      <LearningPathQuestions pathId={pathId} />

      <div className='page-footer page-footer--fixed-path'>
        {priviledges && (
          <Button
            className='learning-path__footer-button learning-path__footer-button--assign'
            onClick={handleAssign}
          >
            {/* <i style={{ marginRight: '10px' }} className="icon icon-users-mm" /> */}
            Assign
          </Button>
        )}
        {/* {(
          !currentUser.corporate && (
            <Button
              className='learning-path__footer-button learning-path__footer-button--request'
              onClick={() => requestLearningPath()}
            >
              Request
            </Button>
          )
        )} */}
        {(!userProgress || userProgress.status === 'NOT STARTED') && (
          <Button
            className='learning-path__footer-button learning-path__footer-button--claim'
            onClick={claimLearningPath}
          >
            {/* <i style={{ marginRight: '10px' }} className="el-icon-circle-check" /> */}
            Start Path
          </Button>
        )}
        {userProgress && userProgress.status === 'IN PROGRESS' && (
          <Button
            onClick={goToDashboardPath}
            className='learning-path__footer-button learning-path__footer-button--progress'
          >
            {/* <i style={{ marginRight: '10px' }} className="el-icon-circle-check" /> */}
            Go to Active Paths
          </Button>
        )}
        {userProgress && userProgress.status === 'COMPLETED' && (
          <Link to='/library/completed'>
            <Button className='learning-path__footer-button learning-path__footer-button--completed'>
              {/* <i style={{ marginRight: '10px' }} className="el-icon-circle-check" /> */}
              Go to Library
            </Button>
          </Link>
        )}
      </div>

      <style>{learningPathPageNewStyle}</style>
    </div>
  )
}

export default withRouter(
  ({ currentUser, users, match: { params }, history }) => {
    const isAdmin = currentUser.roles.indexOf('ADMIN') !== -1
    const id = params?.pathId
    if (!id || id.length !== 24) return <Redirect to='/error-page/404' />

    const {
      data: dataTeams,
      loading: loadingTeams,
      error: errorTeams
    } = useQuery(
      isAdmin
        ? fetchCurrentUserOrganizationWithoutImages
        : fetchCurrentUserOrganizationTeams
    )

    const { data, loading, error } = useQuery(fetchLearningPathById, {
      variables: {
        id
      },
      fetchPolicy: 'cache-and-network'
    })

    if (loading || loadingTeams) return <LoadingSpinner />

    if (error || errorTeams)
      return <SentryDispatch error={error || errorTeams} />

    if (data?.fetchLearningPathById) {
      const teams = dataTeams?.fetchCurrentUserOrganization?.teams || []

      return (
        <LearningPathPage
          {...data.fetchLearningPathById}
          currentUser={currentUser}
          teams={teams}
          // users={users}
          history={history}
        />
      )
    }
    return <Redirect to='/error-page/404' />
  }
)
