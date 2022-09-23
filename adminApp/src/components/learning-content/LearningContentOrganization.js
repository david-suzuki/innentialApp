import React from 'react'
import { Layout } from 'element-react'
import { LearningContentForm } from './'
import { fetchAllSkills } from '../../api'
import { Query } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { initialFormValues } from './constants'

const LearningContentOrganization = ({ match }) => {
  const { skillId, organizationId } = match && match.params
  return (
    <Layout.Row>
      <Layout.Col span='24'>
        <Query query={fetchAllSkills}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`
            const allSkills = data && data.fetchAllSkills
            const skill = allSkills.filter(d => d._id === skillId)[0]
            if (!skill) {
              return <Redirect to={`/error-page/404`} />
            } else {
              const learningContentFormData = {
                ...initialFormValues,
                ...initialFormValues.form,
                source: {
                  _id: '',
                  name: ''
                },
                relatedPrimarySkills: [
                  {
                    value: [skill.category, skill._id],
                    skillLevel: 0,
                    importance: 3,
                    _id: skill._id
                  }
                ],
                selectedPrimarySkills: [
                  {
                    value: [skill.category, skill._id],
                    key: 0,
                    skillLevel: 0,
                    importance: 3
                  }
                ]
              }
              return (
                <LearningContentForm
                  initialFormValues={learningContentFormData}
                  organizationSpecific={organizationId}
                />
              )
            }
          }}
        </Query>
      </Layout.Col>
    </Layout.Row>
  )
}

export default LearningContentOrganization
