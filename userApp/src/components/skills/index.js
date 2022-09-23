import React, { useState, useEffect } from 'react'
import { Dialog, Button } from 'element-react'
import { TeamSkills, Filters, OrganizationTab } from './components'
import {
  Tab,
  Tabs,
  TabsList,
  TabContent,
  ActionItem,
  BodyPortal
} from '../ui-components'
import skillItemStyle from '../../styles/skillItemStyle'
import history from '../../history'
import { Query } from 'react-apollo'
import { fetchOnboardedTeamsInOrganization } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { TeamSkillQuery } from './components/TeamSkills'

const TeamInviteAction = ({ onClick, numberOfTeams }) => {
  if (numberOfTeams > 0) return null
  return (
    <ActionItem button='Begin' onButtonClicked={onClick} purpleBackground>
      Invite employees and teams to start!'
    </ActionItem>
  )
}

const Skills = ({ allTeams }) => {
  const [searchString, setSearchString] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [displayRequired, setDisplayRequired] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)

  const isOnOrganizationTab = activeTab === 1

  allTeams.sort((a, b) => {
    const aDate = new Date(a.createdAt)
    const bDate = new Date(b.createdAt)
    return bDate - aDate
  })

  // const teamsToRender =
  //   Array.isArray(allTeams) &&
  //   allTeams.filter((t, i) => {
  //     if (selectedTeam === 'All Teams') return true
  //     else if (selectedTeam) return t.teamName === selectedTeam
  //     else return true
  //   })

  const teamsLength = Array.isArray(allTeams) && allTeams.length

  useEffect(() => {
    const handleScroll = event => {
      if (!event || !event.target || !event.target.scrollingElement) return
      const {
        scrollHeight,
        scrollTop,
        clientHeight
      } = event.target.scrollingElement
      if (scrollTop + clientHeight === scrollHeight) {
        setDisplayIndex(
          displayIndex + 1 >= teamsLength ? teamsLength : displayIndex + 1
        )
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [displayIndex, teamsLength])

  return (
    <div className='skills-container'>
      <div className='skills__filter'>
        <Filters
          searchString={searchString}
          setSearchString={setSearchString}
          setDisplayIndex={() => setDisplayIndex(teamsLength)}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          displayRequired={displayRequired}
          setDisplayRequired={setDisplayRequired}
          allTeams={allTeams}
          isOnOrganizationTab={isOnOrganizationTab}
        />
      </div>
      <Tabs onChange={tabIndex => setActiveTab(tabIndex)} className='subtabs'>
        <TabsList>
          <Tab>Teams</Tab>
          <Tab>Organization</Tab>
        </TabsList>
        <TabContent>
          <div className='tab-content tab-content--no-bg-shadow tab-content--2-columns'>
            {allTeams.length === 0 ? (
              <TeamInviteAction
                onClick={e => {
                  e.preventDefault()
                  history.push('/create/teams')
                }}
                numberOfTeams={allTeams.length}
              />
            ) : selectedTeam ? (
              <TeamSkillQuery
                teamId={selectedTeam}
                teamName={
                  allTeams.find(({ _id }) => _id === selectedTeam)?.teamName ||
                  ''
                }
                search={searchString}
                displayRequired={displayRequired}
              />
            ) : (
              <TeamSkills
                search={searchString}
                displayRequired={displayRequired}
              />
            )}
          </div>
        </TabContent>
        <TabContent>
          <div className='tab-content tab-content--no-bg-shadow tab-content--2-columns'>
            <OrganizationTab searchString={searchString} />
          </div>
        </TabContent>
      </Tabs>
      <Dialog
        visible={dialogVisible}
        onCancel={() => setDialogVisible(false)}
        lockScroll={false}
      >
        <Dialog.Body>
          <Filters
            searchString={searchString}
            setSearchString={setSearchString}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            displayRequired={displayRequired}
            setDisplayRequired={setDisplayRequired}
            allTeams={allTeams}
            isOnOrganizationTab={isOnOrganizationTab}
            isInDialog
          />
          <Button
            className='el-button--primary'
            onClick={() => setDialogVisible(false)}
          >
            Filter
          </Button>
        </Dialog.Body>
      </Dialog>
      <BodyPortal>
        <Button
          onClick={() => setDialogVisible(true)}
          className='skills-filter-button el-button--green'
        >
          Filters
        </Button>
      </BodyPortal>

      <style jsx>{skillItemStyle}</style>
    </div>
  )
}

export default (/* { currentUser } */) => {
  // if (currentUser.roles.indexOf('ADMIN') === -1)
  //   return <Redirect to={{ pathname: '/' }} />
  return (
    <Query query={fetchOnboardedTeamsInOrganization}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return null
        }

        return <Skills allTeams={data.fetchOnboardedTeamsInOrganization} />
      }}
    </Query>
  )
}

// export default Skills
