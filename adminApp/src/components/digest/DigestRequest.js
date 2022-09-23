import React, { Component } from 'react'
import { Layout, Form, Button, Message, Select } from 'element-react'
import {
  LinesOfWorkSelector,
  MultipleSkillsSelector,
  MultipleNeededSkillsSelector,
  InterestsSelector,
  IndustrySelector
} from './components'
import { initialStateValues } from './constants'
import { DigestRequestResults } from './'
import { ContentSourceSelector } from '../learning-content/components'

const selectOptions = [
  {
    value: 'ARTICLE',
    label: 'Article'
  },
  {
    value: 'E-LEARNING',
    label: 'E-Learning'
  },
  {
    value: 'BOOK',
    label: 'Book'
  },
  {
    value: 'TOOL',
    label: 'Tool'
  },
  {
    value: 'EVENT',
    label: 'Event'
  }
]
export default class DigestRequest extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
    this.state = {
      form: { ...initialStateValues.form },
      reset: false
    }
  }

  handleReset = () => {
    this.myRef.current.resetFields()
    this.setState(() => ({
      form: { ...initialStateValues.form },
      submitted: false,
      reset: true
    }))
  }

  handleChange = (key, value) => {
    if (value) {
      this.setState(({ form }) => ({
        form: {
          ...form,
          [key]: value
        },
        reset: false
      }))
    }
  }

  onChangeFilter = value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        filter: value
      },
      reset: false
    }))
  }

  onChangeContentSource = value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        source: value._id
      },
      reset: false
    }))
  }

  onChangeLineOfWork = value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        selectedLineOfWork: {
          name: value.name,
          _id: value._id
        }
      },
      reset: false
    }))
  }

  onChangeIndustry = value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        selectedIndustry: {
          name: value.name,
          _id: value._id
        }
      },
      reset: false
    }))
  }

  handleSubmit = () => {
    if (this.state.form.selectedSkills.length > 0) {
      this.setState({
        submitted: true
      })
    } else {
      Message({
        type: 'error',
        message: `At least one Selected Skill must be chosen`
      })
    }
  }

  render() {
    const { filter, source } = this.state.form
    return (
      <div>
        {/* <p>IF IN TEAM</p>
          <p>Team's skill level feedback on selected skills</p>
          <p>Selected skills relevance to the team</p>
          <p>team's missing skills of the week/month</p>

          <p>Extra info</p>
        <p>Content preference (Articles, Video etc.)</p> */}
        <Layout.Row>
          <Layout.Col span='24'>
            <Form
              ref={this.myRef}
              className='en-US'
              model={this.state.form}
              rules={this.state.rules}
              labelWidth='120'
            >
              <MultipleSkillsSelector
                onChange={value => this.handleChange('selectedSkills', value)}
                reset={this.state.reset}
              />
              <MultipleNeededSkillsSelector
                onChange={value => this.handleChange('neededSkills', value)}
                reset={this.state.reset}
              />
              <LinesOfWorkSelector
                selectedLineOfWork={this.state.form.selectedLineOfWork}
                onChangeLineOfWork={this.onChangeLineOfWork}
              />
              <InterestsSelector
                onChange={value =>
                  this.handleChange('selectedInterests', value)
                }
                reset={this.state.reset}
              />
              <IndustrySelector
                selectedIndustry={this.state.form.selectedIndustry}
                onChangeIndustry={this.onChangeIndustry}
              />
              <Form.Item label='Filter by type' prop={`filter`}>
                <Select
                  placeholder='Select type of content'
                  value={filter}
                  onChange={this.onChangeFilter}
                  clearable
                >
                  {selectOptions.map(el => {
                    return (
                      <Select.Option
                        key={el.value}
                        label={el.label}
                        value={el.value}
                      />
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item label='Filter by source' prop={`source`}>
                <ContentSourceSelector
                  contentSource={source}
                  onChangeContentSource={this.onChangeContentSource}
                />
              </Form.Item>

              <Form.Item>
                {!this.state.submitted && (
                  <Button type='primary' onClick={this.handleSubmit}>
                    Submit
                  </Button>
                )}
                <Button onClick={this.handleReset}>Reset</Button>
              </Form.Item>
            </Form>
          </Layout.Col>
        </Layout.Row>
        {this.state.submitted && (
          <DigestRequestResults queryVariables={this.state.form} />
        )}
      </div>
    )
  }
}
