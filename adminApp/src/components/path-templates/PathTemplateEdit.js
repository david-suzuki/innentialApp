import React from 'react'
import { PathTemplateForm } from './'
import { useQuery } from 'react-apollo'
import { Loading } from 'element-react'
import { fetchLearningPathByIdAdmin } from '../../api'
import { withRouter, Redirect } from 'react-router-dom'

const PathTemplateEdit = ({ match }) => {
  const pathId = match && match.params && match.params.pathId

  const { data, loading, error } = useQuery(fetchLearningPathByIdAdmin, {
    variables: {
      id: pathId
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <Loading />

  if (error) {
    console.error(error)
    return <Redirect to='/error-page/500' />
  }

  if (data) {
    const { goalTemplate = [], organization, ...rawData } =
      data && data.fetchLearningPathByIdAdmin
    const pathData = {
      ...PathTemplateForm,
      ...rawData,
      goalTemplates: [...goalTemplate].map(
        ({ relatedSkills, content, ...template }) => ({
          ...template,
          relatedSkills: relatedSkills.map((skill, key) => ({
            key,
            value: [skill.category, skill._id]
          })),
          content: [...content]
            .map(({ content, note, order }, ix) => ({
              ...content,
              note,
              order: order || ix + 1
            }))
            .sort((a, b) => a.order - b.order)
        })
      ),
      organizationId: (organization && organization._id) || null
    }
    return <PathTemplateForm initialValues={pathData} />
  }
  return null
}

export default withRouter(PathTemplateEdit)
