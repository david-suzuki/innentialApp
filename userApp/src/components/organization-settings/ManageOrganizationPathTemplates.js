import React, { useState, useContext } from 'react'
import ApolloCacheUpdater from 'apollo-cache-updater'
import { Button, MessageBox, Notification } from 'element-react'
import {
  fetchOrganizationLearningPath,
  fetchTeamLearningPath,
  deleteOrganizationLearningPath,
  fetchLearningPathsForDashboard,
  changeLearningPathsStatus
  // fetchCurrentUserOrganizationName
} from '../../api'
import { useQuery, useMutation } from 'react-apollo'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Statement, Tab, TabsList, TabContent, Tabs } from '../ui-components'
import tableStyle from '../../styles/tableStyle'
import pathManagementStyle from '../../styles/pathManagementStyle'
import roleManagementStyle from '../../styles/roleManagementStyle'
import Tooltip from 'react-simple-tooltip'
import Container from '../../globalState'
import { UserContext } from '../../utils'
import { ReactComponent as FilterIcon } from '../../static/filter-icon.svg'
import { ReactComponent as PathsIcon } from '../../static/NewNav_assets/user-route-icons/paths.svg'
// import { PathTemplateAssignmentForm } from './'

export const handleDeletingPath = (mutation, id) => {
  MessageBox.confirm(
    `This cannot be undone`,
    `Are you sure you want to delete the Learning Path?`,
    {
      type: 'warning'
    }
  )
    .then(() => {
      mutation({
        variables: {
          id
        },
        update: (
          proxy,
          { data: { deleteOrganizationLearningPath: mutationResult = {} } }
        ) => {
          try {
            const updates = ApolloCacheUpdater({
              proxy, // apollo proxy
              queriesToUpdate: [
                fetchOrganizationLearningPath,
                fetchLearningPathsForDashboard
              ],
              operation: 'REMOVE',
              searchVariables: {},
              mutationResult,
              ID: '_id'
            })
          } catch (err) {}
          try {
            const { fetchTeamLearningPath: teams } = proxy.readQuery({
              query: fetchTeamLearningPath
            })

            proxy.writeQuery({
              query: fetchTeamLearningPath,
              data: {
                fetchTeamLearningPath: teams.map(team => {
                  return {
                    ...team,
                    learningPaths: team.learningPaths.filter(
                      ({ _id: pathId }) => pathId !== mutationResult._id
                    )
                  }
                })
              }
            })
          } catch (err) {}
          Notification({
            type: 'success',
            message: 'Path deleted',
            duration: 2500,
            offset: 90
          })
        }
      })
        .then(
          (/* { data: { deleteOrganizationLearningPath: response } } */) => {}
        )
        .catch(err => {
          captureFilteredError(err)
          Notification({
            type: 'warning',
            message: 'Oops! Something went wrong',
            duration: 2500,
            offset: 90
          })
        })
    })
    .catch(() => {})
}

const handleActivatingPath = (mutation, pathIds, value) => {
  mutation({
    variables: {
      pathIds,
      value
    }
    // update: (
    //   proxy,
    //   { data: { deleteOrganizationLearningPath: mutationResult = {} } }
    // ) => {
    //   // your mutation response
    //   const updates = ApolloCacheUpdater({
    //     proxy, // apollo proxy
    //     queriesToUpdate: [fetchOrganizationLearningPath],
    //     operation: 'REMOVE',
    //     searchVariables: {},
    //     mutationResult,
    //     ID: '_id'
    //   })
    //   if (updates) {
    //     Notification({
    //       type: 'success',
    //       message: 'Path deleted',
    //       duration: 2500,
    //       offset: 90
    //     })
    //   }
    // }
  })
    .then((/* { data: { deleteOrganizationLearningPath: response } } */) => {})
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

// COMPONENTS

const GoalTemplateItem = ({
  _id: goalId,
  pathId,
  name,
  goalName,
  measures,
  relatedSkills,
  content = [],
  mentors = [],
  tasks = [],
  organization,
  indent = false,
  goalTemplates,
  team,
  single = false,
  active,
  handleDeletion = () => {},
  handleAssignment,
  handleActivation,
  index
}) => {
  return (
    <React.Fragment key={`goal-template:${goalId}`}>
      <tr>
        <td style={{ display: 'flex', color: '#556685' }}>
          <p className='goal-template-index'>{index + 1}</p>"{goalName}"
        </td>
        <td />
        <td />
        <td />
      </tr>
    </React.Fragment>
  )
}

// const GoalTemplateItem1 = ({
//   _id: goalId,
//   pathId,
//   name,
//   goalName,
//   measures,
//   relatedSkills,
//   content = [],
//   mentors = [],
//   tasks = [],
//   organization,
//   indent = false,
//   goalTemplates,
//   team,
//   single = false,
//   active,
//   handleDeletion = () => { },
//   handleAssignment,
//   handleActivation,
// }) => {
//   const [expanded, setExpand] = useState(false)

//   const showDevPlanInfo = content.length + mentors.length + tasks.length > 0

//   return (
//     <React.Fragment key={`goal-template:${goalId}`}>
//       <tr>
//         <td
//           className='table__column--goal'
//           style={{ paddingLeft: indent ? '20px' : '0' }}
//         >
//           <i
//             onClick={() => setExpand(!expanded)}
//             className={`icon icon-small-down ${expanded &&
//               'icon-rotate-180'} path-management__expand`}
//           />
//           <img src={require('../../static/goal.svg')} alt='' /> {goalName}
//         </td>
//         <td />
//         <td />
//         <td style={{ width: '14%' }}>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             {typeof handleActivation === 'function' && (
//               <Tooltip
//                 content={
//                   active ? 'Visible on dashboard' : 'Not visible on dashboard'
//                 }
//                 style={{ display: 'inherit' }}
//                 fontSize='11px'
//                 padding={3}
//               >
//                 <i
//                   className={`icon ${active ? 'icon-eye-17' : 'icon-b-preview'
//                     } icon-clickable`}
//                   style={{ color: '#f5b764' }}
//                   onClick={() => handleActivation(pathId, !active)}
//                 />
//               </Tooltip>
//             )}

//             {typeof handleAssignment === 'function' && (
//               <Tooltip
//                 content='Assign'
//                 style={{ display: 'inherit' }}
//                 fontSize='11px'
//                 padding={3}
//               >
//                 <i
//                   className='icon icon-users-mm icon-clickable'
//                   style={{ color: '#9adc5a' }}
//                   onClick={handleAssignment}
//                 />
//               </Tooltip>
//             )}

//             {organization !== null && single && (
//               <>
//                 <Link
//                   to={{
//                     pathname: '/path-templates/form',
//                     state: {
//                       initialData: {
//                         _id: pathId,
//                         name,
//                         goalTemplates: goalTemplates.map(g => ({
//                           ...g,
//                           content: g.content.map(({ content, ...rest }) => ({
//                             ...rest,
//                             ...content
//                           }))
//                         })),
//                         team: team
//                           ? {
//                             teamId: team._id,
//                             teamName: team.teamName
//                           }
//                           : null
//                       }
//                     }
//                   }}
//                 >
//                   <i className='el-icon-edit' />
//                 </Link>
//                 <i
//                   className='el-icon-delete icon-delete-red'
//                   onClick={() => handleDeletion(pathId)}
//                 />
//               </>
//             )}
//           </div>
//         </td>
//       </tr>
//       {expanded && (
//         <tr>
//           <th
//             style={{ paddingLeft: indent ? '40px' : '20px', textAlign: 'left' }}
//             colSpan='3'
//           >
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               {relatedSkills.length + measures.length > 0 && (
//                 <div>
//                   {relatedSkills.length > 0 && (
//                     <>
//                       <h5>Related skills</h5>
//                       <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//                         {relatedSkills.map(skill => (
//                           <span className='path-management__details__skill-tag'>
//                             {skill.name}
//                           </span>
//                         ))}
//                       </div>
//                     </>
//                   )}
//                   {measures.length > 0 && (
//                     <>
//                       <h5>Success measures</h5>
//                       <ol>
//                         {measures.map(measure => (
//                           <li>{measure}</li>
//                         ))}
//                       </ol>
//                     </>
//                   )}
//                 </div>
//               )}
//               {showDevPlanInfo && (
//                 <div style={{ minWidth: '129px', textAlign: 'right' }}>
//                   <h5>Development plan info: </h5>
//                   {content.length > 0 && (
//                     <p>
//                       {content.length} learning item
//                       {content.length > 1 ? 's' : ''}
//                     </p>
//                   )}
//                   {mentors.length > 0 && (
//                     <p>
//                       {mentors.length} mentor{mentors.length > 1 ? 's' : ''}
//                     </p>
//                   )}
//                   {tasks.length > 0 && (
//                     <p>
//                       {tasks.length} task{tasks.length > 1 ? 's' : ''}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </th>
//         </tr>
//       )}
//     </React.Fragment>
//   )
// }

// const PathTemplateItem = ({
//   _id: pathId,
//   name,
//   goalTemplates,
//   organization,
//   team,
//   active,
//   handleDeletion,
//   handleAssignment = () => { },
//   handleActivation
// }) => {
//   const [expanded, setExpand] = useState(false)

//   return (
//     <React.Fragment key={`path-template:${pathId}`}>
//       <tr>
//         <td>
//           <i
//             onClick={() => setExpand(!expanded)}
//             className={`icon icon-small-down ${expanded &&
//               'icon-rotate-180'} path-management__expand`}
//           />
//           <strong>{name}</strong>
//           <span className='path-management__expand__count'>
//             {goalTemplates.length}
//           </span>
//         </td>
//         <td />
//         <td />
//         <td style={{ width: '14%' }}>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             {typeof handleActivation === 'function' && (
//               <Tooltip
//                 content={
//                   active ? 'Visible on dashboard' : 'Not visible on dashboard'
//                 }
//                 style={{ display: 'inherit' }}
//                 fontSize='11px'
//                 padding={3}
//               >
//                 <i
//                   className={`icon ${active ? 'icon-eye-17' : 'icon-b-preview'
//                     } icon-clickable`}
//                   style={{ color: '#f5b764' }}
//                   onClick={() => handleActivation(pathId, !active)}
//                 />
//               </Tooltip>
//             )}
//             {/* <Tooltip
//               content='Preview'
//               style={{ display: 'inherit' }}
//               fontSize='11px'
//               padding='3'
//             >
//               <Link
//                 to={`/learning-path/${pathId}`}
//                 style={{ display: 'inherit' }}
//               >
//                 <i className='icon icon-eye-17' style={{ color: '#5fd7cd' }} />
//               </Link>
//             </Tooltip> */}
//             <Tooltip
//               content='Assign'
//               style={{ display: 'inherit' }}
//               fontSize='11px'
//               padding='3'
//             >
//               <i
//                 className='icon icon-users-mm icon-clickable'
//                 style={{ color: '#9adc5a' }}
//                 onClick={() => handleAssignment(pathId)}
//               />
//             </Tooltip>
//             {organization !== null && (
//               <>
//                 <Link
//                   to={{
//                     pathname: '/path-templates/form',
//                     state: {
//                       initialData: {
//                         _id: pathId,
//                         name,
//                         goalTemplates: goalTemplates.map(g => ({
//                           ...g,
//                           content: g.content.map(({ content, ...rest }) => ({
//                             ...rest,
//                             ...content
//                           }))
//                         })),
//                         active,
//                         team: team
//                           ? {
//                             teamId: team._id,
//                             teamName: team.teamName
//                           }
//                           : null
//                       }
//                     }
//                   }}
//                   style={{ display: 'inherit' }}
//                 >
//                   <i className='el-icon-edit' />
//                 </Link>
//                 <i
//                   className='el-icon-delete icon-delete-red'
//                   onClick={() => handleDeletion(pathId)}
//                 />
//               </>
//             )}
//           </div>
//         </td>
//       </tr>
//       {expanded &&
//         goalTemplates.map(goalTemplate => (
//           <GoalTemplateItem
//             {...goalTemplate}
//             organization={organization}
//             indent
//           />
//         ))}
//     </React.Fragment>
//   )
// }

const Assignee = ({ assignee, handleClick, team = null }) => {
  const { everyone, teams, users } = assignee

  let content

  // if (team) {
  //   const inAssigned = teams.find(({ team: t }) => t._id === team)

  //   if (inAssigned && inAssigned?.users?.length > 0) {
  //     return inAssigned?.users?.map(
  //       ({ _id: userId, firstName, lastName, email }) => {
  //         return (
  //           <Link to={`/profiles/${userId}`}>
  //             <p
  //               className='path-management__path__assignee'
  //               style={{ fontWeight: 'normal' }}
  //             >
  //               {firstName ? `${firstName} ${lastName}` : email}
  //             </p>
  //           </Link>
  //         )
  //       }
  //     )
  //   }
  // }

  if (everyone) {
    content = 'Everyone'
  } else if (teams.length > 0) {
    if (teams.length > 1) {
      content = 'Multiple Teams'
    } else {
      content = teams[0]?.team?.teamName || 'Specific team'
    }
  } else {
    if (users.length > 1) {
      content = 'Multiple Users'
    } else {
      content = `${users[0]?.firstName || users[0]?.email} ${users[0]
        ?.lastName || ''}`
    }
  }

  return (
    <div className='path-management__path__assignee' onClick={handleClick}>
      <div className='path-management__path__assignee__text'>
        <span>{content}</span>
      </div>
      <i className='icon icon-menu-dots' />
    </div>
  )
}

const OrganizationPathTemplateItem = pathTemplate => {
  const [expanded, setExpand] = useState(false)

  const teamsAutoassigned = pathTemplate?.assignee?.teams?.some(
    t => t.autoassign
  )

  const everyoneAssigned = pathTemplate?.assignee?.everyone

  const autoassignCheck =
    (everyoneAssigned && pathTemplate?.assignee?.autoassign) ||
    (!everyoneAssigned && teamsAutoassigned)

  const autoassignNo =
    !everyoneAssigned &&
    teamsAutoassigned &&
    pathTemplate?.assignee?.teams?.filter(t => t.autoassign)?.length

  return (
    <React.Fragment key={`op-template: ${pathTemplate._id}`}>
      <tr>
        <td style={{ width: '30%' }}>
          <div className='path-management__title-wrapper--team'>
            <div className='path-management__title--team'>
              <Link to={`/learning-path/${pathTemplate._id}`}>
                <strong style={{ color: 'black' }}>{pathTemplate.name}</strong>
              </Link>
            </div>
            <span
              onClick={() => setExpand(!expanded)}
              className='path-management__expand__count'
            >
              {pathTemplate.goalTemplates.length} goals
            </span>
            <i
              onClick={() => setExpand(!expanded)}
              className={`icon icon-small-down ${expanded &&
                'icon-rotate-180'} path-management__expand`}
            />
          </div>
        </td>
        <td>
          {pathTemplate.assignee ? (
            <Assignee
              assignee={pathTemplate.assignee}
              handleClick={() =>
                pathTemplate.handleAssignment(
                  pathTemplate._id
                  // pathTemplate.assignee
                )
              }
            />
          ) : (
            <strong
              className='table__assingee'
              onClick={() => pathTemplate.handleAssignment(pathTemplate._id)}
            >
              Click to assign a path
            </strong>
          )}
          {/*(
            (pathTemplate.assignee && !pathTemplate.assignee.everyone && pathTemplate.assignee.teams.length === 0) ? (
              <strong
                className='table__assingee'
                onClick={() => pathTemplate.handleAssignment(pathTemplate.pathId)}
              >
                Click to assign a path
              </strong>
            ) : (
              pathTemplate.assignee.everyone ? "everyone" : (
                pathTemplate.assignee.teams.maps(team => team.name)
              )
            )
              )*/}
        </td>
        <td className='table__autoassign'>
          <div
            className='table__autoassign__wrapper'
            onClick={() =>
              pathTemplate.handleAssignment(
                pathTemplate._id
                // pathTemplate.assignee
              )
            }
          >
            <img
              src={
                autoassignCheck
                  ? require('../../static/check-circle-green.svg')
                  : require('../../static/noncheck-circle.svg')
              }
            />
            {autoassignNo && pathTemplate?.assignee?.teams?.length > 1 && (
              <span>
                {autoassignNo}/{pathTemplate?.assignee?.teams?.length}
              </span>
            )}
          </div>
        </td>
        <td>
          {pathTemplate.curatedBy.userId ? (
            <Link to={`/profiles/${pathTemplate.curatedBy.userId}`}>
              {pathTemplate.curatedBy.name}
            </Link>
          ) : (
            <span>{pathTemplate.curatedBy.name}</span>
          )}
          {pathTemplate.curatedBy.firstName} {pathTemplate.curatedBy.lastName}
        </td>
        <td style={{ width: '20%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {pathTemplate.organization !== null && (
              <div>
                <Link
                  to={{
                    pathname: '/path-templates/form',
                    state: {
                      initialData: {
                        pathId: pathTemplate._id
                        // _id: pathTemplate._id,
                        // name: pathTemplate.name,
                        // goalTemplates: pathTemplate.goalTemplates.map(g => ({
                        //   ...g,
                        //   content: g.content.map(({ content, ...rest }) => ({
                        //     ...rest,
                        //     ...content
                        //   }))
                        // })),
                        // active: pathTemplate.active,
                        // team: pathTemplate.team
                        //   ? {
                        //       teamId: pathTemplate.team._id,
                        //       teamName: pathTemplate.team.teamName
                        //     }
                        //   : null
                      }
                    }
                  }}
                  style={{ display: 'inherit' }}
                  className='table__edit'
                >
                  Edit Path
                </Link>
              </div>
            )}
            {typeof pathTemplate.handleActivation === 'function' &&
              pathTemplate.organization && (
                <Tooltip
                  content={
                    pathTemplate.active
                      ? 'Visible on dashboard'
                      : 'Not visible on dashboard'
                  }
                  style={{ display: 'inherit', marginLeft: '5px' }}
                  fontSize='11px'
                  padding={3}
                >
                  <i
                    className={`icon ${
                      pathTemplate.active ? 'icon-eye-17' : 'icon-b-preview'
                    } icon-clickable`}
                    style={{ color: '#8494B2', fontSize: '20px' }}
                    onClick={() =>
                      pathTemplate.handleActivation(
                        pathTemplate._id,
                        !pathTemplate.active
                      )
                    }
                  />
                </Tooltip>
              )}
            {/* <Tooltip
              content='Preview'
              style={{ display: 'inherit', marginLeft: '5px' }}
              fontSize='11px'
              padding={3}
            >
              <Link
                to={`/learning-path/${pathTemplate._id}`}
                style={{ display: 'inherit' }}
              >
                <i
                  className='icon icon-eye-17'
                  style={{ color: '#8494B2', fontSize: '20px' }}
                />
              </Link>
            </Tooltip> */}
            {pathTemplate.organization !== null && (
              <>
                <i
                  className='el-icon-delete icon-delete-red'
                  style={{ fontSize: '20px', marginLeft: '5px' }}
                  onClick={() => pathTemplate.handleDeletion(pathTemplate._id)}
                />
              </>
            )}
          </div>
        </td>
      </tr>
      {expanded &&
        pathTemplate.goalTemplates.map((goalTemplate, index) => (
          <GoalTemplateItem
            {...goalTemplate}
            organization={pathTemplate.organization}
            indent
            index={index}
          />
        ))}
    </React.Fragment>
  )
}

const TeamPathTemplateItem = pathTemplate => {
  const [expanded, setExpand] = useState(false)

  const teamsAutoassigned = pathTemplate?.assignee?.teams?.some(
    t => t.autoassign
  )

  const everyoneAssigned = pathTemplate?.assignee?.everyone

  const autoassignCheck =
    (everyoneAssigned && pathTemplate?.assignee?.autoassign) ||
    teamsAutoassigned

  const autoassignNo =
    !everyoneAssigned &&
    teamsAutoassigned &&
    pathTemplate?.assignee?.teams?.filter(t => t.autoassign)?.length

  return (
    <React.Fragment key={`op-template: ${pathTemplate._id}`}>
      <tr>
        <td style={{ width: '30%' }}>
          <div className='path-management__title-wrapper--team'>
            <div className='path-management__title--team'>
              <Link to={`/learning-path/${pathTemplate._id}`}>
                <strong style={{ color: 'black' }}>{pathTemplate.name}</strong>
              </Link>
            </div>
            <span
              onClick={() => setExpand(!expanded)}
              className='path-management__expand__count'
            >
              {pathTemplate.goalTemplates.length} goals
            </span>
            <i
              onClick={() => setExpand(!expanded)}
              className={`icon icon-small-down ${expanded &&
                'icon-rotate-180'} path-management__expand`}
            />
          </div>
        </td>
        <td>
          {pathTemplate.assignee ? (
            <Assignee
              assignee={pathTemplate.assignee}
              team={pathTemplate.teamId}
              handleClick={() =>
                pathTemplate.handleAssignment(
                  pathTemplate._id
                  // pathTemplate.assignee
                )
              }
            />
          ) : (
            <strong
              className='table__assingee'
              onClick={() => pathTemplate.handleAssignment(pathTemplate._id)}
            >
              Click to assign a path
            </strong>
          )}
        </td>
        <td className='table__autoassign'>
          <div
            className='table__autoassign__wrapper'
            onClick={() =>
              pathTemplate.handleAssignment(
                pathTemplate._id
                // pathTemplate.assignee
              )
            }
          >
            <img
              src={
                autoassignCheck
                  ? require('../../static/check-circle-green.svg')
                  : require('../../static/noncheck-circle.svg')
              }
            />
            {autoassignNo && pathTemplate?.assignee?.teams?.length > 1 && (
              <span>
                {autoassignNo}/{pathTemplate?.assignee?.teams?.length}
              </span>
            )}
          </div>
        </td>
        <td>
          {pathTemplate.curatedBy.userId ? (
            <Link to={`/profiles/${pathTemplate.curatedBy.userId}`}>
              {pathTemplate.curatedBy.name}
            </Link>
          ) : (
            <span>{pathTemplate.curatedBy.name}</span>
          )}
          {pathTemplate.curatedBy.firstName} {pathTemplate.curatedBy.lastName}
        </td>
        <td style={{ width: '20%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {pathTemplate.organization !== null && pathTemplate.permissions && (
              <div>
                <Link
                  to={{
                    pathname: '/path-templates/form',
                    state: {
                      initialData: {
                        pathId: pathTemplate._id
                        // _id: pathTemplate._id,
                        // name: pathTemplate.name,
                        // goalTemplates: pathTemplate.goalTemplates.map(g => ({
                        //   ...g,
                        //   content: g.content.map(({ content, ...rest }) => ({
                        //     ...rest,
                        //     ...content
                        //   }))
                        // })),
                        // active: pathTemplate.active,
                        // team: pathTemplate.team
                        //   ? {
                        //       teamId: pathTemplate.team._id,
                        //       teamName: pathTemplate.team.teamName
                        //     }
                        //   : null
                      }
                    }
                  }}
                  style={{ display: 'inherit' }}
                  className='table__edit'
                >
                  Edit Path
                </Link>
              </div>
            )}
            {typeof pathTemplate.handleActivation === 'function' &&
              pathTemplate.organization && (
                <Tooltip
                  content={
                    pathTemplate.active
                      ? 'Visible on dashboard'
                      : 'Not visible on dashboard'
                  }
                  style={{ display: 'inherit', marginLeft: '5px' }}
                  fontSize='11px'
                  padding={3}
                >
                  <i
                    className={`icon ${
                      pathTemplate.active ? 'icon-eye-17' : 'icon-b-preview'
                    } icon-clickable`}
                    style={{ color: '#8494B2', fontSize: '20px' }}
                    onClick={() =>
                      pathTemplate.handleActivation(
                        pathTemplate._id,
                        !pathTemplate.active
                      )
                    }
                  />
                </Tooltip>
              )}
            {pathTemplate.organization !== null && pathTemplate.permissions && (
              <>
                <i
                  className='el-icon-delete icon-delete-red'
                  style={{ fontSize: '20px', marginLeft: '5px' }}
                  onClick={() => pathTemplate.handleDeletion(pathTemplate._id)}
                />
              </>
            )}
          </div>
        </td>
      </tr>
      {expanded &&
        pathTemplate.goalTemplates.map((goalTemplate, index) => (
          <GoalTemplateItem
            {...goalTemplate}
            organization={pathTemplate.organization}
            indent
            index={index}
          />
        ))}
    </React.Fragment>
  )
}

const PathTable = ({
  pathTemplates = [],
  handleDeletion = () => {},
  handleAssignment = () => {},
  handleActivatingPath,
  teamId,
  admin
}) => {
  const { _id: currentUserId } = useContext(UserContext)

  // const { search } = useLocation()
  // const tab = new URLSearchParams(search).get('tab')

  // const handleSort = () => {
  //   function compare(a, b) {
  //     if (a.assignee < b.assignee) {
  //       return -1
  //     }
  //     if (a.assignee > b.assignee) {
  //       return 1
  //     }
  //     return 0
  //   }

  //   pathTemplates.sort(compare)
  // }

  pathTemplates.sort((a, b) => {
    if (admin) {
      return !!b.organization - !!a.organization
    }

    const aPermission = a.curatedBy.userId === currentUserId
    const bPermission = b.curatedBy.userId === currentUserId

    return bPermission - aPermission
  })

  return (
    <table className='table'>
      <tbody>
        <tr>
          {!teamId ? (
            <td style={{ width: '265px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PathsIcon
                  className='table-icon--first'
                  style={{ marginRight: '5px', width: '15px' }}
                />
                {/* <img
                  width={15}
                  style={{ marginRight: '5px' }}
                  src={require('../../static/NewNav_assets/user-route-icons/paths.svg')}
                  alt=''
                /> */}
                Path name
              </div>
            </td>
          ) : (
            <td style={{ width: '265px' }}>
              <div style={{ display: 'flex' }}>
                <img
                  width={15}
                  style={{ marginRight: '5px' }}
                  src={require('../../static/NewNav_assets/user-route-icons/paths.svg')}
                  alt=''
                />
                Assigned Path
              </div>
            </td>
          )}
          <td style={{ width: '195px' }}>
            <div
              style={{
                display: 'flex'
              }}
              // onClick={handleSort}
            >
              <img
                width={15}
                style={{ marginRight: '5px' }}
                src={require('../../static/assignee.svg')}
                alt=''
              />
              Assignee
              {/* <img
                width={15}
                style={{ marginLeft: '5px' }}
                src={require('../../static/sort.svg')}
                alt=''
              /> */}
            </div>
          </td>
          <td>
            <div
              style={{
                display: 'flex',
                textAlign: 'center',
                width: 'fit-content',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
              // onClick={handleSort}
            >
              <img
                width={15}
                style={{ marginRight: '5px' }}
                src={require('../../static/check-circle.svg')}
                alt=''
              />
              Autoassign
              {/* <img
                width={15}
                style={{ marginLeft: '5px' }}
                src={require('../../static/sort.svg')}
                alt=''
              /> */}
            </div>
          </td>
          <td>
            <div
              style={{ display: 'flex' }}
              // onClick={handleSort}
            >
              {/* <img
                width={15}
                style={{ marginRight: '5px' }}
                src={require('../../static/filter.svg')}
                alt=''
              /> */}
              <FilterIcon
                className='table-icon'
                style={{ marginRight: '5px', width: '15px' }}
              />
              Curated by
              {/* <img
                  width={15}
                  style={{ marginLeft: '5px' }}
                  src={require('../../static/sort.svg')}
                  alt=''
                /> */}
            </div>
          </td>
          <td>
            <div style={{ display: 'flex', width: '160px' }}>
              <img
                width={15}
                style={{ marginRight: '5px' }}
                src={require('../../static/settings.svg')}
                alt=''
              />
              Settings
            </div>
          </td>
        </tr>
        {pathTemplates.map(
          ({
            _id,
            goalTemplate: goalTemplates,
            organization,
            curatedBy,
            ...pathTemplate
          }) => {
            return (
              <React.Fragment key={_id}>
                {!teamId ? (
                  <OrganizationPathTemplateItem
                    _id={_id}
                    {...pathTemplate}
                    goalTemplates={goalTemplates}
                    organization={organization}
                    handleActivation={handleActivatingPath}
                    handleAssignment={handleAssignment}
                    handleDeletion={handleDeletion}
                    curatedBy={curatedBy}
                    permissions={curatedBy.userId === currentUserId || admin}
                  />
                ) : (
                  <TeamPathTemplateItem
                    _id={_id}
                    teamId={teamId}
                    {...pathTemplate}
                    goalTemplates={goalTemplates}
                    organization={organization}
                    handleActivation={handleActivatingPath}
                    handleAssignment={handleAssignment}
                    handleDeletion={handleDeletion}
                    curatedBy={curatedBy}
                    permissions={curatedBy.userId === currentUserId || admin}
                  />
                )}
              </React.Fragment>
            )
          }
        )}
        {pathTemplates.length === 0 && (
          <tr>
            <th colSpan={!teamId ? 5 : 4}>Nothing to display</th>
          </tr>
        )}
      </tbody>
      <style>{tableStyle}</style>
    </table>
  )
}

const PathListWithHeader = ({
  teamId,
  // isOpen,
  // onToggle: handleToggle,
  title,
  handleDeletion,
  handleAssignment,
  handleActivatingPath,
  pathTemplates,
  admin
}) => {
  return (
    <div>
      <div className='align-left'>
        {teamId ? (
          <Link to={`/team/${teamId}`}>
            <h3>{title}</h3>
          </Link>
        ) : (
          <h3>{title}</h3>
        )}
      </div>
      <div>
        <PathTable
          pathTemplates={pathTemplates}
          handleDeletion={handleDeletion}
          handleAssignment={handleAssignment}
          handleActivatingPath={admin ? handleActivatingPath : null}
          teamId={teamId}
          admin={admin}
        />
      </div>
      <br />
    </div>
  )
}

const tabIndex = {
  organization: 0,
  team: 1
}

const tabs = Object.keys(tabIndex)

const OrganizationPathView = ({
  deleteOrganizationLearningPath,
  changeLearningPathsStatus,
  currentUser
}) => {
  const { setAssigningPath /*, setCurrentAssignee*/ } = Container.useContainer()

  const { data, loading, error } = useQuery(fetchOrganizationLearningPath, {
    fetchPolicy: 'cache-and-network'
  })
  // const {
  //   data: currentUserOrganizationName,
  //   loading: currentUserOrganizationNameLoading,
  //   error: currentUserOrganizationNameError
  // } = useQuery(fetchCurrentUserOrganizationName)

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    const pathTemplates = data.fetchOrganizationLearningPath

    const organizationPaths = pathTemplates.filter(p => p.organization)
    const otherPaths = pathTemplates.filter(p => !p.organization)

    return (
      <>
        <PathListWithHeader
          title={`Made by ${currentUser?.organizationName}`}
          pathTemplates={organizationPaths}
          handleDeletion={pathId =>
            handleDeletingPath(deleteOrganizationLearningPath, pathId)
          }
          handleAssignment={pathId => {
            // setCurrentAssignee(assignee)
            setAssigningPath(pathTemplates.find(({ _id }) => _id === pathId))
          }}
          handleActivatingPath={(pathId, value) =>
            handleActivatingPath(changeLearningPathsStatus, [pathId], value)
          }
          admin={true}
        />
        {otherPaths.length > 0 && (
          <PathListWithHeader
            title='Made by Innential'
            pathTemplates={otherPaths}
            handleDeletion={pathId =>
              handleDeletingPath(deleteOrganizationLearningPath, pathId)
            }
            handleAssignment={pathId => {
              // setCurrentAssignee(assignee)
              setAssigningPath(pathTemplates.find(({ _id }) => _id === pathId))
            }}
            handleActivatingPath={(pathId, value) =>
              handleActivatingPath(changeLearningPathsStatus, [pathId], value)
            }
            admin={true}
          />
        )}
      </>
    )
  }
  return null
}

const TeamPathView = ({
  deleteOrganizationLearningPath,
  changeLearningPathsStatus,
  admin
}) => {
  const { setAssigningPath /*, setCurrentAssignee*/ } = Container.useContainer()

  const { loading, error, data } = useQuery(fetchTeamLearningPath, {
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    const teamPaths = data.fetchTeamLearningPath

    if (teamPaths.length === 0) {
      return <PathTable pathTemplates={[]} />
    }

    // teamPaths.forEach(({ learningPaths }) => {
    //   learningPaths.sort((a, b) => !!b.organization - !!a.organization)
    // })

    return teamPaths.map(({ _id, teamId, teamName, learningPaths }) => (
      <PathListWithHeader
        key={_id}
        teamId={teamId}
        title={teamName}
        pathTemplates={learningPaths}
        handleDeletion={pathId =>
          handleDeletingPath(deleteOrganizationLearningPath, pathId)
        }
        handleAssignment={pathId => {
          // setCurrentAssignee(assignee)
          setAssigningPath(learningPaths.find(({ _id }) => _id === pathId))
        }}
        handleActivatingPath={(pathId, value) =>
          handleActivatingPath(changeLearningPathsStatus, [pathId], value)
        }
        admin={admin}
      />
    ))
  }
  return null
}

export default ({ currentUser }) => {
  const admin = currentUser.roles.indexOf('ADMIN') !== -1

  const history = useHistory()

  const { search } = useLocation()

  const tab = new URLSearchParams(search).get('tab')

  const activeIndex = tab ? tabIndex[tab] : 0

  const [mutation] = useMutation(deleteOrganizationLearningPath)
  const [mutation2] = useMutation(changeLearningPathsStatus)

  return (
    <div className='path-management__wrapper'>
      <div
        style={{
          position: 'absolute',
          right: '16px'
        }}
      >
        <Link to='/path-templates/form'>
          <Button type='primary' style={{ fontWeight: 'bold' }}>
            Add new learning path
            <img
              width={15}
              style={{ marginLeft: '5px' }}
              src={require('../../static/plus-circle-white.svg')}
              alt=''
            />
          </Button>
        </Link>
      </div>
      {admin ? (
        <Tabs
          className='subtabs'
          initialActiveTabIndex={activeIndex}
          onChange={i =>
            history.replace(`/learning-paths/organization?tab=${tabs[i]}`)
          }
        >
          <TabsList>
            <Tab>Organization</Tab>
            <Tab>Team</Tab>
          </TabsList>
          <TabContent>
            <OrganizationPathView
              currentUser={currentUser}
              deleteOrganizationLearningPath={mutation}
              changeLearningPathsStatus={mutation2}
            />
          </TabContent>
          <TabContent>
            <TeamPathView
              deleteOrganizationLearningPath={mutation}
              changeLearningPathsStatus={mutation2}
              admin={true}
            />
          </TabContent>
        </Tabs>
      ) : (
        <div>
          <h3 className='align-left'>Team paths</h3>
          <br />
          <TeamPathView
            deleteOrganizationLearningPath={mutation}
            changeLearningPathsStatus={mutation2}
            admin={false}
          />
        </div>
      )}
      <style>{roleManagementStyle}</style>
      <style>{pathManagementStyle}</style>
    </div>
  )
}
