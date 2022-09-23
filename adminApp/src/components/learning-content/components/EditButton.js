import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { Message, Button } from 'element-react'
import { editLearningContent, fetchAllSkills } from '../../../api'

const EditButton = ({
  form,
  content: { relatedPrimarySkills, duration, ...contentData },
  handleReset,
  learningContentId
}) => (
  <Query query={fetchAllSkills}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      const skills = data && data.fetchAllSkills
      const updatedRelatedPrimarySkills = []
      relatedPrimarySkills.map(item => {
        const { value, importance, ...rest } = item
        if (value.length > 0) {
          const skill = skills.filter(d => d._id === value[1])[0]
          if (skill) {
            updatedRelatedPrimarySkills.push({
              ...rest,
              importance: parseFloat(importance) || 3,
              name: skill.name,
              _id: skill._id
            })
          }
        }
      })
      return (
        <Mutation
          mutation={editLearningContent}
          refetchQueries={[
            'fetchLearningContentEditForm',
            'fetchLearningContentIDBySource'
          ]}
        >
          {(editLearningContent, { loading, error }) => (
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

                      const priceValue =
                        contentData && parseFloat(contentData.price.value)

                      const { nOfReviews, externalRating, url } = contentData

                      const learningContentData = {
                        ...contentData,
                        relatedPrimarySkills: [...updatedRelatedPrimarySkills],
                        relatedInterests: contentData.relatedInterests.filter(
                          i => i._id
                        ),
                        relatedIndustries: contentData.relatedIndustries.filter(
                          i => i._id
                        ),
                        price: {
                          currency: contentData.price.currency,
                          value: isNaN(priceValue) ? 0 : priceValue
                        },
                        source: contentData.source._id,
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
                        url: url !== null ? url : null,
                        organizationSpecific: contentData.public
                          ? null
                          : contentData.organizationSpecific
                      }
                      // We don't want to add another field/dependency in the backend
                      // so we delete it or an error is thrown
                      delete learningContentData.public
                      await editLearningContent({
                        variables: {
                          learningContentData,
                          learningContentId
                        }
                      })
                      if (!error) {
                        Message({
                          type: 'success',
                          message: 'Content successfully updated'
                        })
                      } else {
                        Message({ type: 'info', message: `${error}` })
                      }
                    } else {
                      console.log('error submit!!')
                      return false
                    }
                  })
                } else {
                  Message({
                    type: 'error',
                    message: `You haven't updated any field`
                  })
                }
              }}
            >
              Save
            </Button>
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default EditButton
