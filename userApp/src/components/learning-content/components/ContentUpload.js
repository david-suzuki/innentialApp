import React, { Component } from 'react'
import {
  FormGroup,
  StarBar,
  FormDescription,
  // Statement,
  ListSkillSelector
} from '../../ui-components'
import {
  Form,
  Button,
  Notification,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Radio
} from 'element-react'
// import Autosuggest from 'react-autosuggest'
import { /* Query, */ Mutation, ApolloConsumer } from 'react-apollo'
import { LoadingSpinner, captureFilteredError } from '../../general'
import {
  // fetchOrganizationSpecificSkills,
  requestContentInformationForUrl,
  userAddLearningContent
} from '../../../api'
import { HandleGlobalState /*, autoSuggestTheme */ } from './'
import initialFormValues from '../constants/_initial-form-values'
import '../../../styles/theme/radio.css'
import '../../../styles/theme/date-picker.css'
import skillItemStyle from '../../../styles/skillItemStyle'
// import listStyleSelectorStyle from '../../../styles/listStyleSelectorStyle'

class ContentUpload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        ...initialFormValues.form,
        type: props.contentType || 'ARTICLE'
      },
      paid: false,
      extendedForm: false,
      // skillData: props.skillData,
      suggestions: [],
      isLoading: false,
      shouldSeeFramework: false,
      selectedFrameworkId: '',
      selectedLevel: 0,
      selectedName: ''
    }
  }

  form = React.createRef()

  componentWillUnmount = () => {
    this.resetForm()
  }

  // FORM METHODS

  onChange = (key, value) => {
    if (key === 'url') {
      this.resetForm()
      this.onChangeUrl(value)
    } else
      this.setState(({ form }) => ({
        form: {
          ...form,
          [key]: value
        }
      }))
  }

  setPaid = value => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        price: {
          ...form.price,
          value: value ? '' : 0
        }
      },
      paid: value
    }))
  }

  setStartingDate = value => {
    if (value !== null) {
      const [day, month, year] = [
        value.getDate(),
        value.getMonth(),
        value.getFullYear()
      ]
      this.setState(({ form }) => {
        const { startDate } = form
        const date = new Date(startDate)
        date.setDate(day)
        date.setMonth(month)
        date.setFullYear(year)
        return {
          form: {
            ...form,
            startDate: date
          }
        }
      })
    }
  }

  // onChangeSkillName = (e, value) => {
  //   if (value === undefined) {
  //     captureFilteredError(`Undefined value in autosuggest component`)
  //   } else {
  //     const { newValue } = value
  //     this.setState(({ form }) => ({
  //       form: {
  //         ...form,
  //         primarySkillName: newValue
  //       }
  //     }))
  //   }
  // }

  onChangeSkill = (key, value, i) => {
    this.setState(({ form, selectedPrimarySkills }) => {
      const newPrimarySkills = selectedPrimarySkills.map((skill, idx) => {
        if (i === idx)
          return {
            ...skill,
            [key]: value
          }
        return skill
      })
      return {
        form: { ...form, relatedPrimarySkills: newPrimarySkills },
        selectedPrimarySkills: newPrimarySkills
      }
    })
  }

  handleUrlBlur = async () => {
    const { url = '' } = this.state.form
    // check if url has a dot i.e. something.com
    if (url.split('.').length > 1) {
      // check if url begins with a protocol
      const urlRegex = new RegExp('^(?:(?:http|https|ftp)://)', 'i')
      if (!urlRegex.test(url)) {
        this.setState(
          ({ form }) => ({
            form: {
              ...form,
              url: 'https://' + url.trim() // append https. Our clients' safety is our top priority
            }
          }),
          this.requestContentInformation
        )
      } else await this.requestContentInformation()
    }
  }

  requestContentInformation = async () => {
    if (!this.props.apClient) return null
    this.form.current.validateField('url', async err => {
      if (!err) {
        this.setState({ isLoading: true })
        await this.props.apClient
          .query({
            query: requestContentInformationForUrl,
            variables: { url: this.state.form.url },
            fetchPolicy: 'no-cache'
          })
          .then(({ data: { requestContentInformationForUrl } }) => {
            this.setState({ isLoading: false })
            const { exists } = requestContentInformationForUrl
            if (exists) {
              const { content } = requestContentInformationForUrl
              this.resetForm()
              this.props.displayContent(content, false)
            } else {
              const {
                data: { title, author, publishedDate }
              } = requestContentInformationForUrl
              this.setState(({ form }) => ({
                form: {
                  ...form,
                  title,
                  author,
                  publishedDate: new Date(publishedDate)
                },
                selectedPrimarySkills: initialFormValues.selectedPrimarySkills
              }))
              this.setState({ extendedForm: true })
            }
          })
          .catch(err => {
            this.setState({ isLoading: false })
            captureFilteredError(err)
          })
      }
    })
  }

  timeoutId = null
  onChangeUrl = async value => {
    if (this.timeoutId) clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(this.handleUrlBlur, 1000)
    this.setState(({ form }) => ({
      form: {
        ...form,
        url: value.trim()
      }
    }))
  }

  removeNewSkill = (idx, e) => {
    e.preventDefault()
    const newSkills = this.state.selectedPrimarySkills
    newSkills.splice(idx, 1)
    // const removedSkillData = this.props.skillData.find(
    //   skill => skill._id === skillRemoved._id
    // )
    this.setState(({ form /*, skillData */ }) => ({
      form: { ...form, relatedPrimarySkills: newSkills },
      // skillData: [...skillData, removedSkillData],
      selectedPrimarySkills: newSkills,
      shouldSeeFramework: !(newSkills.length === 0)
    }))
    if (newSkills.length === 0) {
      this.setState({
        selectedFrameworkId: '',
        selectedLevel: 0
      })
    }
  }

  resetForm = () => {
    if (this.form.current !== null) {
      this.form.current.resetFields()
    }
    delete this.state.selectedPrimarySkills
    this.setState({
      form: { ...initialFormValues.form },
      extendedForm: false,
      // skillData: this.props.skillData,
      // suggestions: [],
      isLoading: false,
      shouldSeeFramework: false,
      selectedFrameworkId: '',
      selectedLevel: 0
    })
  }

  // AUTOSUGGEST METHODS

  // onSuggestionsFetchRequested = ({ value }) => {
  //   const filteredResults = this.state.skillData.filter(
  //     this.filterResults(value)
  //   )
  //   this.setState({
  //     suggestions: filteredResults
  //   })
  // }

  // onSuggestionsClearRequested = () => {
  //   this.setState({
  //     suggestions: []
  //   })
  // }

  // onSuggestionSelected = (
  //   event,
  //   { suggestion: { _id, name, frameworkId } }
  // ) => {
  //   this.setState(({ form, selectedPrimarySkills, skillData }) => {
  //     if (!selectedPrimarySkills.some(skill => skill._id === _id)) {
  //       const newSelected = [
  //         ...selectedPrimarySkills,
  //         {
  //           _id,
  //           name,
  //           skillLevel: NaN,
  //           importance: 1,
  //           frameworkId
  //         }
  //       ]
  //       return {
  //         form: {
  //           ...form,
  //           relatedPrimarySkills: newSelected
  //         },
  //         skillData: skillData.filter(skill => skill._id !== _id),
  //         selectedPrimarySkills: newSelected,
  //         shouldSeeFramework: true
  //       }
  //     }
  //   })
  // }

  // getSuggestionValue = () => ''

  // renderSuggestion = ({ name, category }) => {
  //   return (
  //     <>
  //       <span>
  //         <strong>{name}</strong>
  //         <span className="skill-name-category">({category})</span>
  //       </span>
  //       <span>
  //         <i className="icon icon-small-add" />
  //       </span>
  //     </>
  //   )
  // }

  // filterResults = queryString => {
  //   const regex = new RegExp(`^${queryString.replace(/\W/g, '')}`, 'i')
  //   return ({ name }) => {
  //     if (regex.toString().split('/')[1] === '^') {
  //       return false
  //     } else return regex.test(name)
  //   }
  // }

  onSkillsSubmit = (skills = []) => {
    this.setState(({ form, selectedPrimarySkills }) => {
      const newSelected = [
        ...selectedPrimarySkills,
        ...skills
          .filter(({ _id }) => {
            return !selectedPrimarySkills.some(selected => selected._id === _id)
          })
          .map(({ _id, name, category, frameworkId }) => ({
            _id,
            name,
            skillLevel: NaN,
            importance: 1,
            category,
            frameworkId
          }))
      ]
      return {
        form: {
          ...form,
          relatedPrimarySkills: newSelected
        },
        selectedPrimarySkills: newSelected,
        shouldSeeFramework: true
      }
    })
  }

  setFramework = (id, level, name) => {
    this.props.setFrameworkState({
      visible: true,
      frameworkId: id,
      level,
      skillName: name
    })
  }

  componentWillUnmount = () => {
    this.props.setFrameworkState({ visible: false })
  }

  render() {
    const {
      extendedForm,
      // suggestions,
      isLoading,
      paid
      // shouldSeeFramework,
      // selectedFrameworkId,
      // selectedLevel,
      // selectedName
    } = this.state
    if (!extendedForm) {
      const { url } = this.state.form
      return (
        <div>
          <Form
            ref={this.form}
            model={this.state.form}
            onSubmit={e => e.preventDefault()}
          >
            <FormDescription
              label='Upload your learning item'
              description='Paste the URL that you want to add and we will extract the information about the item for you'
            />
            <FormGroup>
              <Form.Item
                label='URL'
                prop='url'
                rules={[
                  {
                    required: true,
                    message: 'Please provide the URL'
                  },
                  {
                    type: 'url',
                    message: 'Please provide a valid URL',
                    trigger: 'blur'
                  }
                ]}
              >
                <Input
                  value={url}
                  placeholder='Paste the item url here'
                  onChange={value => this.onChangeUrl(value)}
                  onBlur={() => this.handleUrlBlur()}
                />
              </Form.Item>
            </FormGroup>
          </Form>
          {isLoading && <LoadingSpinner />}
        </div>
      )
    } else {
      const {
        url,
        title,
        author,
        type,
        publishedDate,
        startDate,
        relatedPrimarySkills,
        price
        // primarySkillName
      } = this.state.form
      const selectorProps = {
        buttonValue: 'Find skills...',
        buttonClass: 'list-skill-selector__button-input',
        skills: [],
        onSkillsSubmit: this.onSkillsSubmit,
        filterSkills: relatedPrimarySkills,
        clearState: true
      }
      return (
        <div>
          {/* <HandleGlobalState
            shouldSeeFramework={shouldSeeFramework}
            frameworkId={selectedFrameworkId}
            selectedLevel={selectedLevel}
            selectedName={selectedName}
          /> */}
          <Form ref={this.form} model={this.state.form}>
            <FormDescription
              label='Add learning item'
              description='Verify the fields and submit your item'
            />
            <FormGroup>
              <Form.Item
                label='URL'
                prop='url'
                rules={[
                  {
                    required: true,
                    message: 'Please provide the URL'
                  },
                  {
                    type: 'url',
                    message: 'Please provide a valid URL',
                    trigger: 'blur'
                  }
                ]}
              >
                <Input
                  value={url}
                  placeholder='Paste the item url here'
                  onChange={value => this.onChange('url', value)}
                />
              </Form.Item>
            </FormGroup>
            <FormGroup mainLabel='Item metadata'>
              <Form.Item
                label='Related skills'
                prop='relatedPrimarySkills'
                // rules={{
                //   validator: (rule, value, callback) => {
                //     if (value.length === 0) {
                //       callback(
                //         new Error(`At least one primary skill is required`)
                //       )
                //     } else callback()
                //   }
                // }}
              >
                <ListSkillSelector {...selectorProps} />
                {/* <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  onSuggestionSelected={this.onSuggestionSelected}
                  getSuggestionValue={this.getSuggestionValue}
                  renderSuggestion={this.renderSuggestion}
                  inputProps={{
                    value: primarySkillName,
                    placeholder: `Start typing to view suggestions`,
                    onChange: this.onChangeSkillName
                  }}
                  theme={{
                    ...autoSuggestTheme
                  }}
                /> */}
                {relatedPrimarySkills.length > 0 && (
                  <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <h4>Set skill level of the learning</h4> <br />
                  </div>
                )}
                {relatedPrimarySkills.map((primarySkill, i) => {
                  const {
                    name,
                    skillLevel,
                    frameworkId,
                    category
                  } = primarySkill
                  return (
                    <Form.Item
                      key={`relatedPrimarySkill${i}`}
                      prop={`relatedPrimarySkills[${i}]`}
                    >
                      <StarBar
                        // startNumber={0}
                        name={
                          <span>
                            {name}
                            <i
                              className='icon icon-e-remove icon--autosuggest'
                              onClick={e => this.removeNewSkill(i, e)}
                            />
                          </span>
                        }
                        subtitle={category}
                        level={skillLevel}
                        updateSkillLevels={(name, value) =>
                          this.onChangeSkill('skillLevel', value, i)
                        }
                        handleHover={level => {
                          if (frameworkId) {
                            this.setFramework(frameworkId, level, name)
                          } else {
                            this.setFramework('no_framework', 0, name)
                          }
                        }}
                        handleMouseOut={() => {
                          this.setFramework(null, 0, '')
                        }}
                      />
                      <Button
                        type='pale-lilac'
                        className={`skill__leader-button ${
                          skillLevel === 0 ? 'el-tag--is-active' : null
                        }`}
                        onClick={e => {
                          e.preventDefault()
                          this.onChangeSkill('skillLevel', 0, i)
                        }}
                      >
                        Not relevant
                      </Button>
                    </Form.Item>
                  )
                })}
              </Form.Item>
              <Form.Item
                label='Type'
                prop='type'
                rules={{
                  required: true,
                  message: 'Please select the correct type',
                  trigger: 'change'
                }}
                style={{ padding: '15px 0px' }}
              >
                <Select
                  name='type'
                  value={type}
                  placeholder='Please select the type of item'
                  onChange={value => this.onChange('type', value)}
                >
                  <Select.Option label='Article' value='ARTICLE' />
                  <Select.Option label='E-learning' value='E-LEARNING' />
                  <Select.Option label='Book' value='BOOK' />
                  <Select.Option label='Tool' value='TOOL' />
                  <Select.Option label='Video' value='VIDEO' />
                  <Select.Option label='Event' value='EVENT' />
                  <Select.Option label='Workshop' value='WORKSHOP' />
                </Select>
              </Form.Item>
            </FormGroup>
            <FormGroup mainLabel='Basic information'>
              <Form.Item
                label='Title'
                prop='title'
                rules={{
                  required: true,
                  message: 'Please provide the title of the item'
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
              {type === 'EVENT' || type === 'WORKSHOP' ? (
                <Form.Item
                  label='Starting date'
                  prop='startDate'
                  rules={{
                    required: true,
                    message: 'Please select correct starting time',
                    trigger: 'change',
                    type: 'date'
                  }}
                  style={{ padding: '15px 0px' }}
                >
                  <span>
                    <DatePicker
                      name='startDate'
                      value={startDate}
                      placeholder='Choose the starting date'
                      onChange={value => {
                        this.setStartingDate(value)
                      }}
                    />
                    <TimePicker
                      name='startTime'
                      format='HH:mm'
                      value={startDate}
                      placeholder='Choose the starting time'
                      onChange={value => {
                        this.onChange('startDate', value)
                      }}
                    />
                  </span>
                  <p style={{ fontSize: '12px' }}>
                    All our dates use CET time zone by default
                  </p>
                </Form.Item>
              ) : (
                <Form.Item
                  label='Date published'
                  prop='publishedDate'
                  rules={{
                    required: true,
                    message: 'Please select correct item published date',
                    trigger: 'change',
                    type: 'date'
                  }}
                  style={{ padding: '15px 0px' }}
                >
                  <DatePicker
                    name='date'
                    value={publishedDate}
                    placeholder='Choose the published date'
                    onChange={value => {
                      this.onChange('publishedDate', value)
                    }}
                  />
                </Form.Item>
              )}

              <Form.Item label='Price' prop='price'>
                <Radio.Group
                  value={paid}
                  onChange={value => this.setPaid(value)}
                  style={{ width: '220px' }}
                >
                  <Radio value={false}>Free</Radio>
                  <Radio value={true}>Paid</Radio>
                </Radio.Group>
                {paid && (
                  <Input
                    value={price.value}
                    onChange={value =>
                      this.onChange('price', { value, currency: 'EUR' })
                    }
                    style={{ width: '220px' }}
                    placeholder='Enter amount in EUR'
                    onFocus={e =>
                      this.onChange('price', {
                        value: parseFloat(e.target.value)
                          ? parseFloat(e.target.value)
                          : '',
                        currency: 'EUR'
                      })
                    }
                    onBlur={e =>
                      this.onChange('price', {
                        value: parseFloat(e.target.value)
                          ? `${parseFloat(e.target.value)}€`
                          : '',
                        currency: 'EUR'
                      })
                    }
                  />
                )}
              </Form.Item>
            </FormGroup>
          </Form>
          <Mutation
            mutation={userAddLearningContent}
            refetchQueries={['fetchUserUploadedContent']}
          >
            {(mutate, { loading }) => {
              if (loading) return <LoadingSpinner />
              return (
                <Button
                  type='primary'
                  onClick={() =>
                    this.form.current.validate(async valid => {
                      if (valid) {
                        // if (relatedPrimarySkills.length > 0) {
                        const learningContentData = this.state.form
                        delete learningContentData.primarySkillName

                        mutate({
                          variables: {
                            learningContentData: {
                              ...learningContentData,
                              price: {
                                ...learningContentData.price,
                                value: parseFloat(
                                  learningContentData.price.value || 0
                                )
                              },
                              relatedPrimarySkills: relatedPrimarySkills.map(
                                ({
                                  _id,
                                  name,
                                  skillLevel: level,
                                  importance
                                }) => {
                                  const skillLevel = isNaN(level) ? 0 : level
                                  return {
                                    _id,
                                    name,
                                    skillLevel,
                                    importance
                                  }
                                }
                              )
                            }
                          }
                        })
                          .then(({ data: { userAddLearningContent } }) => {
                            this.resetForm()
                            Notification({
                              type: 'success',
                              message: `Successfully uploaded`,
                              duration: 2500,
                              offset: 90
                            })
                            this.props.displayContent(
                              userAddLearningContent,
                              true
                            )
                          })
                          .catch(err => {
                            captureFilteredError(err)
                            this.resetForm()
                            Notification({
                              type: 'error',
                              message: `Oops! Something went wrong`,
                              duration: 2500,
                              iconClass: 'el-icon-error',
                              offset: 90
                            })
                          })
                        // } else {
                        //   Notification({
                        //     type: 'warning',
                        //     message: `At least one primary skill is required`,
                        //     duration: 2500,
                        //     offset: 90
                        //   })
                        // }
                      }
                    })
                  }
                >
                  Submit
                </Button>
              )
            }}
          </Mutation>
          <a className='el-button--secondary-link' onClick={this.resetForm}>
            Reset
          </a>
          <style jsx>{skillItemStyle}</style>
          {/* <style jsx>{listStyleSelectorStyle}</style> */}
        </div>
      )
    }
  }
}

export default props => (
  <ApolloConsumer>
    {client => (
      <HandleGlobalState>
        {setFrameworkState => (
          <ContentUpload
            {...props}
            setFrameworkState={setFrameworkState}
            apClient={client}
          />
        )}
      </HandleGlobalState>
    )}
  </ApolloConsumer>
)
