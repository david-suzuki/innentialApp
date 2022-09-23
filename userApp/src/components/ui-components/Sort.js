import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import { currentUserPreferredTypes, updateLearningPreferences } from '../../api'
import '../../styles/theme/notification.css'
import { captureFilteredError } from '../general'
import listStyle from '../../styles/listStyle'

class Sort extends Component {
  constructor(props) {
    super(props)

    this.sortMethods = this.props.onTeamPage
      ? [
          {
            label: 'Newest',
            value: 'DATE'
          },
          {
            label: 'Teams',
            value: 'TEAMS'
          }
        ]
      : [
          {
            label: 'Newest',
            value: 'DATE'
          },
          {
            label: 'Relevance',
            value: 'RELEVANCE'
          }
        ]

    this.state = {
      activeDropdown: false,
      currentMethod: this.sortMethods.filter(
        method => method.value === props.sortMethod
      )[0]
    }
  }

  componentWillReceiveProps({ ...props }) {
    const { sortMethod } = props
    this.setState({
      currentMethod: this.sortMethods.filter(
        method => method.value === sortMethod
      )[0]
    })
  }

  toggleDropdown = () => {
    this.setState({ activeDropdown: !this.state.activeDropdown })
  }

  changeSortMethod = sortMethod => {
    const { onTeamPage, onSortChange, setSortMethod } = this.props
    if (onTeamPage && onSortChange) {
      onSortChange(sortMethod)
      this.toggleDropdown()
      return
    }

    if (typeof setSortMethod === 'function') setSortMethod(sortMethod)

    this.props
      .mutation({
        variables: {
          sortMethod
        }
      })
      .then(({ data }) => {
        if (data && data.updateLearningPreferences === 'Success') {
          // Notification({
          //   type: 'success',
          //   message: 'Your changes have been submitted',
          //   duration: 2500,
          //   offset: 90
          // })
          this.toggleDropdown()
        }
        // else {
        //   Notification({
        //     type: 'warning',
        //     message: 'Oops something went wrong',
        //     duration: 2500,
        //     offset: 90
        //   })
        // }
      })
      .catch(e => {
        captureFilteredError(e)
        // Notification({
        //   type: 'error',
        //   message: 'Oops something went wrong',
        //   duration: 2500,
        //   offset: 90
        // })
      })
  }

  render() {
    const label =
      this.state && this.state.currentMethod && this.state.currentMethod.label
    const { activeDropdown } = this.state
    return (
      <div className='list-sort'>
        <div className='list-sort__inner'>
          <div className='list-sort__label'>
            <i className='icon icon-filter' />
            Sort by: <span onClick={this.toggleDropdown}>{label}</span>
          </div>
          <div
            className={
              activeDropdown
                ? 'list__dropdown list__dropdown--sort is-active'
                : 'list__dropdown list__dropdown--sort'
            }
          >
            <ul>
              {this.sortMethods.map((method, ix) => {
                const { value, label } = method
                return (
                  <li key={ix}>
                    <a onClick={() => this.changeSortMethod(value)}>{label}</a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <style jsx>{listStyle}</style>
      </div>
    )
  }
}

const SortQueryWrapper = props => (
  <Query query={currentUserPreferredTypes}>
    {({ data, loading, error }) => {
      if (loading) return null
      if (error) return null
      if (data && data.currentUserPreferredTypes) {
        const { sortMethod } = data && data.currentUserPreferredTypes
        return (
          <Mutation
            mutation={updateLearningPreferences}
            refetchQueries={[
              'currentUserPreferredTypes',
              'fetchRelevantContentForUser',
              'fetchSharedInTeamContent',
              'fetchLearningPathsForDashboard',
              'searchLearningContent'
            ]}
          >
            {updateLearningPreferences => (
              <Sort
                {...props}
                sortMethod={props.onTeamPage ? props.sortMethod : sortMethod}
                mutation={updateLearningPreferences}
              />
            )}
          </Mutation>
        )
      }
      return null
    }}
  </Query>
)

export default SortQueryWrapper
