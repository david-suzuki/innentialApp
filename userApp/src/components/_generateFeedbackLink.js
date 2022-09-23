import React, { useState } from 'react'
import { Button, Input } from 'element-react'
// import {
//   Tabs,
//   TabsList,
//   Tab,
//   TabContent,
//   UserItems,
//   List
// } from './ui-components'
// import { useMutation } from 'react-apollo'
// import { generateUserFeedbackLinks } from '../api'
import generateFeedbackStyle from '../styles/generateFeedbackStyle'
import { Link, withRouter, Route, Switch, Redirect } from 'react-router-dom'
import { SentryDispatch, LoadingSpinner } from './general'
// import { remapEmployeesForUI } from './teams/_teamUtils'
import {
  UserFeedbackRequest,
  UserPendingRequest,
  UserFeedbackList,
  FeedbackRequestPopup,
  UserFeedbackReceipts
} from './team-evaluate'
import { BodyPortal } from './ui-components'
import skillItemStyle from '../styles/skillItemStyle'
import { useQuery } from 'react-apollo'
import { fetchCurrentUserOrganizationTeams } from '../api'

const tabs = {
  received: 0,
  request: 1
}

const tabNames = Object.keys(tabs)

const FeedbackRequestPage = ({
  currentUser,
  activeIndex,
  history,
  queryDecider,
  teammates
}) => {
  const [visible, setVisible] = useState(false)
  return (
    <div className='generate-feedback__wrapper'>
      <div className='absolute-feedback'>
        <Button
          onClick={() => setVisible(true)}
          className='generate-feedback__button-request el-button--green'
        >
          Request
        </Button>
      </div>

      <FeedbackRequestPopup
        visible={visible}
        setVisible={setVisible}
        publicLink={currentUser.publicLink}
        currentUser={currentUser}
      />
      {/* <div className='page-header'>Feedback</div> */}
      {/* <Tabs
        className='generate-feedback__tabs'
        initialActiveTabIndex={activeIndex}
        onChange={tabIndex =>
          history.push(`/feedback-page?tab=${tabNames[tabIndex]}`)
        }
      > */}
      {/* <TabsList>
          <Tab>Received</Tab>
          <Tab>Requests</Tab>
        </TabsList> */}
      <Switch>
        <Route path='/feedback-page/received'>
          <UserFeedbackList />
        </Route>
        <Route path='/feedback-page/pending'>
          <UserPendingRequest />
        </Route>
        <Route path='/feedback-page/given'>
          <UserFeedbackReceipts />
        </Route>
        <Route path='/feedback-page/requests'>
          <UserFeedbackRequest />
        </Route>
        <Redirect to='/feedback-page/received' />
      </Switch>
      {/* </Tabs> */}

      <BodyPortal>
        <Button
          onClick={() => setVisible(true)}
          className='skills-filter-button el-button--green'
        >
          Request
        </Button>
      </BodyPortal>
      <style jsx>{generateFeedbackStyle}</style>
      <style jsx>{skillItemStyle}</style>
    </div>
  )
}

export default withRouter(
  ({ currentUser, history, location: { search }, queryDecider }) => {
    const searchStrings = search && search.split('?')[1].split('&')
    const tabSearch =
      searchStrings && searchStrings.find(str => str.indexOf('tab') === 0)
    const activeIndex = (tabSearch && tabs[tabSearch.split('=')[1]]) || 0

    const { data, loading, error } = useQuery(fetchCurrentUserOrganizationTeams)

    if (loading) return <LoadingSpinner />

    if (error) {
      return <SentryDispatch error={error} />
    }

    const currentUserTeams = data?.fetchCurrentUserOrganization?.teams || []

    const teammates = currentUserTeams
      .reduce((acc, team) => {
        const { members, leader } = team
        const array = []
        if (!acc.some(memberInArray => memberInArray._id === leader._id)) {
          array.push(leader)
        }
        members.forEach(member => {
          if (!acc.some(memberInArray => memberInArray._id === member._id)) {
            array.push(member)
          }
        })
        return [...acc, ...array]
      }, [])
      .filter(employee => employee._id !== currentUser._id)

    if (currentUser.premium) {
      return (
        // <>
        //   <div className='page-heading'>
        //     <i
        //       className='page-heading__back__button icon icon-small-right icon-rotate-180'
        //       onClick={() => history.goBack()}
        //     />
        //     <div className='page-heading-info'>
        //       <h1>Feedback</h1>
        //     </div>
        //   </div>
        <FeedbackRequestPage
          currentUser={currentUser}
          // initialLink={initialLink}
          activeIndex={activeIndex}
          history={history}
          teammates={teammates}
        />
        // </>
      )
    } else {
      return null
    }
  }
)
