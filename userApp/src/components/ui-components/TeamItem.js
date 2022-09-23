import React, { Component } from 'react'
import teamItemStyle from '../../styles/teamItemStyle'
import actionDropdownStyle from '../../styles/actionDropdownStyle'
import chartPlaceholder from '../../static/chartPlaceholder.png'
import { withRouter } from 'react-router-dom'

class TeamItem extends Component {
  state = {
    activeDropdown: false
  }

  dropdownOptions = this.props.dropdownOptions
    ? this.props.dropdownOptions
    : [
        {
          value: 'test',
          boundFunction: function() {
            console.log('test')
          }
        },
        {
          value: 'krrrrraa',
          boundFunction: function() {
            console.log('eaaaasy')
          }
        },
        {
          value: 'easy math',
          boundFunction: function() {
            console.log('math')
          }
        }
      ]

  toggleDropdown = () => {
    this.setState({ activeDropdown: !this.state.activeDropdown })
  }

  routeToTeamDetails = teamId => {
    this.props.history.push(`/team/${teamId}`)
  }

  render() {
    const {
      teamNumber,
      department,
      count,
      // engagement,
      // engagementArrow,
      // stage,
      chart,
      teamId
    } = this.props
    return (
      <div className='list-item team-item'>
        <div className='team-item__heading'>
          <div className='team-item__heading__info'>
            <div className='list-item__label'>Team {teamNumber}</div>
            <div className='list-item__title'>
              <a onClick={e => this.routeToTeamDetails(teamId)}>{department}</a>
            </div>
          </div>
          <div className='team-item__heading__count'>
            <i className='icon icon-multiple' />
            <span>{count}</span>
          </div>
        </div>
        <div className='team-item__content'>
          <div className='team-item__content__details'>
            {/* TEAM STAGE INFO REMOVED FOR NOW
            <div>
              Engagement:{' '}
              <span>
                {engagement}
                {engagementArrow ? (
                  <i className={`icon ${engagementArrow} `} />
                ) : (
                  <span className="team-item-dash">-</span>
                )}
              </span>
            </div>
            <div>
              Stage: <span>{stage}</span>
            </div> */}
            <a onClick={e => this.routeToTeamDetails(teamId)}>
              See team details
              <i className='icon icon-small-right' />
            </a>
          </div>
          {chart ? (
            <div className='team-item__content__chart'>
              <img src={chartPlaceholder} alt='chart' />
              <div className='list-item__label'>Skill gap</div>
            </div>
          ) : null}

          <div style={{ position: 'relative' }}>
            <div className='team-item__children' onClick={this.toggleDropdown}>
              {this.props.children}
            </div>
            <div
              className={
                this.state.activeDropdown
                  ? 'action-dropdown is-active'
                  : 'action-dropdown'
              }
              onMouseLeave={this.closeDropdownDelay}
            >
              <ul>
                {this.dropdownOptions.map((el, idx) => (
                  <li key={idx}>
                    <a onClick={e => el.boundFunction(teamId, department)}>
                      {el.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <style jsx>{teamItemStyle}</style>
        <style jsx>{actionDropdownStyle}</style>
      </div>
    )
  }
}

export default withRouter(({ history, ...props }) => (
  <TeamItem {...props} history={history} />
))
