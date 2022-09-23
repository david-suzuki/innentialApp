import React, { Component } from 'react'
import {
  Form,
  Input,
  Button,
  Message,
  Layout,
  Checkbox,
  Select
} from 'element-react'
import { tagOptions } from './constants/_tag-options'

export default class SourcesForm extends Component {
  constructor(props) {
    super(props)

    const {
      initialValues: {
        name,
        baseUrls,
        affiliate,
        certText,
        subscription,
        tags = [],
        accountRequired
      },
      sourceId
    } = this.props

    this.state = {
      form: {
        name,
        baseUrls: baseUrls.map((url, i) => {
          return {
            key: i,
            value: url
          }
        }),
        affiliate,
        certText,
        subscription,
        tags,
        accountRequired: accountRequired ? accountRequired : false
      },
      sourceId
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

  onChangeUrl = (key, value, index) => {
    const currentUrls = this.state.form.baseUrls
    const newUrls = [...currentUrls]
    newUrls[index].value = value
    this.setState(({ form }) => ({
      form: Object.assign({}, form, {
        baseUrls: [...newUrls]
      })
    }))
  }

  addNewUrl = e => {
    e.preventDefault()
    this.setState(({ form }) => ({
      form: {
        ...form,
        baseUrls: [
          ...form.baseUrls,
          {
            key: form.baseUrls.length,
            value: ''
          }
        ]
      }
    }))
  }

  removeNewUrl = (key, e) => {
    const currentUrls = this.state.form.baseUrls
    const newUrls = [...currentUrls]
    newUrls.splice(key, 1)
    this.setState(({ form }) => ({
      form: {
        ...form,
        baseUrls: [...newUrls]
      }
    }))

    e.preventDefault()
  }

  render() {
    const {
      name,
      baseUrls,
      affiliate,
      certText,
      subscription,
      tags,
      accountRequired
    } = this.state.form
    const editContentSource = this.props.mutation
    return (
      <div>
        <Form
          ref={this.form}
          labelPosition='top'
          className='en-US'
          model={this.state.form}
          labelWidth='120'
        >
          <Form.Item
            label='Name'
            prop='name'
            rules={{
              required: true,
              message: 'Please provide the source name',
              trigger: 'blur'
            }}
          >
            <Input
              value={name}
              onChange={value => this.onChange('name', value)}
            />
          </Form.Item>
          {baseUrls.map((url, i) => {
            return (
              <Form.Item
                label={i === 0 ? 'Base URL' : ''}
                prop={`baseUrls:${url.key}`}
                key={url.key}
                rules={{
                  type: 'object',
                  required: true,
                  fields: {
                    value: [
                      {
                        type: 'url',
                        required: true,
                        message: 'Please provide a valid URL',
                        trigger: 'blur'
                      },
                      {
                        validator: (_, value, callback) => {
                          if (value.split('/').length > 3) {
                            callback(
                              new Error(
                                `Please input only base URL, with no extra slashes`
                              )
                            )
                          } else {
                            callback()
                          }
                        },
                        trigger: 'blur'
                      }
                    ]
                  }
                }}
              >
                <Layout.Col span='20'>
                  <Input
                    value={url.value}
                    placeholder='URL'
                    onChange={value =>
                      this.onChangeUrl('baseUrls', value, url.key)
                    }
                  />
                </Layout.Col>
                <Layout.Col span='4'>
                  {i > 0 ? (
                    <Button onClick={e => this.removeNewUrl(url.key, e)}>
                      Delete
                    </Button>
                  ) : (
                    ''
                  )}
                </Layout.Col>
              </Form.Item>
            )
          })}
          <div>
            <Button
              style={{ marginBottom: '15px' }}
              onClick={e => this.addNewUrl(e)}
            >
              Add another URL
            </Button>
          </div>
          <div style={{ margin: '5px 0px 15px' }}>
            <Checkbox
              checked={affiliate}
              onChange={value => this.onChange('affiliate', value)}
            >
              Is affiliate source
            </Checkbox>
          </div>
          <div style={{ margin: '5px 0px 15px' }}>
            <Checkbox
              checked={accountRequired}
              onChange={value => this.onChange('accountRequired', value)}
            >
              Is account required
            </Checkbox>
          </div>
          <Form.Item
            label='Certificate tooltip (max. 120 characters)'
            prop='certText'
            rules={{
              validator: (_, value, callback) => {
                if (String(value).length > 120) {
                  callback(new Error(`Too long!`))
                }
                callback()
              }
            }}
          >
            <Input
              value={certText}
              onChange={value => this.onChange('certText', value)}
            />
          </Form.Item>
          <div style={{ margin: '5px 0px 15px' }}>
            <Checkbox
              checked={subscription}
              onChange={value => this.onChange('subscription', value)}
            >
              Is subscription based
            </Checkbox>
          </div>
          <Form.Item label='Tags for content algorithm' prop='tags'>
            <Select
              multiple
              value={tags}
              onChange={value => this.onChange('tags', value)}
              style={{ width: '100%' }}
            >
              {tagOptions.map(tag => (
                <Select.Option key={tag} value={tag}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <span>
          <Button
            type='primary'
            onClick={e => {
              e.preventDefault()

              this.form.current.validate(async valid => {
                if (valid) {
                  const { baseUrls, ...rest } = this.state.form
                  const sourceData = {
                    baseUrls: baseUrls.map(url => url.value),
                    ...rest
                  }

                  const { sourceId } = this.state
                  try {
                    await editContentSource({
                      variables: { sourceData, sourceId }
                    })
                    Message({
                      type: 'success',
                      message: `Successfully updated!`
                    })
                    this.props.goBack()
                  } catch (e) {
                    Message({
                      type: 'error',
                      message: `${e}`
                    })
                  }
                } else {
                  console.log('Validation error')
                }
              })
            }}
          >
            Submit
          </Button>
          <Button onClick={() => this.props.goBack()}>Go back</Button>
        </span>
      </div>
    )
  }
}
