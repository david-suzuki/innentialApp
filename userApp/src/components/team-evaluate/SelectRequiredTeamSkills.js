import React, { Component } from 'react'
// import { ApolloConsumer } from 'react-apollo'
import { fetchRequiredTeamSkills } from '../../api'
import {
  ListSkillSelector,
  // MultipleSkillsSelector,
  FormDescription,
  FormGroup,
  SelectedSkills
} from '../ui-components'
import { useQuery } from 'react-apollo'
import { Button, Notification } from 'element-react'
import { LoadingSpinner, SentryDispatch } from '../general'

class SelectRequiredTeamSkills extends Component {
  state = {
    skills: this.props.skills
  }

  // componentDidMount() {
  //   this.client
  //     .query({
  //       query: fetchRequiredTeamSkills,
  //       variables: {
  //         teamId: this.props.teamInfo._id
  //       },
  //       fetchPolicy: 'no-cache'
  //     })
  //     .then(res => {
  //       const skills = res.data.fetchRequiredTeamSkills.map(skill => ({
  //         ...skill,
  //         _id: skill.skillId,
  //         level: 0
  //       }))

  //       this.setState({ skills })
  //     })
  //     .catch(e => captureFilteredError(e))
  // }

  // onSkillsChange = (value, relatedSkill) => {
  //   const newSelectedSkills = [...this.state.skills]
  //   if (
  //     newSelectedSkills.length &&
  //     !newSelectedSkills.find(item => item._id === value[1])
  //   ) {
  //     newSelectedSkills.push({
  //       ...relatedSkill,
  //       level: 0,
  //       skillId: relatedSkill._id
  //     })
  //   } else if (!newSelectedSkills.length) {
  //     newSelectedSkills.push({
  //       ...relatedSkill,
  //       level: 0,
  //       skillId: relatedSkill._id
  //     })
  //   }

  //   this.setState({ skills: newSelectedSkills })
  // }

  onSkillsSubmit = skills => {
    this.setState({ skills: skills.map(sk => ({ ...sk, skillId: sk._id })) })
  }

  removeSkill = (e, skillId) => {
    e.preventDefault()
    const newSelectedSkills = this.state.skills.reduce((acc, curr) => {
      if (curr.skillId === skillId) return [...acc]
      else {
        return [
          ...acc,
          {
            ...curr
          }
        ]
      }
    }, [])

    this.setState({ skills: newSelectedSkills })
  }

  onSubmit = e => {
    if (this.state.skills.length > 0) {
      this.props.setRelevantSkills(this.state.skills)
    } else {
      Notification({
        message: 'Please select required skills',
        type: 'warning',
        duration: 2500,
        offset: 90
      })
    }
  }

  forwardRef = React.createRef()

  // client = {}
  render() {
    const { skills } = this.state
    const selectedSkills = skills

    return (
      <div className='component-block align-center'>
        <FormDescription
          label={`Skills Required in ${this.props.teamInfo.teamName}`}
          description='Choose the skills your team currently needs.'
        />
        <br />
        {/* <ApolloConsumer>
          {client => {
            this.client = client 
            return ( */}
        <FormGroup>
          <div className='align-center'>
            <ListSkillSelector
              skills={selectedSkills}
              onSkillsSubmit={this.onSkillsSubmit}
              onSkillRemove={this.removeSkill}
              forwardRef={this.forwardRef}
              filterSkills={selectedSkills}
              buttonValue='Find skills...'
              buttonClass='list-skill-selector__button-input'
              // hideLoading
              clearState
            />
          </div>
          {selectedSkills.length > 0 && (
            <>
              <br />
              <h4 className='align-left'>Selected skills</h4>
              <SelectedSkills
                skills={selectedSkills}
                onSkillRemove={(skill, e) => {
                  this.removeSkill(e, skill.skillId || skill._id)
                  const skillSelector = this.forwardRef?.current
                  if (skillSelector) {
                    skillSelector.onSkillRemove(skill, e)
                  }
                }}
              />
            </>
          )}
        </FormGroup>
        <br />
        {/* )
          }}
        </ApolloConsumer> */}
        <div className='bottom-nav'>
          {this.props.currentPage !== 0 && (
            <div className='bottom-nav__previous'>
              <a onClick={() => this.props.changePage(-1)}>
                <i className='icon icon-tail-left' />
                <span>Previous step</span>
              </a>
            </div>
          )}
          <Button type='primary' onClick={this.onSubmit}>
            <i className='icon icon-tail-right' />
          </Button>
        </div>
      </div>
    )
  }
}

export default props => {
  const { data, loading, error } = useQuery(fetchRequiredTeamSkills, {
    variables: {
      teamId: props.teamInfo._id
    },
    fetchPolicy: 'no-cache'
  })

  if (loading) return <LoadingSpinner />
  if (error) return <SentryDispatch error={error} />

  return (
    <SelectRequiredTeamSkills
      {...props}
      skills={
        (data &&
          data.fetchRequiredTeamSkills.map(skill => ({
            ...skill,
            _id: skill.skillId,
            level: 0
          }))) ||
        []
      }
    />
  )
}
