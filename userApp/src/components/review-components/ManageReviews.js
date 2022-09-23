import React from 'react'
// import { Tabs, TabsList, Tab, Route } from '../ui-components/Tabs'
import reviewsStyle from '../../styles/manageReviewsStyle'
import { Button } from 'element-react'
import { Link, withRouter, Switch, Redirect, Route } from 'react-router-dom'
import {
  /* List, */ BodyPortal,
  ReviewItems,
  Statement
} from '../ui-components'
import { Query, Mutation } from 'react-apollo'
import {
  fetchOrganizationReviews,
  fetchOrganizationReviewSchedules,
  fetchUserReviews,
  deleteReviewTemplate,
  startReview,
  closeReview,
  fetchLeadersReviewSchedules
} from '../../api'
import { LoadingSpinner } from '../general'
import skillItemStyle from '../../styles/skillItemStyle'
// import UserItemReview from '../ui-components/UserItemReview'

const ManageReviews = ({
  history,
  location,
  /* admin, isLeader */ currentUser
}) => {
  // const activeIndex = location.state && location.state.activeIndex
  const admin = currentUser.roles.indexOf('ADMIN') !== -1
  const isLeader = currentUser.leader

  const scheduleQuery =
    !admin && isLeader
      ? fetchLeadersReviewSchedules
      : fetchOrganizationReviewSchedules
  const scheduleQueryName =
    !admin && isLeader
      ? 'fetchLeadersReviewSchedules'
      : 'fetchOrganizationReviewSchedules'

  return (
    <>
      <div className='manage-reviews'>
        {/* <div className='page-header'>Reviews</div> */}
        <div className='page-header absolute-manage-reviews'>
          {(admin || isLeader) && (
            <Link
              to={{
                pathname: '/create/reviews'
              }}
            >
              <Button className='el-button--green'>Schedule new review</Button>
            </Link>
          )}
        </div>

        <Query query={admin ? fetchOrganizationReviews : fetchUserReviews}>
          {({ data, loading, error }) => {
            if (loading) return <LoadingSpinner />
            if (error) return <Statement content='Oops! Something went wrong' />
            if (data) {
              const reviewData =
                data[admin ? 'fetchOrganizationReviews' : 'fetchUserReviews']

              const openReviews = reviewData.filter(
                ({ status }) => status === 'OPEN'
              )
              const closedReviews = reviewData.filter(
                ({ status }) => status === 'CLOSED'
              )
              closedReviews.sort(
                (a, b) => new Date(b.closedAt) - new Date(a.closedAt)
              )
              const upcomingReviews = reviewData.filter(
                ({ status }) => status === 'UPCOMING'
              )
              upcomingReviews.sort(
                (a, b) => new Date(a.startsAt) - new Date(b.startsAt)
              )

              return (
                <Switch>
                  {/* <TabsList>
                    <Tab>Open</Tab>
                    <Tab>Upcoming</Tab>
                    <Tab>Past</Tab>
                    {(admin || isLeader) && <Tab>Scheduled</Tab>}
                  </TabsList> */}
                  {/* OPEN REVIEWS */}
                  <Route path='/reviews/open'>
                    <div className='page-header'>{/* Open reviews */}</div>
                    {openReviews.length > 0 ? (
                      <Mutation
                        mutation={closeReview}
                        refetchQueries={[
                          'fetchOrganizationReviews',
                          'fetchUserReviews'
                        ]}
                      >
                        {mutate => (
                          <ReviewItems
                            items={openReviews}
                            listType='OPEN'
                            mutate={mutate}
                            // admin={admin}
                            currentUser={currentUser}
                          />
                        )}
                      </Mutation>
                    ) : (
                      <Statement content='Nothing to show' />
                    )}
                  </Route>
                  {/* UPCOMING REVIEWS */}
                  <Route path='/reviews/upcoming'>
                    {upcomingReviews.length > 0 ? (
                      <Mutation
                        mutation={startReview}
                        refetchQueries={[
                          'fetchOrganizationReviews',
                          'fetchUserReviews'
                        ]}
                      >
                        {mutate => (
                          <ReviewItems
                            items={upcomingReviews}
                            listType='UPCOMING'
                            mutate={mutate}
                            // admin={admin}
                            currentUser={currentUser}
                          />
                        )}
                      </Mutation>
                    ) : (
                      <Statement content='Nothing to show' />
                    )}
                  </Route>
                  {/* CLOSED REVIEWS */}
                  <Route path='/reviews/past'>
                    {closedReviews.length > 0 ? (
                      <ReviewItems
                        items={closedReviews}
                        listType='CLOSED'
                        // admin={admin}
                        currentUser={currentUser}
                      />
                    ) : (
                      <Statement content='Nothing to show' />
                    )}
                  </Route>
                  {/* SCHEDULE REVIEWS */}
                  {(admin || isLeader) && (
                    <Route path='/reviews/scheduled'>
                      <Mutation
                        mutation={deleteReviewTemplate}
                        refetchQueries={[
                          'fetchOrganizationReviews',
                          'fetchOrganizationReviewSchedules',
                          'fetchUserReviews',
                          'fetchLeadersReviewSchedules'
                        ]}
                      >
                        {(deleteReviewMutation, { loading, error }) => {
                          if (loading) return <LoadingSpinner />
                          if (error)
                            return (
                              <Statement content='Oops! Something went wrong' />
                            )
                          return (
                            <Query query={scheduleQuery}>
                              {({ data, loading, error }) => {
                                if (loading) return <LoadingSpinner />
                                if (error)
                                  return (
                                    <Statement content='Oops! Something went wrong' />
                                  )

                                if (data) {
                                  const scheduleData = data[scheduleQueryName]
                                  if (scheduleData && scheduleData.length > 0) {
                                    return (
                                      <ReviewItems
                                        items={scheduleData}
                                        listType='SCHEDULE'
                                        dropdownOptions={{
                                          routeFunction: history.push,
                                          deleteFunction: deleteReviewMutation
                                        }}
                                        currentUser={currentUser}
                                      />
                                    )
                                  }
                                }
                                return <Statement content='Nothing to show' />
                              }}
                            </Query>
                          )
                        }}
                      </Mutation>
                    </Route>
                  )}
                  <Route>
                    <Redirect to='/reviews/open' />
                  </Route>
                </Switch>
              )
            }
            return <Statement content='Nothing to show' />
          }}
        </Query>

        <BodyPortal>
          <Link to='/create/reviews'>
            <Button className='skills-filter-button el-button--green'>
              Schedule new review
            </Button>
          </Link>
        </BodyPortal>
      </div>
      <style jsx>{reviewsStyle}</style>
      <style jsx>{skillItemStyle}</style>
    </>
  )
}

export default withRouter(ManageReviews)
