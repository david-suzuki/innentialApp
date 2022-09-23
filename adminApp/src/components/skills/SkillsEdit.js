import React from 'react'
import SkillsForm from './SkillsForm'
import { Query } from 'react-apollo'
import { Loading } from 'element-react'
import { fetchSkillEditForm } from '../../api'
import { withRouter } from 'react-router-dom'

const SkillsEdit = ({ match, history }) => {
  const skillId = match && match.params && match.params.skillId
  return (
    <div>
      <Query query={fetchSkillEditForm} variables={{ skillId }}>
        {({ loading, data, error }) => {
          if (loading) return <Loading />
          if (error) return <p>Error!</p>

          const skillData = data && data.fetchSkillEditForm
          return (
            <SkillsForm
              skillId={skillId}
              initialValues={skillData}
              goBack={history.goBack}
            />
          )
        }}
      </Query>
    </div>
  )
}

export default withRouter(SkillsEdit)
