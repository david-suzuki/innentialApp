import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { fetchAllInterests } from '../../../api'
import { Button, Form, Select, Message } from 'element-react'

export default class InterestsSelector extends Component {
  constructor(props) {
    super(props)
    this.initialState = {
      selectedInterests: [
        {
          key: 0,
          value: [],
          _id: ''
        }
      ]
    }
    this.state = this.initialState
  }

  componentDidUpdate = prevProps => {
    if (this.props.reset !== prevProps.reset && this.props.reset) {
      this.setState(() => this.initialState)
    }
  }

  addNewInterest = e => {
    e.preventDefault()
    this.setState(({ selectedInterests }) => ({
      selectedInterests: [
        ...selectedInterests,
        {
          key: selectedInterests.length,
          value: [],
          _id: ''
        }
      ]
    }))
  }

  removeNewInterest = (item, e) => {
    const newSelectedInterests = this.state.selectedInterests.filter(
      skill => skill.key !== item
    )

    this.setState(() => ({
      selectedInterests: [...newSelectedInterests]
    }))

    e.preventDefault()
  }

  handleChange = () => {
    const value = this.state.selectedInterests.map(
      ({ key, value, ...rest }) => rest
    )
    this.props.onChange(value)
  }

  onInterestChange = (key, value, interest) => {
    if (value) {
      let newSelectedInterest = this.state.selectedInterests.reduce(
        (acc, curr) => {
          if (curr.key === key) {
            return [
              ...acc,
              {
                ...curr,
                value,
                _id: interest._id
              }
            ]
          }
          return [
            ...acc,
            {
              ...curr
            }
          ]
        },
        []
      )

      const currentInterestsIds = this.state.selectedInterests.map(
        item => item._id
      )
      if (!currentInterestsIds.includes(value[value.length - 1])) {
        this.setState(
          () => ({
            selectedInterests: [...newSelectedInterest]
          }),
          () => this.handleChange()
        )
      } else {
        Message({
          type: 'error',
          message: `You have already added this interest`
        })
      }
    } else {
      if (key === 0 && this.state.selectedInterests.length === 1) {
        this.setState(() => ({
          selectedInterests: [
            {
              key: 0,
              value: [],
              _id: ''
            }
          ]
        }))
      }
    }
  }

  render() {
    return (
      <Query query={fetchAllInterests}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...'
          if (error) return `Error! ${error.message}`

          const interestsData = data && data.fetchAllInterests
          return this.state.selectedInterests.map(interest => {
            return (
              <Form.Item
                label='Selected Interests'
                prop={`selectedInterests:${interest._id}`}
                key={interest.key}
              >
                <Select
                  placeholder='Select related interests'
                  value={interest.value}
                  filterable
                  clearable={
                    interest.key === 0 &&
                    this.state.selectedInterests.length === 1
                  }
                  onChange={value =>
                    this.onInterestChange(
                      interest.key,
                      value,
                      interestsData.filter(d => d._id === value)[0]
                    )
                  }
                >
                  {interestsData.map(el => {
                    return (
                      <Select.Option
                        key={el.slug}
                        label={el.name}
                        value={el._id}
                      />
                    )
                  })}
                </Select>
                {interest.key === this.state.selectedInterests.length - 1 && (
                  <React.Fragment>
                    <Button onClick={this.addNewInterest}>
                      Add new Interest
                    </Button>
                    {interest.key !== 0 && (
                      <Button
                        onClick={e => this.removeNewInterest(interest.key, e)}
                      >
                        Delete
                      </Button>
                    )}
                  </React.Fragment>
                )}
              </Form.Item>
            )
          })
        }}
      </Query>
    )
  }
}
