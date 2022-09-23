import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { Message, Button } from 'element-react'
import { addLearningContentFile, fetchAllSkills } from '../../../api'
import axios from 'axios'

const SubmitButtonFile = ({
  myRef,
  content: { relatedPrimarySkills, duration, ...contentData },
  handleReset,
  organizationSpecific,
  awsId,
  awsLink,
  updateUploadPercentage
}) => (
  <Query query={fetchAllSkills}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      const skills = data && data.fetchAllSkills
      const updatedRelatedPrimarySkills = relatedPrimarySkills.map(item => {
        const { value, importance, ...rest } = item
        if (value) {
          const skill = skills.filter(d => d._id === value[1])[0]
          return {
            ...rest,
            importance: parseFloat(importance) || 3,
            name: skill.name,
            _id: skill._id
          }
        }
      })
      return (
        <Mutation
          mutation={addLearningContentFile}
          refetchQueries={[
            'fetchAllLearningContent',
            'fetchRelevantLearningContent'
          ]}
        >
          {(addLearningContentFile, { loading, error }) => (
            <Button
              type='primary'
              onClick={e => {
                e.preventDefault()

                if (myRef) {
                  myRef.validate(async valid => {
                    if (valid) {
                      const {
                        basis,
                        hours,
                        minutes,
                        hoursMin,
                        hoursMax,
                        weeks
                      } = duration

                      const { nOfReviews, externalRating } = contentData

                      const priceValue =
                        contentData && parseFloat(contentData.price.value)

                      const {
                        selectedFile,
                        url,
                        ...finalContentData
                      } = contentData

                      const variables = {
                        learningContentData: {
                          ...finalContentData,
                          relatedPrimarySkills: [
                            ...updatedRelatedPrimarySkills
                          ],
                          organizationSpecific,
                          price: {
                            currency: contentData.price.currency,
                            value: isNaN(priceValue) ? 0 : priceValue
                          },
                          duration: basis
                            ? {
                                basis,
                                hours: parseInt(hours),
                                minutes: parseInt(minutes),
                                hoursMin: parseInt(hoursMin),
                                hoursMax: parseInt(hoursMax),
                                weeks: parseInt(weeks)
                              }
                            : null,
                          externalRating: isNaN(parseFloat(externalRating))
                            ? null
                            : parseFloat(externalRating),
                          nOfReviews: isNaN(parseInt(nOfReviews))
                            ? null
                            : parseInt(nOfReviews),
                          awsId
                        }
                      }
                      // We don't want to add another field/dependency in the backend
                      // so we delete it or an error is thrown
                      delete variables.learningContentData.public

                      const axiosConfig = {
                        headers: {
                          'Content-Type': contentData.selectedFile.type
                        },
                        onUploadProgress: progressEvent => {
                          var percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                          )

                          // don't display 100% until the file is fully submitted
                          updateUploadPercentage(
                            percentCompleted >= 99 ? 99 : percentCompleted
                          )
                        }
                      }

                      axios
                        .put(awsLink, contentData.selectedFile, axiosConfig)
                        .then(async res => {
                          addLearningContentFile({
                            variables
                          }).then(() => {
                            updateUploadPercentage(100)

                            Message({
                              type: 'success',
                              message: 'Item uploaded successfully',
                              duration: 2500,
                              offset: 90
                            })

                            handleReset()
                          })
                        })
                        .catch(err => {
                          console.log(err)
                          Message({
                            type: 'error',
                            message: `${err}`
                          })
                        })
                    } else {
                      console.log('Error submitting!')
                      return false
                    }
                  })
                } else {
                  Message({
                    type: 'error',
                    message: `You cannot submit an empty form`
                  })
                }
              }}
            >
              Create
            </Button>
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default SubmitButtonFile
