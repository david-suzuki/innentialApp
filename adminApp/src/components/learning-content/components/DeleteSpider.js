import React, { Component } from 'react'
import {
  Button,
  Dialog,
  Message,
  Loading,
  Form,
  Input,
  DatePicker
} from 'element-react'
import { Mutation } from 'react-apollo'
import { deleteSpiderContent } from '../../../api'

export default class DeleteSpider extends Component {
  form = React.createRef()
  state = {
    isFormVisible: false,
    form: {
      spider: '',
      date: null
    }
  }

  onChange = (key, value) => {
    this.setState({
      form: Object.assign({}, this.state.form, {
        [key]: value
      })
    })
  }

  toggleFormVisibility = () => {
    this.setState(({ isFormVisible }) => ({ isFormVisible: !isFormVisible }))
  }

  handleOnSubmitSuccess = () => {
    this.toggleFormVisibility()
    this.setState({
      form: {
        spider: '',
        date: null
      }
    })
    this.form.current.resetFields()
  }

  render() {
    const { spider, date } = this.state.form
    // const ContentQuery = this.props.query
    return (
      <div>
        <Button type='primary' onClick={this.toggleFormVisibility}>
          Delete Spider Content
        </Button>
        <Dialog
          title='Delete single spider content'
          visible={this.state.isFormVisible}
          onCancel={this.toggleFormVisibility}
        >
          <Dialog.Body>
            <Form
              ref={this.form}
              labelPosition='top'
              className='en-US'
              model={this.state.form}
              labelWidth='120'
            >
              <Form.Item
                label='Spider Name'
                prop='spider'
                rules={{
                  required: true,
                  message: 'Please provide spider name',
                  trigger: 'blur'
                }}
              >
                <Input
                  value={spider}
                  onChange={value => this.onChange('spider', value)}
                />
              </Form.Item>
              <Form.Item
                label='Date'
                prop='date'
                rules={{
                  required: true,
                  message: 'Please select the date',
                  trigger: 'change',
                  type: 'date'
                }}
              >
                <DatePicker
                  name={'spiderdate'}
                  value={date}
                  placeholder='Choose the earliest published date of the content'
                  onChange={value => {
                    this.onChange('date', value)
                  }}
                />
              </Form.Item>
              <Mutation
                mutation={deleteSpiderContent}
                refetchQueries={['fetchAllLearningContent']}
              >
                {(deleteSpiderContent, { loading }) => {
                  if (loading) return <Loading fullscreen />
                  return (
                    <Button
                      type='primary'
                      onClick={e => {
                        e.preventDefault()
                        this.form.current.validate(async valid => {
                          if (valid) {
                            try {
                              const result = await deleteSpiderContent({
                                variables: { spider, date }
                              })
                              if (result.data.deleteSpiderContent === 0) {
                                Message({
                                  type: 'success',
                                  message: `No content to be deleted`
                                })
                                this.handleOnSubmitSuccess()
                              } else {
                                Message({
                                  type: 'success',
                                  message: `Content removed`
                                })
                                this.handleOnSubmitSuccess()
                              }
                            } catch (e) {
                              Message({
                                type: 'error',
                                message: `${e.graphQLErrors[0].message}`
                              })
                            }
                          } else {
                            console.log('Validation error')
                            return false
                          }
                        })
                      }}
                    >
                      Delete content
                    </Button>
                  )
                }}
              </Mutation>
            </Form>
          </Dialog.Body>
        </Dialog>
      </div>
    )
  }
}
