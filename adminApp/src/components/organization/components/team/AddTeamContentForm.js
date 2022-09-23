import React, { Component } from 'react'
import { Form, Select, Input, Button, Loading, Message } from 'element-react'
import { Mutation } from 'react-apollo'
import { addTeamLearningContent } from '../../../../api'

export default class AddTeamContentForm extends Component {
  state = {
    options: [
      {
        label: 'Goals Management',
        value: 'goalsManagement'
      },
      {
        label: 'Follow-ups',
        value: 'followUps'
      },
      {
        label: 'Independence',
        value: 'independence'
      },
      {
        label: 'Leadership',
        value: 'leadership'
      },
      {
        label: 'Planning & decision making',
        value: 'planningAndDecisionMaking'
      },
      {
        label: 'Communications & feedback',
        value: 'comsAndFeedback'
      },
      {
        label: 'Acceptance & norms',
        value: 'acceptanceAndNorms'
      },
      {
        label: 'Cooperation',
        value: 'cooperation'
      },
      {
        label: 'Structure',
        value: 'structure'
      },
      {
        label: 'Roles clarity',
        value: 'rolesClarity'
      }
    ],
    form: {
      title: '',
      author: '',
      pdfSource: '',
      relatedPerformanceArea: ''
    }
  }
  form = React.createRef()

  onChange = (key, value) => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        [key]: value
      }
    }))
  }

  handleOnSubmitSuccess = () => {
    this.setState({
      form: {
        title: '',
        author: '',
        pdfSource: '',
        relatedPerformanceArea: ''
      }
    })
    this.form.current.resetFields()
  }

  render() {
    const { title, author, pdfSource, relatedPerformanceArea } = this.state.form
    return (
      <Form
        ref={this.form}
        className='en-US'
        model={this.state.form}
        labelWidth='120'
      >
        <Form.Item
          label='Title'
          prop='title'
          rules={{
            required: true,
            message: 'Please add title of tool',
            trigger: 'blur'
          }}
        >
          <Input
            value={title}
            onChange={value => this.onChange('title', value)}
          />
        </Form.Item>
        <Form.Item label='Author' prop='author'>
          <Input
            value={author}
            onChange={value => this.onChange('author', value)}
          />
        </Form.Item>
        <Form.Item
          label='Link to source PDF'
          prop='pdfSource'
          rules={{
            required: true,
            type: 'url',
            message: 'Please add correct URL address',
            trigger: 'blur'
          }}
        >
          <Input
            value={pdfSource}
            onChange={value => this.onChange('pdfSource', value)}
          />
        </Form.Item>
        <Form.Item
          label='Related Key Area of Performance'
          prop='relatedPerformanceArea'
          rules={{
            required: true,
            message: 'Please select an area',
            trigger: 'blur'
          }}
        >
          <Select
            value={relatedPerformanceArea}
            placeholder='Choose an area'
            onChange={value => this.onChange('relatedPerformanceArea', value)}
          >
            {this.state.options.map((option, ix) => (
              <Select.Option
                key={ix}
                value={option.value}
                label={option.label}
              />
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Mutation
            mutation={addTeamLearningContent}
            refetchQueries={['fetchTeamLearningContent']}
          >
            {(addTeamLearningContent, { loading }) => {
              if (loading) return <Loading fullscreen />
              return (
                <Button
                  type='primary'
                  onClick={e => {
                    e.preventDefault()
                    this.form.current.validate(async valid => {
                      if (valid) {
                        const TeamContentInput = {
                          ...this.state.form
                        }
                        try {
                          const newTeamContent = await addTeamLearningContent({
                            variables: { TeamContentInput }
                          })
                          Message({
                            type: 'success',
                            message: `${newTeamContent.data.addTeamLearningContent} added to the database!`
                          })
                          this.handleOnSubmitSuccess()
                        } catch (e) {
                          Message({
                            type: 'error',
                            message: `${e.graphQLErrors[0].message}`
                          })
                        }
                      } else {
                        console.log('Validation failed')
                        return false
                      }
                    })
                  }}
                >
                  Add tool
                </Button>
              )
            }}
          </Mutation>
        </Form.Item>
      </Form>
    )
  }
}
