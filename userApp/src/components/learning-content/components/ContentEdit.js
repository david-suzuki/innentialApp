import React, { Component } from 'react'
import { useHistory, useLocation, Redirect } from 'react-router-dom'
import {
  Form,
  Button,
  Notification,
  Input,
  DatePicker,
  Select,
  Radio,
  MessageBox
} from 'element-react'
import { Mutation, useQuery, ApolloConsumer } from 'react-apollo'
import {
  fetchLearningContent,
  userEditLearningContent,
  fetchPDFUploadLink,
  deleteUserLearningContent
} from '../../../api'
import {
  FormGroup,
  StarBar,
  FormDescription,
  ListSkillSelector
} from '../../ui-components'
import { LoadingSpinner, captureFilteredError } from '../../general'
import { HandleGlobalState } from '.'
import '../../../styles/theme/radio.css'
import '../../../styles/theme/date-picker.css'
import skillItemStyle from '../../../styles/skillItemStyle'
import axios from 'axios'

const acceptedFileTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlms // excel thingy
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // word thingy
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx thingy
  'application/x-iwork-pages-sffpages', // pages mac
  'application/x-iwork-keynote-sffkey', // keynote mac
  'application/vnd.ms-excel',
  'application/msword',
  'text/plain',
  'audio/wav',
  'audio/mpeg'
]

const fileTypesTypes = {
  'image/jpeg': 'IMAGE',
  'image/png': 'IMAGE',
  'text/plain': 'TXT',
  'audio/wav': 'WAV',
  'audio/mpeg': 'MP3',
  'application/pdf': 'PDF',
  'application/vnd.ms-excel': 'XLSX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX', // xlms // excel thingy
  'application/msword': 'DOCX',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCX', // word thingy
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'PPTX', // pptx thingy
  'application/x-iwork-pages-sffpages': 'PAGES', // pages mac
  'application/x-iwork-keynote-sffkey': 'KEY' // keynote mac
}
class ContentForm extends Component {
  constructor(props) {
    super(props)

    const {
      initialValues: {
        title,
        url,
        relatedPrimarySkills,
        publishedDate,
        author,
        source,
        price: { value, currency },
        type
      }
    } = props

    const isFile = source?._id?.indexOf('user') !== -1

    this.state = {
      form: {
        title,
        ...(!isFile && { url }),
        type,
        relatedPrimarySkills,
        publishedDate: new Date(publishedDate),
        author,
        price: {
          value: value ? `${value}€` : '',
          currency
        }
      },
      paid: value > 0,
      isFile,
      isLoading: false,
      file: null,
      isValidPdf: false,
      selectedPrimarySkills: relatedPrimarySkills,
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
    // if (key === 'url') {
    //   this.resetForm()
    //   this.onChangeUrl(value)
    // } else
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

  onFileChange = async e => {
    const file = e?.target?.files[0]

    if (!file) return

    const contentType = file.type
    const fileSize = file.size

    const { contentId } = this.props

    if (
      acceptedFileTypes.indexOf(contentType) !== -1 &&
      fileSize < 2.5e7 // 25 mb
    ) {
      this.props.client
        .query({
          query: fetchPDFUploadLink,
          variables: {
            contentType,
            contentId
          },
          fetchPolicy: 'network-only'
        })
        .then(({ data }) => {
          const pdfLink = data?.fetchPDFUploadLink
          if (Array.isArray(pdfLink) && pdfLink.length === 2) {
            this.awsId = pdfLink[0]
            this.awsLink = pdfLink[1]
            this.setState(
              ({ form }) => ({
                isValidPdf: true,
                file,
                form: {
                  ...form,
                  type: fileTypesTypes[contentType]
                }
              }),
              () => this.form.current.validate()
            )
          } else if (
            Array.isArray(pdfLink) &&
            pdfLink[0] === 'MAX_QUOTA_REACHED'
          ) {
            this.setState({
              maxLimitReached: true,
              isValidPdf: false,
              file: null
            })
          }
        })
        .catch(error => {
          captureFilteredError(error)
          this.setState({
            isValidPdf: false,
            file: null
          })
        })
    } else {
      Notification({
        message: 'Please input a valid file',
        type: 'error',
        duration: 1500,
        iconClass: 'el-icon-error'
      })
      e.target.value = ''
      this.setState({
        isValidPdf: false,
        file: null
      })
    }
  }

  uploadFile = async () => {
    this.setState({ isLoading: true })

    const response = await axios.put(this.awsLink, this.state.file, {
      headers: {
        'Content-Type': this.state.file.type
      }
    })

    this.setState({ isLoading: false })
  }

  handleDeletingContent = (mutation, learningContentId) => {
    MessageBox.confirm(
      'This will remove the item from the platform permanently. Continue?',
      'Warning',
      {
        type: 'warning'
      }
    )
      .then(() => {
        mutation({
          variables: { learningContentId }
        })
          .then(({ data: { deleteUserLearningContent } }) => {
            if (deleteUserLearningContent !== 'OK') {
              Notification({
                type: 'success',
                message: `The item has been successfully removed`,
                duration: 2500,
                offset: 90
              })
              if (typeof this.props.handleSubmit === 'function') {
                this.props.handleSubmit()
              } else this.props.history.goBack()
            }
          })
          .catch(() => {
            Notification({
              type: 'warning',
              message: `Oops! Something went wrong`,
              duration: 2500,
              offset: 90
            })
          })
      })
      .catch(() => {})
  }
  // setStartingDate = value => {
  //   if (value !== null) {
  //     const [day, month, year] = [
  //       value.getDate(),
  //       value.getMonth(),
  //       value.getFullYear()
  //     ]
  //     this.setState(({ form }) => {
  //       const { startDate } = form
  //       const date = new Date(startDate)
  //       date.setDate(day)
  //       date.setMonth(month)
  //       date.setFullYear(year)
  //       return {
  //         form: {
  //           ...form,
  //           startDate: date
  //         }
  //       }
  //     })
  //   }
  // }

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

  // handleUrlBlur = async () => {
  //   const { url = '' } = this.state.form
  //   // check if url has a dot i.e. something.com
  //   if (url.split('.').length > 1) {
  //     // check if url begins with a protocol
  //     const urlRegex = new RegExp('^(?:(?:http|https|ftp)://)', 'i')
  //     if (!urlRegex.test(url)) {
  //       this.setState(
  //         ({ form }) => ({
  //           form: {
  //             ...form,
  //             url: 'https://' + url.trim() // append https. Our clients' safety is our top priority
  //           }
  //         }),
  //         this.requestContentInformation
  //       )
  //     } else await this.requestContentInformation()
  //   }
  // }

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

    const {
      initialValues: {
        title,
        url,
        relatedPrimarySkills,
        publishedDate,
        author,
        source,
        price: { value, currency },
        type
        // isFile
      }
    } = this.props

    const isFile = source?._id?.indexOf('user') !== -1

    delete this.state.selectedPrimarySkills
    this.setState({
      form: {
        title,
        ...(!isFile && { url }),
        type,
        relatedPrimarySkills,
        publishedDate: new Date(publishedDate),
        author,
        price: {
          value,
          currency
        }
      },
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
      isFile,
      isLoading,
      paid,
      form: {
        url,
        title,
        author,
        type,
        publishedDate,
        // startDate,
        relatedPrimarySkills,
        price
        // primarySkillName
      }
    } = this.state

    const selectorProps = {
      buttonValue: 'Find skills...',
      buttonClass: 'list-skill-selector__button-input',
      skills: [],
      onSkillsSubmit: this.onSkillsSubmit,
      filterSkills: relatedPrimarySkills,
      clearState: true
    }
    return (
      <>
        <Form ref={this.form} model={this.state.form}>
          {/* <FormDescription
              label='Edit learning item'
              description='Verify the fields and submit your item'
            /> */}
          <FormGroup>
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
            {isFile ? (
              <>
                <FormDescription
                  description={
                    <>
                      Accepted File Types: jpeg, png, txt, pdf, xls, ppt, doc,
                      key, pages, wav, mp3 <br />
                      Maximum size: 25 mb
                    </>
                  }
                />
                <Form.Item
                  label='Upload a new version of your file'
                  prop='selectedFile'
                >
                  <input type='file' onChange={e => this.onFileChange(e)} />
                </Form.Item>
              </>
            ) : (
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
            )}
            <Form.Item label='Related skills' prop='relatedPrimarySkills'>
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
                const { name, skillLevel, frameworkId, category } = primarySkill
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
            {!isFile && (
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
                  <Select.Option label='Podcast' value='PODCAST' />
                  {/* <Select.Option label='Event' value='EVENT' />
                    <Select.Option label='Workshop' value='WORKSHOP' /> */}
                </Select>
              </Form.Item>
            )}
            <Form.Item label='Author' prop='author'>
              <Input
                value={author}
                onChange={value => this.onChange('author', value)}
              />
            </Form.Item>
            {/* {type === 'EVENT' || type === 'WORKSHOP' ? (
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
              ) : ( */}
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
            {/* )} */}
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
        <br />
        <Mutation mutation={userEditLearningContent}>
          {(mutate, { loading }) => {
            return (
              <Button
                type='primary'
                loading={loading || isLoading}
                onClick={() =>
                  this.form.current.validate(async valid => {
                    if (valid) {
                      if (isFile && this.state.file) {
                        try {
                          await this.uploadFile()
                        } catch (err) {
                          captureFilteredError(err)
                          Notification({
                            message:
                              'We could not upload your new file. Please try again later.',
                            type: 'error',
                            duration: 1500,
                            iconClass: 'el-icon-error'
                          })
                          return
                        }
                      }

                      const learningContentData = this.state.form

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
                          },
                          learningContentId: this.props.contentId
                        }
                      })
                        .then(
                          ({ data: { userEditLearningContent: result } }) => {
                            Notification({
                              type: 'success',
                              message: `Successfully updated`,
                              duration: 2500,
                              offset: 90
                            })
                            if (typeof this.props.handleSubmit === 'function') {
                              this.props.handleSubmit(result)
                            } else this.props.history.goBack()
                          }
                        )
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
        <Button type='text' onClick={this.resetForm}>
          Reset
        </Button>
        <Mutation mutation={deleteUserLearningContent}>
          {(mutate, { loading }) => {
            return (
              <Button
                type='text'
                loading={loading}
                style={{ marginLeft: 0, paddingLeft: 10 }}
                onClick={() =>
                  this.handleDeletingContent(mutate, this.props.contentId)
                }
              >
                <i
                  className='el-icon-delete'
                  style={{ fontSize: 18, marginRight: 4 }}
                />
                Delete
              </Button>
            )
          }}
        </Mutation>
        <style jsx>{skillItemStyle}</style>
        {/* <style jsx>{listStyleSelectorStyle}</style> */}
      </>
    )
  }
}

export const ContentEdit = ({ contentId, handleSubmit, history }) => {
  const { data, loading, error } = useQuery(fetchLearningContent, {
    fetchPolicy: 'cache-and-network',
    variables: {
      learningContentId: contentId
    }
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Redirect to='/error-page/500' />
  }

  const item = data?.fetchLearningContent

  if (!item) return <Redirect to='/error-page/404' />

  return (
    <ApolloConsumer>
      {client => (
        <HandleGlobalState>
          {setFrameworkState => (
            <ContentForm
              client={client}
              initialValues={item}
              contentId={contentId}
              history={history}
              setFrameworkState={setFrameworkState}
              handleSubmit={handleSubmit}
            />
          )}
        </HandleGlobalState>
      )}
    </ApolloConsumer>
  )
}

export default () => {
  const { state } = useLocation()

  const contentId = state?.contentId

  const history = useHistory()

  if (contentId) {
    return (
      <>
        <div className='page-heading'>
          <i
            className='page-heading__back__button icon icon-small-right icon-rotate-180'
            onClick={history.goBack}
          />
          <div className='page-heading-info'>
            <h1>Learning item edit</h1>
          </div>
        </div>
        <ContentEdit contentId={contentId} history={history} />
      </>
    )
  }

  return <Redirect to='/library' />
}
