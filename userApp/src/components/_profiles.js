import React, { useEffect, useState } from 'react'
import { withRouter, Redirect, Link } from 'react-router-dom'
import { Query, useMutation, useQuery } from 'react-apollo'
import {
  fetchUsersProfile,
  fetchDevelopmentPlanWithStats,
  fetchUsersGoals,
  inviteDisabledUser,
  fetchUserRoleGap,
  fetchNextRoles,
  fetchUserTeamsInOrganization,
  fetchNonUserTeamsInOrganization,
  fetchRoleGroups
} from '../api'
import { LoadingSpinner, captureFilteredError, SentryDispatch } from './general'
import { generateInitialsAvatar } from '$/utils'
import { Button, MessageBox, Notification, Select } from 'element-react'
import {
  SkillItemProfile,
  List,
  Location,
  Tabs,
  TabsList,
  Tab,
  TabContent,
  AddToTeamPopup,
  DevelopmentPlanOverviewTabs,
  Statement,
  GoalItem,
  RoleSelector,
  ChartLegend,
  ProfileFeedbackChart,
  ChangeView
} from './ui-components'
import DevelopmentPlans from './user-profile/DevelopmentPlans'
import profilesStyle from '../styles/profilesStyle'
import developmentPlanStyle from '../styles/developmentPlanStyle'
import SkillGapsChart from './ui-components/SkillGapChart'
// import UserFeedbackList from './team-evaluate/UserFeedbackList'
import { ProfileFeedbackList } from './team-evaluate'
import { ReactComponent as PageIcon } from '$/static/page-icon.svg'

const findEvaluatedLevel = (skillId, evaluatedSkills) => {
  const evaluatedSkill = evaluatedSkills.find(sk => sk.skillId === skillId)
  if (evaluatedSkill) return evaluatedSkill.evaluatedLevel
  else return 0
}

const sortedSkills = skills => {
  return skills.sort((a, b) => {
    let aValue = a.level
    let bValue = b.level
    if (a.evaluatedLevel) {
      aValue = a.evaluatedLevel
    }
    if (b.evaluatedLevel) {
      bValue = b.evaluatedLevel
    }
    return bValue - aValue
  })
}

const getDataForSkillGapChart = skills => {
  const labels = []
  const available = []
  const needed = []
  skills
    // .filter(skill => !!skill.skillNeeded)
    .forEach(skill => {
      labels.push(skill.name)
      available.push(skill.skillAvailable)
      needed.push(skill.skillNeeded)
    })
  return { labels, skills: { available, needed } }
}

const RoleFit = ({
  user,
  roleId: currentRoleId,
  roleAtWork: currentRoleName,
  name
}) => {
  const [roleId, setRoleId] = useState(currentRoleId)
  const [roleName, setRoleName] = useState(currentRoleName)
  const [selectValue, setSelectValue] = useState(currentRoleId)
  const [roleValue, setRoleValue] = useState('')

  const { data: nextRoleData } = useQuery(fetchNextRoles, {
    variables: {
      roleId: currentRoleId
    }
  })

  const { data, loading, error } = useQuery(fetchUserRoleGap, {
    variables: {
      user,
      roleId
    },
    fetchPolicy: 'cache-and-network'
  })

  // if (loading) return <LoadingSpinner />
  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const selectOptions = [
    <Select.Option
      label={`Current role (${currentRoleName})`}
      value={currentRoleId}
      key={currentRoleId}
    />
  ]

  const roleNames = {
    [currentRoleId]: currentRoleName
  }

  if (nextRoleData) {
    const { fetchNextRoles: nextRoles } = nextRoleData
    nextRoles.forEach(({ _id, title }) => {
      selectOptions.push(
        <Select.Option label={`Next role: (${title})`} value={_id} key={_id} />
      )
    })
    Object.assign(
      roleNames,
      nextRoles.reduce((acc, { _id, title }) => ({ ...acc, [_id]: title }), {})
    )
  }

  selectOptions.push(
    <Select.Option label='Specific role' value='specific' key='specific' />
  )

  return (
    <div className='profiles__tab-content'>
      <span className='profiles__career__heading'>
        <span>Show skill gap for: </span>
        <Select
          value={selectValue}
          onChange={value => {
            setSelectValue(value)
            if (value !== 'specific') {
              setRoleId(value)
              setRoleName(roleNames[value])
            }
          }}
        >
          {selectOptions}
        </Select>
      </span>
      {selectValue === 'specific' && (
        <RoleSelector
          organizationOnly
          value={roleValue}
          handleRoleChange={value => setRoleValue(value)}
          handleRoleSelect={role => {
            setRoleId(role._id)
            setRoleName(role.title)
          }}
          canSuggest={false}
          placeholder='Start typing to view suggestions'
        />
      )}
      {loading ? (
        <LoadingSpinner />
      ) : data?.fetchUserRoleGap?.length > 0 ? (
        <div style={{ margin: '40px 0px' }}>
          <SkillGapsChart
            width={640}
            height={640}
            {...getDataForSkillGapChart(data.fetchUserRoleGap)}
          />
          <br />
          <br />
          <ChartLegend
            availableLabel={`${name}'s skills`}
            neededLabel={roleName}
          />
        </div>
      ) : (
        <div className='statement-career'>
          <div className='statement-career__content'>
            <PageIcon />
            <div className='statement-career__content-text'>
              <p>Not enough data</p>
              <span>
                Select existing role from the dropdown to see more details
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const viewList = [
  { label: 'Chart', value: 'chart' },
  { label: 'List', value: 'list' }
]

const groupByCategory = skills =>
  Object.entries(
    skills.reduce((acc, curr) => {
      const { category } = curr
      return {
        ...acc,
        [category]: [...(acc[category] || []), curr]
      }
    }, {})
  )
    .map(([category, value]) => {
      return {
        label: category,
        callback: ({ category: c }) => c === category,
        count: value.length
      }
    })
    .sort((a, b) => b.count - a.count)

const SkillTab = ({
  feedbackData,
  skills,
  displayEvaluated,
  currentUser,
  name
}) => {
  const filterAll = { label: 'All', callback: () => true, count: skills.length }
  const splitByCategory = skills.length > 10

  const categoryList = splitByCategory
    ? [skills.length < 12 && filterAll, ...groupByCategory(skills)].filter(
        i => !!i
      )
    : []

  const [filter, setFilter] = useState(categoryList[0] || filterAll)

  const filteredSkills = skills.filter(filter.callback)

  const [view, setView] = useState(
    filteredSkills.length > 2 ? viewList[0] : viewList[1]
  )

  const chartData = getDataForSkillGapChart(
    filteredSkills.map(
      ({ name, level: skillAvailable, evaluatedLevel: skillNeeded }) => ({
        name,
        skillAvailable,
        skillNeeded
      })
    )
  )

  return (
    <div className='profiles__tab-content'>
      <ChangeView
        view={view.label}
        viewMethodList={viewList}
        changeViewMethod={method => {
          if (filter.count > 2 || method.value !== 'chart') {
            setView(method)
          } else {
            Notification({
              type: 'warning',
              message: 'You need at least 3 skills to generate a chart',
              duration: 2500,
              offset: 90
            })
          }
        }}
        filter={filter.label}
        filterList={categoryList}
        changeFilter={method => {
          setFilter(method)
          if (method.count < 3) {
            setView({ label: 'List', value: 'list' })
          } else setView({ label: 'Chart', value: 'chart' })
        }}
      />
      {view.value === 'chart' ? (
        <div>
          <ProfileFeedbackChart
            {...chartData}
            corporate={currentUser.corporate}
            premium={currentUser.premium}
          />
          <br />
          <br />
          <ChartLegend
            availableLabel='Self-evaluation'
            neededLabel='Feedback'
            hideNeeded={!currentUser.premium}
          />
        </div>
      ) : (
        <List profileList>
          {sortedSkills(filteredSkills).map(
            ({ name, level, skillId, evaluatedLevel }) => {
              const feedback = feedbackData.find(s => s.skillId === skillId)
              const tooltip =
                feedback &&
                feedback.feedback.map(({ evaluatedLevel, evaluatedAt }) => ({
                  name: new Date(evaluatedAt).toDateString(),
                  level: evaluatedLevel
                }))
              return (
                <SkillItemProfile
                  key={skillId}
                  name={name}
                  level={level}
                  evaluatedLevel={evaluatedLevel}
                  displayEvaluated={displayEvaluated && currentUser.premium}
                  tooltip={tooltip}
                />
              )
            }
          )}
        </List>
      )}
    </div>
  )
}

const ProfilesPage = ({
  _id,
  history,
  email,
  firstName = '',
  lastName = '',
  roleAtWork = '',
  leader,
  roleId,
  roles,
  teamInfo,
  previousTeams,
  imageLink,
  status,
  skillsProfile,
  evaluatedSkills,
  currentUser,
  userTeams,
  nonUserTeams,
  location,
  rawFeedback = [],
  activeGoals = [],
  privateGoals = []
}) => {
  const { data: organizationRoles } = useQuery(fetchRoleGroups)
  const orgRoles = organizationRoles?.fetchRoleGroups.filter(
    group => group.relatedRoles.length > 0
  )
  const [sendInvite, { loading }] = useMutation(inviteDisabledUser, {
    refetchQueries: [{ query: fetchUsersProfile, variables: { userId: _id } }]
  })

  const selectedInterests = skillsProfile?.selectedInterests || []
  const usersSkills = skillsProfile?.selectedWorkSkills || []
  const growthSkills = skillsProfile?.neededWorkSkills || []

  const isAdmin = roles.indexOf('ADMIN') !== -1

  const withEvaluatedSkills = usersSkills.map(
    ({ name, level, skillId, category }) => ({
      name,
      level,
      skillId,
      category,
      evaluatedLevel: findEvaluatedLevel(skillId, evaluatedSkills)
    })
  )

  withEvaluatedSkills.sort((a, b) => {
    if (!a.evaluatedLevel && !b.evaluatedLevel) {
      return b.level - a.level
    } else {
      if (!a.evaluatedLevel && b.evaluatedLevel) return 1
      else if (!b.evaluatedLevel && a.evaluatedLevel) return -1
      else return b.evaluatedLevel - a.evaluatedLevel
    }
  })

  // const [mutation, { loading }] = useMutation()

  /* 
    NOTE: WE DON'T USE CANVIEWPROFILE ANYMORE: YOU CAN SEE SKILL
    LEVELS OF EVERYONE IN ORGANIZATION, BUT ONLY ADMIN AND LEADER 
    OF TEAM CAN SEE WHICH IS EVALUATED/SELF
  */
  // let canViewProfile = false

  let displayEvaluated = false
  if (currentUser.corporate) displayEvaluated = true
  if (currentUser.roles.indexOf('ADMIN') !== -1) displayEvaluated = true
  else if (_id === currentUser._id) displayEvaluated = true
  else if (userTeams.length > 0) {
    userTeams.forEach(({ teamName, leader }) => {
      if (leader._id === currentUser._id) displayEvaluated = true
    })
  }

  const SkillTag = ({ label }) => (
    <span className='profile__skill-tag'>{label}</span>
  )

  return (
    <div className='profiles'>
      <div className='profiles__heading'>
        <div style={{ width: '40px' }}>
          <i className='icon icon-small-right' onClick={history.goBack} />
        </div>
        <div className='profiles__user-image'>
          <img
            src={
              imageLink ||
              generateInitialsAvatar({
                firstName,
                lastName,
                _id
              })
            }
            alt='I'
          />
        </div>
        <div className='profiles__personal-info'>
          {isAdmin && <p className='profiles__role admin'>Administrator</p>}
          {!isAdmin && leader && (
            <p className='profiles__role leader'>Leader</p>
          )}
          {!isAdmin && !leader && (
            <p className='profiles__role employee'>Employee</p>
          )}
          {displayEvaluated && currentUser._id !== _id ? (
            <div className='profiles__user-heading'>
              <div className='profiles__user-name'>
                {firstName ? `${firstName} ${lastName}` : email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {currentUser.roles.indexOf('ADMIN') !== -1 && (
                  <AddToTeamPopup
                    _id={_id}
                    email={email}
                    userTeams={userTeams}
                    allTeams={[...userTeams, ...nonUserTeams]}
                  />
                )}
                {currentUser.premium && (
                  <Link
                    // className='profiles__skills-title__link'
                    to={{
                      pathname: '/evaluate-employee',
                      state: {
                        userId: _id,
                        fullName: firstName
                          ? `${firstName} ${lastName}`
                          : email,
                        redirect: `/profiles/${_id}`
                      }
                    }}
                  >
                    <Button
                      type={currentUser.corporate ? 'primary' : 'text'}
                      style={{ marginLeft: '10px' }}
                    >
                      <div
                        style={{
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginRight: '6px'
                          }}
                          className='icon icon-exchange'
                        />
                        Give feedback
                      </div>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <p className='profiles__user-name'>{`${firstName} ${lastName}`}</p>
          )}
          {/* <p className="profiles__user-name">{`${firstName} ${lastName}`}</p> */}
          <p className='profiles__user-position'>{roleAtWork}</p>
          <div className='profiles__user-team'>
            <Tabs className='profiles__user-team__tabs'>
              <TabsList>
                <Tab>Current Teams</Tab>
                <Tab>Previous Teams</Tab>
              </TabsList>
              <TabContent>
                {teamInfo.length > 0 ? (
                  teamInfo.join(', ')
                ) : (
                  <span>&nbsp;</span>
                )}
              </TabContent>
              <TabContent>{previousTeams || <span>&nbsp;</span>}</TabContent>
            </Tabs>
          </div>
          <div className='profiles__email'>
            <i className='icon icon-send' />
            <a href={`mailto: ${email}`} target='_blank'>
              {email}
            </a>
          </div>
          <div className='profiles__location'>
            {location && <Location location={location} />}
          </div>
        </div>
      </div>
      {/* PERSONAL GROWTH */}
      <div className='profiles__interests-wrapper'>
        {growthSkills.length > 0 ? (
          <div className='profiles__interests'>
            <div className='profiles__interests-title'>Wants to learn</div>
            {growthSkills.map(({ name }) => (
              <SkillTag key={Math.random()} label={name} />
            ))}
          </div>
        ) : null}
        {/* INTERESTS */}
        {selectedInterests.length > 0 ? (
          <div className='profiles__interests'>
            <div className='profiles__interests-title'>Interests</div>
            {selectedInterests.map(({ name }) => (
              <Button key={Math.random()} size='mini'>
                {name}
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      {/* SKILLS LIST */}
      {!displayEvaluated && usersSkills.length > 0 && (
        <div className='profiles__skills-wrapper'>
          <div className='profiles__skills-title'>
            <span>Skills</span>
          </div>
          <SkillTab
            skills={withEvaluatedSkills}
            feedbackData={rawFeedback}
            displayEvaluated={displayEvaluated}
            currentUser={currentUser}
            name={firstName}
          />
        </div>
      )}
      {displayEvaluated && (
        <Tabs className='profile__category-tabs'>
          <TabsList>
            <Tab>Skills</Tab>
            {currentUser.corporate && <Tab>Feedback</Tab>}
            {!currentUser.corporate && orgRoles?.length > 0 && (
              <Tab>Career</Tab>
            )}
            {/* {currentUser._id !== _id &&
              status === 'active' &&
              !currentUser.corporate && <Tab>Active goals</Tab>} */}
            <Tab>Development Plan</Tab>
            {/* {status === 'active' && <Tab>Development Plan</Tab>} */}
          </TabsList>
          <TabContent>
            {usersSkills.length === 0 && (
              <Statement content='No skills to show' />
            )}
            {usersSkills.length > 0 && (
              <SkillTab
                skills={withEvaluatedSkills}
                feedbackData={rawFeedback}
                displayEvaluated={displayEvaluated}
                currentUser={currentUser}
                name={firstName || 'Employee'}
              />
            )}
          </TabContent>
          {currentUser.corporate && (
            <TabContent>
              <ProfileFeedbackList userId={_id} />
            </TabContent>
          )}
          {!currentUser.corporate && (
            <TabContent>
              <RoleFit
                user={_id}
                roleId={roleId}
                name={firstName || email}
                roleAtWork={roleAtWork}
              />
            </TabContent>
          )}
          {/* {currentUser._id !== _id &&
            status === 'active' &&
            !currentUser.corporate && (
              <TabContent>
                {activeGoals.length === 0 ? (
                  <Statement content="User doesn't have goals set" />
                ) : (
                  <>
                    {activeGoals.map(g => (
                      <GoalItem
                        key={g._id}
                        {...g}
                        showDevPlanButton
                        onDevPlanButtonClick={() =>
                          history.push(`/plan/${g._id}`)
                        }
                      />
                    ))}
                  </>
                )}
              </TabContent>
            )} */}
          {
            /*status === 'active' && */ <TabContent>
              <Query
                query={fetchDevelopmentPlanWithStats}
                fetchPolicy='cache-and-network'
                variables={{ userId: _id }}
              >
                {({ data, loading, error }) => {
                  if (loading) return <LoadingSpinner />
                  if (error) {
                    captureFilteredError(error)
                    return <Statement content='Oops! Something went wrong' />
                  }
                  const devPlanStats = data?.fetchDevelopmentPlanWithStats || []

                  if (devPlanStats.length > 0) {
                    return <DevelopmentPlans data={devPlanStats} />
                  }
                  return <Statement content='No development plan for user' />
                }}
              </Query>
            </TabContent>
          }
        </Tabs>
      )}
      {status === 'inactive' && currentUser.roles.indexOf('ADMIN') !== -1 && (
        <div className='page-footer page-footer--fixed'>
          <Link
            to={{
              pathname: '/edit/profile',
              state: {
                user: _id,
                initialData: {
                  firstName: firstName || '',
                  lastName: lastName || '',
                  roleAtWork: roleAtWork || '',
                  roleId,
                  skills: usersSkills
                }
              }
            }}
          >
            <Button className='el-button--green' size='large'>
              Edit profile
            </Button>
          </Link>
          <Button
            type='warning'
            size='large'
            loading={loading}
            onClick={() => {
              const mutate = async deleteData => {
                try {
                  const {
                    data: { inviteDisabledUser: result }
                  } = await sendInvite({
                    variables: {
                      userId: _id,
                      deleteData
                    }
                  })
                  if (result === 'OK') {
                    Notification({
                      type: 'success',
                      message: 'Invite sent',
                      duration: 2500,
                      offset: 90
                    })
                    history.goBack()
                  } else {
                    Notification({
                      type: 'warning',
                      message: 'Oops! Something went wrong',
                      duration: 2500,
                      offset: 90
                    })
                  }
                } catch (err) {
                  captureFilteredError(err)
                  Notification({
                    type: 'warning',
                    message: 'Oops! Something went wrong',
                    duration: 2500,
                    offset: 90
                  })
                }
              }
              MessageBox.confirm('', 'Invite employee to the platform?')
                .then(() => {
                  setTimeout(
                    () =>
                      MessageBox.confirm(
                        '',
                        'Would you like to clear profile information for this employee?',
                        {
                          cancelButtonText: 'No',
                          confirmButtonText: 'Yes'
                        }
                      )
                        .then(async () => {
                          await mutate(true)
                        })
                        .catch(async () => {
                          await mutate(false)
                        }),
                    300
                  )
                })
                .catch(() => {})
            }}
          >
            Invite
          </Button>
        </div>
      )}
      <style jsx>{profilesStyle}</style>
      <style jsx>{developmentPlanStyle}</style>
    </div>
  )
}
const Profiles = ({
  history,
  match: { params },
  currentUser,
  userTeams,
  nonUserTeams
}) => {
  if (!params || !params.userId) {
    history.goBack()
    return null
  }
  return (
    <Query
      query={fetchUsersProfile}
      variables={{ userId: params.userId }}
      fetchPolicy='cache-and-network'
    >
      {({ data, loading, error }) => (
        <Query query={fetchUsersGoals} variables={{ userId: params.userId }}>
          {({ data: goalData, loading: loadingGoal, error: errorGoal }) => {
            if (loading || loadingGoal) return <LoadingSpinner />

            if (error || errorGoal) {
              captureFilteredError(error)
              return <Redirect to='/error-page/404' />
            }

            if (data || goalData) {
              const activeGoals = goalData.fetchUsersGoals.filter(
                ({ status, isPrivate }) => status === 'ACTIVE' && !isPrivate
              )
              const privateGoals = goalData.fetchUsersGoals.filter(
                ({ status, isPrivate }) => status === 'ACTIVE' && isPrivate
              )
              const completeProfile = data.fetchUsersProfile
              if (completeProfile)
                return (
                  <ProfilesPage
                    activeGoals={activeGoals}
                    privateGoals={privateGoals}
                    history={history}
                    currentUser={currentUser}
                    userTeams={userTeams}
                    nonUserTeams={nonUserTeams}
                    {...completeProfile}
                  />
                )
              return null
            }
          }}
        </Query>
      )}
    </Query>
  )
}

export default withRouter(props => {
  const {
    data: userTeamsData,
    loading: userTeamsLoading,
    error: userTeamsError
  } = useQuery(fetchUserTeamsInOrganization, {
    variables: {
      userId: props.match.params.userId
    }
  })
  const {
    data: nonUserTeamsData,
    loading: nonUserTeamsLoading,
    error: nonUserTeamsError
  } = useQuery(fetchNonUserTeamsInOrganization, {
    variables: {
      userId: props.match.params.userId
    }
  })

  if (userTeamsLoading || nonUserTeamsLoading) return <LoadingSpinner />

  if (userTeamsError || nonUserTeamsError) {
    return <SentryDispatch error={userTeamsError || nonUserTeamsError} />
  }

  return (
    <Profiles
      {...props}
      userTeams={userTeamsData?.fetchUserTeamsInOrganization || []}
      nonUserTeams={nonUserTeamsData?.fetchNonUserTeamsInOrganization || []}
    />
  )
})
