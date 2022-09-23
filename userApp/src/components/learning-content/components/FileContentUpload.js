import React, { Component } from 'react'
import {
  FormGroup,
  StarBar,
  Statement,
  FormDescription,
  ListSkillSelector
} from '../../ui-components'
import {
  Form,
  Button,
  Notification,
  Input,
  DatePicker,
  Radio
} from 'element-react'
// import Autosuggest from 'react-autosuggest'
import { /* Query, */ Mutation, ApolloConsumer } from 'react-apollo'
import { LoadingSpinner, captureFilteredError } from '../../general'
import {
  // fetchOrganizationSpecificSkills,
  fetchPDFUploadLink,
  userAddLearningContentPDF
} from '../../../api'
import { HandleGlobalState /*, autoSuggestTheme */ } from '.'
import initialFormValues from '../constants/_initial-form-values'
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

class FileContentUpload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: { ...initialFormValues.pdfForm },
      paid: false,
      isValidPdf: false,
      // skillData: props.skillData,
      // suggestions: [],
      isLoading: false,
      // shouldSeeFramework: false,
      // selectedFrameworkId: '',
      // selectedLevel: 0,
      // selectedName: '',
      selectedPrimarySkills: []
    }
  }

  form = React.createRef()

  resetForm = () => {
    if (this.form.current !== null) {
      this.form.current.resetFields()
    }
    delete this.state.selectedPrimarySkills
    this.setState({
      form: { ...initialFormValues.pdfForm },
      isValidPdf: false,
      // skillData: this.props.skillData,
      // suggestions: [],
      isLoading: false,
      shouldSeeFramework: false,
      selectedFrameworkId: '',
      selectedLevel: 0,
      selectedName: '',
      selectedPrimarySkills: []
    })
  }

  onFileChange = async e => {
    if (!e || !e.target || !e.target.files[0]) return
    const contentType = e.target.files[0].type
    const fileSize = e.target.files[0].size
    if (process.env.REACT_APP_STAGING) console.log(contentType)
    if (
      acceptedFileTypes.indexOf(contentType) !== -1 &&
      fileSize < 2.5e7 // 25 mb
    ) {
      const selectedFile = e.target.files[0]
      this.props.apolloClient
        .query({
          query: fetchPDFUploadLink,
          variables: {
            contentType
          },
          fetchPolicy: 'network-only'
        })
        .then(({ data }) => {
          const pdfLink = data && data.fetchPDFUploadLink
          if (Array.isArray(pdfLink) && pdfLink.length === 2) {
            this.awsId = pdfLink[0]
            this.awsLink = pdfLink[1]
            this.setState(
              ({ form }) => ({
                isValidPdf: true,
                form: {
                  ...form,
                  selectedFile,
                  type: fileTypesTypes[contentType]
                }
              }),
              () => this.form.current.validate()
            )
          } else if (
            Array.isArray(pdfLink) &&
            pdfLink[0] === 'MAX_QUOTA_REACHED'
          ) {
            this.setState(({ form }) => ({
              maxLimitReached: true,
              isValidPdf: false,
              form: {
                ...form,
                selectedFile: null
              }
            }))
          }
        })
        .catch(eee => {
          captureFilteredError(eee)
          this.setState(({ form }) => ({
            isValidPdf: false,
            form: {
              ...form,
              selectedFile: null
            }
          }))
        })
    } else {
      Notification({
        message: 'Please input a valid file',
        type: 'error',
        duration: 1500,
        iconClass: 'el-icon-error'
      })
      e.target.value = ''
      this.setState(({ form }) => ({
        isValidPdf: false,
        form: {
          ...form,
          selectedFile: null
        }
      }))
    }
  }

  // AUTOSUGGEST METHODS Now All over ze place...

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

  onChange = (key, value) => {
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
    this.resetForm()
  }

  uploadPDF = (mutation, variables) => {
    // TODO: USER FEEDBACK FOR UPLOAD STATE!
    this.setState({ isLoading: true })
    axios
      .put(this.awsLink, this.state.form.selectedFile, {
        headers: {
          'Content-Type': this.state.form.selectedFile.type
        }
      })
      .then(async res => {
        /*  VALIDATE IT WAS SUCCESSFULl */
        this.setState({ isLoading: false })
        mutation({ variables }).then(
          ({ data: { userAddLearningContentPDF } }) => {
            this.props.displayContent(userAddLearningContentPDF, true)
            Notification({
              type: 'success',
              message: 'Item uploaded successfully',
              duration: 2500,
              offset: 90
            })
          }
        )
      })
      .catch(e => {
        captureFilteredError(e)
        this.setState({ isLoading: false })
      })
  }

  render() {
    const {
      // suggestions,
      // shouldSeeFramework,
      // selectedFrameworkId,
      // selectedLevel,
      // selectedName,
      isLoading,
      maxLimitReached,
      paid
    } = this.state

    if (maxLimitReached)
      return (
        <div>
          <Statement
            content={
              <>
                You've reached the maximum amount of allowed uploaded content
                quota of 50 MB <br />
                Either delete some of your uploaded content from Innential, or
                contact us to increase your quota!
              </>
            }
          />
        </div>
      )
    const {
      title,
      author,
      publishedDate,
      relatedPrimarySkills,
      price,
      // primarySkillName,
      type
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
        <Form
          ref={this.form}
          model={this.state.form}
          onSubmit={e => e.preventDefault()}
        >
          <FormGroup mainLabel='Upload a file'>
            <FormDescription
              description={
                <>
                  Accepted File Types: jpeg, png, txt, pdf, xls, ppt, doc, key,
                  pages, wav, mp3 <br />
                  Maximum size: 25 mb
                </>
              }
            />
            <Form.Item
              prop='selectedFile'
              rules={[
                {
                  required: true,
                  message: 'Please upload a valid file'
                }
              ]}
            >
              <input type='file' onChange={e => this.onFileChange(e)} />
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
          </FormGroup>

          <FormGroup mainLabel='Basic information'>
            <Form.Item
              label='Title'
              prop='title'
              rules={{
                required: true,
                message: 'Please provide the title of the learning item'
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
              label='Date published'
              prop='publishedDate'
              rules={{
                required: true,
                message: 'Please select correct learning item published date',
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
          mutation={userAddLearningContentPDF}
          refetchQueries={['fetchUserUploadedContent']}
        >
          {(mutation, { loading }) => {
            if (loading || isLoading) return <LoadingSpinner />
            return (
              <Button
                type='primary'
                onClick={() =>
                  this.form.current.validate(async valid => {
                    if (valid) {
                      const variables = {
                        learningContentData: {
                          awsId: this.awsId,
                          title,
                          author,
                          publishedDate,
                          relatedPrimarySkills: relatedPrimarySkills.map(
                            ({ _id, name, skillLevel: level, importance }) => {
                              const skillLevel = isNaN(level) ? 0 : level
                              return {
                                _id,
                                name,
                                skillLevel,
                                importance
                              }
                            }
                          ),
                          price: {
                            ...price,
                            value: parseFloat(price.value || 0)
                          },
                          type
                        }
                      }
                      this.uploadPDF(mutation, variables)
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

export default props => (
  <HandleGlobalState>
    {setFrameworkState => (
      <ApolloConsumer>
        {client => (
          <FileContentUpload
            {...props}
            setFrameworkState={setFrameworkState}
            apolloClient={client}
          />
        )}
      </ApolloConsumer>
    )}
  </HandleGlobalState>
)
