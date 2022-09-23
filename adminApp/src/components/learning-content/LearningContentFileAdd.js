import React, { Component } from 'react'
import {
  Layout,
  Button,
  Form,
  Select,
  Input,
  Message,
  DatePicker,
  Checkbox,
  Progress
} from 'element-react'
import {
  SubmitButtonFile,
  EditButton,
  MultipleSkillsSelector,
  PrimarySkillSelector,
  InterestsSelector,
  IndustrySelector,
  LinesOfWorkSelector,
  ThumbnailUpload
} from './components'
import { fetchPDFUploadLink } from '../../api'
import { withRouter } from 'react-router-dom'

import { initialFormValues, formValidationRules } from './constants'

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
  'audio/mpeg',
  'video/mp4'
]

const fileTypesTypes = {
  'image/jpeg': 'IMAGE',
  'image/png': 'IMAGE',
  'text/plain': 'TXT',
  'audio/wav': 'WAV',
  'audio/mpeg': 'MP3',
  'video/mp4': 'MP4',
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

export default withRouter(
  class LearningContentFileAdd extends Component {
    constructor(props) {
      super(props)

      const initialValues = this.props.initialFormValues
        ? this.props.initialFormValues
        : null

      const organizationSpecific =
        this.props.organizationSpecific ||
        (initialValues && initialValues.organizationSpecific)

      const selectedSecondarySkills =
        initialValues && initialValues.selectedSecondarySkills.length > 0
          ? initialValues.selectedSecondarySkills
          : [...initialFormValues.selectedSecondarySkills]
      const selectedIndustries =
        initialValues && initialValues.selectedIndustries.length > 0
          ? initialValues.selectedIndustries
          : [...initialFormValues.selectedIndustries]
      const selectedInterests =
        initialValues && initialValues.selectedInterests.length > 0
          ? initialValues.selectedInterests
          : [...initialFormValues.selectedInterests]
      const selectedPrimarySkills =
        initialValues && initialValues.selectedPrimarySkills.length > 0
          ? initialValues.selectedPrimarySkills
          : [...initialFormValues.selectedPrimarySkills]

      const initialFormValuesFromProps = initialValues
        ? {
            title: initialValues.title,
            author: initialValues.author,
            url: initialValues.url,
            source: initialValues.source,
            type: initialValues.type,
            certified: initialValues.certified,
            german: initialValues.german,
            externalRating: initialValues.externalRating,
            nOfReviews: initialValues.nOfReviews,
            price: {
              currency: initialValues.price.currency,
              value: initialValues.price.value
            },
            duration: {
              ...(initialValues.duration || initialFormValues.duration)
            },
            publishedDate: initialValues.publishedDate
              ? new Date(initialValues.publishedDate)
              : new Date(),
            relatedIndustries: initialValues.relatedIndustries.map(
              industry => ({
                name: industry.name,
                _id: industry._id
              })
            ),
            relatedInterests: initialValues.relatedInterests.map(interest => ({
              name: interest.name,
              _id: interest._id
            })),
            relatedSecondarySkills: initialValues.relatedSecondarySkills.map(
              skill => ({
                name: skill.name,
                _id: skill._id
              })
            ),
            relatedPrimarySkills: initialValues.relatedPrimarySkills.map(
              skill => ({
                skillLevel: skill.skillLevel,
                importance: skill.importance,
                value: skill.value
              })
            ),
            relatedLineOfWork: initialValues.relatedLineOfWork._id
              ? {
                  _id: initialValues.relatedLineOfWork._id,
                  name: initialValues.relatedLineOfWork.name
                }
              : {}
          }
        : {}

      this.editing = props.editing

      this.state = {
        form: { ...initialFormValues.form, ...initialFormValuesFromProps },
        imageLink: props.initialFormValues && props.initialFormValues.imageLink,
        selectedPrimarySkills,
        selectedSecondarySkills,
        selectedInterests,
        selectedIndustries,
        rules: { ...formValidationRules },
        organizationSpecific,
        fileUploadPercentage: 0
      }
    }

    myRef = React.createRef()

    addNewItem = (itemPropertyKey, e) => {
      e.preventDefault()
      this.setState(state => {
        return {
          ...state,
          [itemPropertyKey]: [
            ...state[itemPropertyKey],
            {
              ...initialFormValues[itemPropertyKey][0],
              key: state[itemPropertyKey].length
            }
          ]
        }
      })
    }

    removeItem = (itemPropertyKey, itemPropertyFormKey, itemKey, e) => {
      const newSelectedItem = this.state[itemPropertyKey].filter(
        item => item.key !== itemKey
      )

      if (itemKey + 1 === this.state.form[itemPropertyFormKey].length) {
        const newFormItem = [...this.state.form[itemPropertyFormKey]]
        newFormItem.splice(itemKey, 1)
        this.setState(() => ({
          form: Object.assign({}, this.state.form, {
            [itemPropertyFormKey]: [...newFormItem]
          })
        }))
      }
      this.setState(() => ({
        [itemPropertyKey]: [...newSelectedItem]
      }))

      e.preventDefault()
    }

    handleReset = () => {
      this.myRef.current.resetFields()

      this.setState(() => ({
        form: { ...initialFormValues.form },
        selectedPrimarySkills: [...initialFormValues.selectedPrimarySkills],
        selectedSecondarySkills: [...initialFormValues.selectedSecondarySkills],
        selectedInterests: [...initialFormValues.selectedInterests],
        selectedIndustries: [...initialFormValues.selectedIndustries]
      }))

      if (this.fileInput) {
        this.fileInput.value = ''
      }
    }

    onChange(key, value, shouldParseInt) {
      this.setState(() => ({
        form: Object.assign({}, this.state.form, {
          [key]: shouldParseInt
            ? parseInt(value !== '' ? value : '0', 10)
            : value
        })
      }))
    }

    timeout = null

    debounce(mutate) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        ;(async () => {
          try {
            await mutate()
          } catch (err) {
            console.error(err)
          }
        })()
      }, 2000)
    }

    onChangePrice(key, value, shouldParseInt) {
      this.setState(() => ({
        form: Object.assign({}, this.state.form, {
          price: {
            ...this.state.form.price,
            [key]: shouldParseInt ? parseInt(value) : value
          }
        })
      }))
    }

    handleChangeDuration(key, value) {
      this.setState(({ form }) => ({
        form: {
          ...form,
          duration: {
            ...form.duration,
            [key]: value
          }
        }
      }))
    }

    onChangeLineOfWork = value => {
      this.setState(({ form }) => ({
        form: {
          ...form,
          relatedLineOfWork: {
            name: value.name,
            _id: value._id
          }
        }
      }))
    }

    onChangePrimarySkill = (propertyKey, value, key) => {
      const reducer = (acc, curr, i, srcArray) => {
        const { _id, name, ...rest } = curr
        if (i === key) {
          return [
            ...acc,
            {
              ...rest,
              [propertyKey]: value
            }
          ]
        }
        if (key > srcArray.length - 1) {
          return [
            ...srcArray,
            {
              ...srcArray[0],
              [propertyKey]: value
            }
          ]
        }
        return [
          ...acc,
          {
            ...rest
          }
        ]
      }
      const reducerInitialValue = []
      const updatedRelatedPrimarySkills = this.state.form.relatedPrimarySkills.reduce(
        reducer,
        reducerInitialValue
      )
      const updatedSelectedPrimarySkills = this.state.selectedPrimarySkills.reduce(
        reducer,
        reducerInitialValue
      )
      this.setState(({ form }) => ({
        form: {
          ...form,
          relatedPrimarySkills: [...updatedRelatedPrimarySkills]
        },
        selectedPrimarySkills: [...updatedSelectedPrimarySkills]
      }))
    }

    onSkillsChange = (key, value, relatedSkill) => {
      const newSelectedSecondarySkills = this.state.selectedSecondarySkills.reduce(
        (acc, curr) => {
          if (curr.key === key) {
            return [
              ...acc,
              {
                ...curr,
                value
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
      const currentSkillsIds = this.state.form.relatedSecondarySkills.map(
        s => s._id
      )
      if (!currentSkillsIds.includes(value[value.length - 1])) {
        // TODO: Handle skill change based on index

        let newRelatedSecondarySkills = []
        const currentRelatedSecondarySkills = this.state.form
          .relatedSecondarySkills

        if (key < currentRelatedSecondarySkills.length) {
          newRelatedSecondarySkills = currentRelatedSecondarySkills.reduce(
            (acc, curr, ix) => {
              if (ix === key) {
                acc.push({
                  name: relatedSkill.name,
                  _id: relatedSkill._id
                })
              } else {
                acc.push(curr)
              }
              return acc
            },
            []
          )
        } else {
          newRelatedSecondarySkills = [
            ...currentRelatedSecondarySkills,
            {
              name: relatedSkill.name,
              _id: relatedSkill._id
            }
          ]
        }

        this.setState(({ form }) => ({
          form: {
            ...form,
            relatedSecondarySkills: [...newRelatedSecondarySkills]
          }
        }))
        this.setState(() => ({
          selectedSecondarySkills: [...newSelectedSecondarySkills]
        }))
      } else {
        Message({ type: 'error', message: `You have already added this skill` })
      }
    }

    onInterestChange = (key, value, relatedInterest) => {
      const newSelectedInterests = this.state.selectedInterests.reduce(
        (acc, curr) => {
          if (curr.key === key) {
            return [
              ...acc,
              {
                ...curr,
                value
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

      const currentInterestsIds = this.state.form.relatedInterests.map(
        s => s._id
      )
      if (!currentInterestsIds.includes(value)) {
        let newRelatedInterests = []
        const currentRelatedInterests = this.state.form.relatedInterests

        if (key < currentRelatedInterests.length) {
          newRelatedInterests = currentRelatedInterests.reduce(
            (acc, curr, ix) => {
              if (ix === key) {
                acc.push({
                  name: relatedInterest && relatedInterest.name,
                  _id: relatedInterest && relatedInterest._id
                })
              } else {
                acc.push(curr)
              }
              return acc
            },
            []
          )
        } else {
          newRelatedInterests = [
            ...currentRelatedInterests,
            {
              name: relatedInterest && relatedInterest.name,
              _id: relatedInterest && relatedInterest._id
            }
          ]
        }
        this.setState({
          form: Object.assign({}, this.state.form, {
            relatedInterests: [...newRelatedInterests]
          }),
          selectedInterests: [...newSelectedInterests]
        })
      } else {
        // TODO: do now allow users to add this Interest despite of the message. Right now the selectedInterests still get's an update
        Message({
          type: 'error',
          message: `You have already added this Interest`
        })
      }
    }

    onIndustryChange = (value, key, relatedIndustry) => {
      const newSelectedIndustries = this.state.selectedIndustries.reduce(
        (acc, curr) => {
          if (curr.key === key) {
            return [
              ...acc,
              {
                ...curr,
                value
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

      const currentIndustriesIds = this.state.form.relatedIndustries.map(
        s => s._id
      )
      if (!currentIndustriesIds.includes(value)) {
        let newRelatedIndustries = []
        const currentRelatedIndustries = this.state.form.relatedIndustries

        if (key < currentRelatedIndustries.length) {
          newRelatedIndustries = currentRelatedIndustries.reduce(
            (acc, curr, ix) => {
              if (ix === key) {
                acc.push({
                  name: relatedIndustry && relatedIndustry.name,
                  _id: relatedIndustry && relatedIndustry._id
                })
              } else {
                acc.push(curr)
              }
              return acc
            },
            []
          )
        } else {
          newRelatedIndustries = [
            ...currentRelatedIndustries,
            {
              name: relatedIndustry && relatedIndustry.name,
              _id: relatedIndustry && relatedIndustry._id
            }
          ]
        }

        this.setState({
          form: Object.assign({}, this.state.form, {
            relatedIndustries: [...newRelatedIndustries]
          }),
          selectedIndustries: [...newSelectedIndustries]
        })
      } else {
        // TODO: do now allow users to add this Interest despite of the message. Right now the selectedInterests still get's an update
        Message({
          type: 'error',
          message: `You have already added this Industry`
        })
      }
    }

    clearSecondarySkills = () => {
      this.setState(() => ({
        form: {
          ...this.state.form,
          relatedSecondarySkills: []
        },
        selectedSecondarySkills: [...initialFormValues.selectedSecondarySkills]
      }))
    }

    onFileChange = async e => {
      if (!e || !e.target || !e.target.files[0]) return
      const contentType = e.target.files[0].type
      if (process.env.REACT_APP_STAGING) console.log(contentType)
      if (acceptedFileTypes.indexOf(contentType) !== -1) {
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
                () => this.myRef.current.validate()
              )
            }
            // else if (
            //   Array.isArray(pdfLink) &&
            //   pdfLink[0] === 'MAX_QUOTA_REACHED'
            // ) {
            //   this.setState(({ form }) => ({
            //     maxLimitReached: true,
            //     isValidPdf: false,
            //     form: {
            //       ...form,
            //       selectedFile: null
            //     }
            //   }))
            // }
          })
          .catch(eee => {
            // captureFilteredError(eee)

            Message({
              message: 'Something went wrong. Please try again.',
              type: 'error',
              duration: 1500,
              iconClass: 'el-icon-error'
            })

            this.setState(({ form }) => ({
              isValidPdf: false,
              form: {
                ...form,
                selectedFile: null
              }
            }))
          })
      } else {
        Message({
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

    updateUploadPercentage = percentage => {
      this.setState({
        fileUploadPercentage: percentage
      })
    }

    render() {
      return (
        <Layout.Row>
          <Layout.Col span='24'>
            <Form
              ref={this.myRef}
              className='en-US'
              model={this.state.form}
              rules={this.state.rules}
              onSubmit={e => e.preventDefault()}
              labelWidth='120'
            >
              <Form.Item label='Title' prop='title'>
                <Input
                  name={'title'}
                  value={this.state.form.title}
                  onChange={value => this.onChange('title', value)}
                />
              </Form.Item>
              <Form.Item
                label='File'
                prop='selectedFile'
                rules={[
                  {
                    required: !this.editing,
                    message: 'Please upload a valid file'
                  }
                ]}
              >
                <input
                  type='file'
                  onChange={e => this.onFileChange(e)}
                  ref={ref => (this.fileInput = ref)}
                />
              </Form.Item>
              <Form.Item label='Author' prop='author'>
                <Input
                  name={'author'}
                  value={this.state.form.author}
                  onChange={value => this.onChange('author', value)}
                />
              </Form.Item>
              <Form.Item label='Published Date' prop='publishedDate'>
                <DatePicker
                  name={'date'}
                  value={this.state.form.publishedDate}
                  placeholder='Choose the published date'
                  onChange={value => {
                    this.onChange('publishedDate', value)
                  }}
                />
              </Form.Item>
              <Form.Item label='Price'>
                <Layout.Col span='6'>
                  <Form.Item label='Currency' prop='currency'>
                    <Select
                      name={`currency`}
                      value={this.state.form.price.currency}
                      placeholder=''
                      onChange={value => this.onChangePrice('currency', value)}
                    >
                      <Select.Option label='EUR' value='EUR' />
                      <Select.Option label='USD' value='USD' />
                      <Select.Option label='GBP' value='GBP' />
                      <Select.Option label='CHF' value='CHF' />
                    </Select>
                  </Form.Item>
                </Layout.Col>
                <Layout.Col span='6'>
                  <Form.Item label='Price' prop='value'>
                    <Input
                      name={'value'}
                      value={this.state.form.price.value}
                      onChange={value => this.onChangePrice('value', value)}
                    />
                  </Form.Item>
                </Layout.Col>
              </Form.Item>
              <Form.Item label='External reviews'>
                <Layout.Col span='6'>
                  <Form.Item label='Rating' prop='externalRating'>
                    <Input
                      name={'externalRating'}
                      value={this.state.form.externalRating}
                      onChange={value => this.onChange('externalRating', value)}
                    />
                  </Form.Item>
                </Layout.Col>
                <Layout.Col span='6'>
                  <Form.Item label='# of reviews' prop='nOfReviews'>
                    <Input
                      name={'nOfReviews'}
                      value={this.state.form.nOfReviews}
                      onChange={value => this.onChange('nOfReviews', value)}
                    />
                  </Form.Item>
                </Layout.Col>
              </Form.Item>
              <Form.Item label='Is certified?' prop='certified'>
                <Checkbox
                  name={'certified'}
                  checked={this.state.form.certified}
                  onChange={value => this.onChange('certified', value)}
                />
              </Form.Item>
              <Form.Item label='Is German content?' prop='german'>
                <Checkbox
                  name={'german'}
                  checked={this.state.form.german}
                  onChange={value => this.onChange('german', value)}
                />
              </Form.Item>
              <Form.Item label='Duration' prop='duration'>
                <Layout.Col span='6'>
                  <Form.Item label='Basis' prop='basis'>
                    <Select
                      name={`basis`}
                      value={this.state.form.duration.basis}
                      placeholder=''
                      onChange={value =>
                        this.handleChangeDuration('basis', value)
                      }
                    >
                      <Select.Option label='One time' value='ONE TIME' />
                      <Select.Option label='Weekly' value='PER WEEK' />
                      <Select.Option label='None' value='' />
                    </Select>
                  </Form.Item>
                </Layout.Col>
                {this.state.form.duration.basis && (
                  <Layout.Col span='8'>
                    {this.state.form.duration.basis === 'ONE TIME' ? (
                      <Layout.Row
                        style={{ textAlign: 'center', marginLeft: '10px' }}
                      >
                        <Layout.Col span='3'>
                          <Input
                            name={'hours'}
                            value={this.state.form.duration.hours}
                            onChange={value =>
                              this.handleChangeDuration('hours', value)
                            }
                          />
                        </Layout.Col>
                        <Layout.Col span='4'>hours</Layout.Col>
                        <Layout.Col span='3'>
                          <Input
                            name={'minutes'}
                            value={this.state.form.duration.minutes}
                            onChange={value =>
                              this.handleChangeDuration('minutes', value)
                            }
                          />
                        </Layout.Col>
                        <Layout.Col span='5'>minutes</Layout.Col>
                      </Layout.Row>
                    ) : (
                      <Layout.Row
                        style={{ textAlign: 'center', marginLeft: '10px' }}
                      >
                        <Layout.Col span='4'>
                          <Input
                            name={'hoursMin'}
                            value={this.state.form.duration.hoursMin}
                            onChange={value =>
                              this.handleChangeDuration('hoursMin', value)
                            }
                          />
                        </Layout.Col>
                        <Layout.Col span='2'>-</Layout.Col>
                        <Layout.Col span='4'>
                          <Input
                            name={'hoursMax'}
                            value={this.state.form.duration.hoursMax}
                            onChange={value =>
                              this.handleChangeDuration('hoursMax', value)
                            }
                          />
                        </Layout.Col>
                        <Layout.Col span='4'>h/week</Layout.Col>
                        <Layout.Col span='2'>for</Layout.Col>
                        <Layout.Col span='4'>
                          <Input
                            name={'weeks'}
                            value={this.state.form.duration.weeks}
                            onChange={value =>
                              this.handleChangeDuration('weeks', value)
                            }
                          />
                        </Layout.Col>
                        <Layout.Col span='4'>weeks</Layout.Col>
                      </Layout.Row>
                    )}
                  </Layout.Col>
                )}
              </Form.Item>
              <PrimarySkillSelector
                selectedPrimarySkills={this.state.selectedPrimarySkills}
                onChangePrimarySkill={this.onChangePrimarySkill}
                addNewItem={this.addNewItem}
                removeItem={this.removeItem}
                organizationSpecific={this.state.organizationSpecific}
              />
              <MultipleSkillsSelector
                selectedSecondarySkills={this.state.selectedSecondarySkills}
                onSkillsChange={this.onSkillsChange}
                addNewItem={this.addNewItem}
                removeItem={this.removeItem}
                clearSecondarySkills={this.clearSecondarySkills}
                organizationSpecific={this.state.organizationSpecific}
              />
              <InterestsSelector
                selectedInterests={this.state.selectedInterests}
                onInterestChange={this.onInterestChange}
                addNewItem={this.addNewItem}
                removeItem={this.removeItem}
              />
              <IndustrySelector
                selectedIndustries={this.state.selectedIndustries}
                onIndustryChange={this.onIndustryChange}
                addNewItem={this.addNewItem}
                removeItem={this.removeItem}
              />
              <Form.Item label='Related Line of work' prop='relatedLineOfWork'>
                <LinesOfWorkSelector
                  relatedLineOfWork={this.state.form.relatedLineOfWork}
                  onChangeLineOfWork={this.onChangeLineOfWork}
                />
              </Form.Item>
              <Form.Item>
                {this.props.initialFormValues &&
                !this.props.organizationSpecific ? (
                  <span>
                    <EditButton
                      form={this.myRef.current}
                      content={this.state.form}
                      handleReset={this.handleReset}
                      learningContentId={this.props.learningContentId}
                    />
                    <Button onClick={() => this.props.goBack()}>Go back</Button>
                  </span>
                ) : (
                  <SubmitButtonFile
                    myRef={this.myRef.current}
                    content={this.state.form}
                    handleReset={this.handleReset}
                    organizationSpecific={this.state.organizationSpecific}
                    awsId={this.awsId}
                    awsLink={this.awsLink}
                    updateUploadPercentage={this.updateUploadPercentage}
                  />
                )}
                <Button onClick={this.handleReset}>Reset</Button>
                {this.state.fileUploadPercentage > 0 && (
                  <div>
                    File Upload Progress ({this.state.fileUploadPercentage}%):
                    <Progress
                      percentage={this.state.fileUploadPercentage}
                      status='success'
                    />
                  </div>
                )}
                {this.props.children}
              </Form.Item>
            </Form>
            {this.props.learningContentId && (
              <div style={{ marginTop: '40px' }}>
                <h3>Thumbnail upload: </h3>
                <ThumbnailUpload
                  contentId={this.props.learningContentId}
                  imageLink={this.state.imageLink}
                />
              </div>
            )}
          </Layout.Col>
        </Layout.Row>
      )
    }
  }
)
