import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { Message, Button } from 'element-react'
import { addLearningContent, fetchAllSkills } from '../../../api'

const SubmitButton = ({
  form,
  content: { relatedPrimarySkills, duration, ...contentData },
  handleReset,
  organizationSpecific
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
          mutation={addLearningContent}
          // UPDATE: will maybe look at this function later, refetch for now

          // update={(cache, { data: { addLearningContent } }) => {
          //   const { fetchAllLearningContent } = cache.readQuery({
          //     query: ContentQuery
          //   })
          //   cache.writeQuery({
          //     query: ContentQuery,
          //     data: {
          //       fetchAllLearningContent: [
          //         {
          //           ...addLearningContent,
          //           price: {
          //             ...addLearningContent.price,
          //             _id: addLearningContent._id
          //           },
          //           createdAt: Date.now()
          //         },
          //         ...fetchAllLearningContent
          //       ]
          //     }
          //   })
          // }}
          refetchQueries={[
            'fetchAllLearningContent',
            'fetchRelevantLearningContent'
          ]}
        >
          {(addLearningContent, { loading, error }) => (
            <Button
              type='primary'
              onClick={e => {
                e.preventDefault()

                if (form) {
                  form.validate(async valid => {
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
                      const learningContentData = {
                        ...contentData,
                        relatedPrimarySkills: [...updatedRelatedPrimarySkills],
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
                          : parseInt(nOfReviews)
                      }
                      // We don't want to add another field/dependency in the backend
                      // so we delete it or an error is thrown
                      delete learningContentData.public
                      try {
                        await addLearningContent({
                          variables: {
                            learningContentData
                          }
                        })
                        Message({
                          type: 'success',
                          message: 'Content is successfully added'
                        })
                        handleReset()
                      } catch (err) {
                        console.log(err)
                        Message({
                          type: 'error',
                          message: `${err}`
                        })
                      }
                    } else {
                      console.log('Error submitting!')
                      return false
                    }
                  })
                } else {
                  Message({
                    type: 'error',
                    message: `You cannot submit and empty form`
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

export default SubmitButton
