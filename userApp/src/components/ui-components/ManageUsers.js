import React, { Component } from 'react'
import {
  List,
  TeamItems,
  UserItems,
  OrganizationSettings,
  ListSkillSelector,
  SkillFilter,
  BodyPortal,
  ActionItem
} from './'
// import {
//   fetchCurrentUserEmployees,
//   fetchStatsOverviewData,
//   fetchOnboardedTeamsInOrganization,
//   promoteUser,
//   fetchUsersProfile
// } from '../../api'
import '../../styles/theme/pagination.css'
// import { LoadingSpinner, captureFilteredError } from '../general'
// import { Tabs, TabsList, Tab, Route } from './Tabs'
import { Button, Input, Tag, Pagination, MessageBox, Form } from 'element-react'
import manageUsersStyle from '../../styles/manageUsersStyle'
import history from '../../history'
// import OrganizationCreate from '../user-onboarding/OrganizationCreate'
import SkillGap from '../skills'
import {
  ManageOrganizationRoles,
  ManageOrganizationPathTemplates
} from '../organization-settings'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import skillItemStyle from '../../styles/skillItemStyle'

// const tabs = ['teams', 'users', 'skills', 'settings', 'roles', 'path-templates']
// const buttonValues = {
//   teams: {
//     label: 'Create new team',
//     boundFunction: () => history.push('/create/teams')
//   },
//   users: {
//     label: 'Add new employee',
//     boundFunction: () => history.push('/create/users')
//   }
// }

class ManageUsers extends Component {
  state = {
    // activeTab: tabs[this.props.activeIndex],

    // userDropdownOptions: this.props.userDropdownOptions,
    teamDropdownOptions: this.props.teamDropdownOptions,
    searchString: '',
    skillSearch: []
    // creatingRole: false
  }

  // onCreate = e => {
  //   e.preventDefault()
  //   const tab = this.state.activeTab
  //   if (buttonValues[tab]) buttonValues[tab].boundFunction()
  // }

  filterUsers = users => {
    let { searchString, skillSearch } = this.props.filter
    skillSearch = skillSearch.map(skill => {
      const foundedSkill = this.props.appliedFilters.skillSearch.find(
        skillId => {
          return skillId == skill.skillId
        }
      )

      if (foundedSkill) {
        return skill
      } else {
        return undefined
      }
    })
    skillSearch = skillSearch.filter(value => {
      return value !== undefined
    })

    let filteredUsers = users

    if (skillSearch.length > 0) {
      filteredUsers = filteredUsers
        .map(({ skills, ...user }) => {
          const filteredSkills = skills
            .filter(({ skillId }) =>
              skillSearch.some(({ _id }) => _id === skillId)
            )
            .map(skill => ({
              ...skill,
              relevancyRating:
                5 -
                Math.abs(
                  skillSearch.find(({ _id }) => _id === skill.skillId).level -
                    skill.level
                )
            }))

          const skillsNotAvailable = skillSearch
            .filter(({ _id }) => !skills.some(({ skillId }) => _id === skillId))
            .map(skill => ({ ...skill, relevancyRating: 0, level: 0 }))

          return {
            ...user,
            skills: filteredSkills.concat(skillsNotAvailable)
          }
        })
        .filter(
          ({ skills }) =>
            skills.filter(({ relevancyRating }) => relevancyRating > 0).length >
            0
        )

      filteredUsers.sort(
        (a, b) =>
          b.skills.reduce(
            (acc, { relevancyRating }) => acc + relevancyRating,
            0
          ) -
          a.skills.reduce(
            (acc, { relevancyRating }) => acc + relevancyRating,
            0
          )
      )
    }

    return filteredUsers
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value })
  }

  handleSkillUpdate = (skillId, level) => {
    this.setState(({ skillSearch }) => ({
      skillSearch: skillSearch.map(({ _id, ...skill }) => {
        if (_id === skillId) {
          return {
            _id,
            ...skill,
            level
          }
        }
        return {
          _id,
          ...skill
        }
      })
    }))
  }

  handleSkillRemove = skillId => {
    this.setState(({ skillSearch }) => ({
      skillSearch: skillSearch.filter(({ _id }) => _id !== skillId)
    }))
  }

  render() {
    const {
      // activeTab,
      searchString,
      skillSearch /*, creatingRole */
    } = this.state

    const {
      user: { premium }
    } = this.props

    const selectorProps = {
      buttonClass: 'list-skill-selector__button-input',
      buttonValue: 'Search for skills...',
      skills: [],
      filterSkills: this.props.filter.skillSearch,
      onSkillsSubmit: skills => {
        this.props.handleChange('skillSearch', [
          ...this.props.filter.skillSearch,
          ...skills.map(skill => ({ ...skill, level: 1 }))
        ])
        this.props.applyFilter({
          skillSearch: skills.map(skill => skill.skillId),
          searchString: this.props.filter.searchString
        })
      },
      clearState: true
    }

    return (
      <div>
        <Switch
        // onChange={tabIndex => {
        //   this.props.onTabChange(tabs[tabIndex])
        //   this.setState({
        //     activeTab: tabs[tabIndex]
        //   })
        // }}
        // initialActiveTabIndex={tabs.findIndex(tab => tab === activeTab)}
        >
          {/* <TabsList>
              <Tab>Teams</Tab>
              <Tab>Users</Tab>
              {premium && [<Tab>Skills</Tab>, <Tab>Settings</Tab>]}
              <Tab>Roles</Tab>
              <Tab>Path Templates</Tab>
            </TabsList> */}
          <Route path='/organization/teams'>
            <div className='page-header page-header--button'>
              {/* Teams */}
              <div className='manage-users__button-container absolute-with-interc-draft'>
                <Link to='/create/teams'>
                  <Button className='el-button el-button--signin el-button--green'>
                    Create new team
                  </Button>
                </Link>
              </div>
            </div>

            <div className='tab-content'>
              <List>
                {this.props.teams.length === 0 && (
                  <ActionItem
                    button='Begin'
                    onButtonClicked={() => history.push('/create/teams')}
                    purpleBackground
                  >
                    Invite employees and teams to start!
                  </ActionItem>
                )}
                <TeamItems
                  items={this.props.teams}
                  teamDropdownOptions={this.state.teamDropdownOptions}
                />
              </List>
            </div>
            <BodyPortal>
              <Link to='/create/teams'>
                <Button className='skills-filter-button el-button--green'>
                  Create new team
                </Button>
              </Link>
            </BodyPortal>
          </Route>
          <Route path='/organization/users'>
            <div className='page-header page-header--button'>
              {/* Employees */}
              <div className='manage-users__button-container absolute-with-interc-draft'>
                <Link to='/create/users'>
                  <Button className='el-button el-button--signin el-button--green'>
                    Add new employee
                  </Button>
                </Link>
              </div>
            </div>

            <div className='manage-users__filters'>
              <Form
                onSubmit={e => {
                  e.preventDefault()
                  let skillSearch = this.props.filter.skillSearch.map(skill => {
                    return skill._id
                  })
                  this.props.resetPagination()
                  this.props.applyFilter({
                    skillSearch,
                    searchString: this.props.filter.searchString
                  })
                }}
              >
                <h4>Filters</h4>
                <Input
                  placeholder='Search for employees...'
                  value={this.props.filter.searchString}
                  onChange={val => {
                    this.props.handleSearchStringChange(val)
                  }}
                  icon='search'
                  className='manage-users__input'
                />
                <ListSkillSelector {...selectorProps} />
                {this.props.filter.skillSearch.map(skill => {
                  return (
                    <SkillFilter
                      key={skill._id}
                      name={skill.name}
                      level={skill.level}
                      updateSkillLevels={(name, level) => {
                        this.props.handleSkillUpdate(skill._id, level)
                      }}
                    >
                      <i
                        className='el-icon-delete icon-delete-red'
                        // style={{ position: 'absolute', top: '21px', right: '10px' }}
                        onClick={() => {
                          this.props.handleSkillRemove(skill._id)
                        }}
                      />
                    </SkillFilter>
                  )
                })}
                {/* <div style={{ margin: '15px 0px' }}>
                  {skillSearch.map(skill => (
                    <Tag
                      key={skill._id}
                      type="pale-lilac"
                      className="el-tag--pale-lilac-closable"
                      closable
                      onClose={() => this.handleTagClose(skill._id)}
                    >
                      {skill.name}
                    </Tag>
                  ))}
                </div> */}
                {this.props.filter.skillSearch.length > 0 && (
                  <span
                    className='link-button'
                    onClick={() => {
                      this.props.handleChange('skillSearch', [])
                      this.props.applyFilter({
                        skillSearch: [],
                        searchString: this.props.filter.searchString
                      })
                    }}
                  >
                    <i className='el-icon-close' />
                    Clear filter
                  </span>
                )}
                {/* <Checkbox
                  checked={skillSearch}
                  onChange={value => this.handleChange('skillSearch', value)}
                >
                  Search for employee skills
                </Checkbox> */}
              </Form>
            </div>

            <div className='tab-content'>
              <List className='organization-settings__list'>
                {this.filterUsers(this.props.users).length > 0 ? (
                  <UserItems
                    items={this.filterUsers(this.props.users)}
                    // userDropdownOptions={this.state.userDropdownOptions}
                    withSkills={this.props.filter.skillSearch.length > 0}
                  />
                ) : (
                  <div className='manage-users__no-results'>No results</div>
                )}
              </List>
              {this.props.totalEmployees > 20 && (
                <>
                  <br />
                  <br />
                  <Pagination
                    total={this.props.totalEmployees}
                    currentPage={this.props.employeesPage}
                    pageSize={20}
                    layout=' prev, pager, next'
                    pageSizes={[20]}
                    onCurrentChange={page => {
                      this.props.handleEmployeesPageChange(page)
                    }}
                  />
                </>
              )}
            </div>
            <br />
            <br />
            <BodyPortal>
              <Link to='/create/users'>
                <Button className='skills-filter-button el-button--green'>
                  Add new employee
                </Button>
              </Link>
            </BodyPortal>
          </Route>
          {/* {premium && ( */}
          <Route path='/organization/skills'>
            <div className='page-header page-header--button'>
              {/* Skill Gap */}
            </div>
            <SkillGap />
          </Route>
          {/* )} */}
          <Route path='/organization/settings'>
            <div className='page-header page-header--button'>
              {/* Organization settings */}
            </div>

            <div className='tab-content'>
              <OrganizationSettings
                organizationData={this.props.organizationData}
                premium={premium}
                // hasCustomFrameworks={this.props.hasCustomFrameworks}
              />
            </div>
          </Route>
          <Route path='/organization/roles'>
            <div className='page-header page-header--button'>
              {/* Role management */}
            </div>
            <ManageOrganizationRoles />
          </Route>
          {/* <Route path='/organization/path-templates'>
            <div className='page-header page-header--button'>
              Path Templates
            </div>
            <ManageOrganizationPathTemplates
              organizationData={this.props.organizationData}
            />
          </Route> */}
          <Route>
            <Redirect to='/organization/teams' />
          </Route>
        </Switch>
        <style jsx>{manageUsersStyle}</style>
        <style jsx>{skillItemStyle}</style>
      </div>
    )
  }
}
export default ManageUsers
