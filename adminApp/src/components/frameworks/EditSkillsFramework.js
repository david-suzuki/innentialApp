import React from 'react'
import SkillsFrameworkForm from './SkillsFrameworkForm'
import { Query } from 'react-apollo'
import { Loading } from 'element-react'
import { fetchFrameworkEditInfo } from '../../api'
import { withRouter } from 'react-router-dom'

const FrameworkEdit = ({ match, history }) => {
  const frameworkId = match && match.params && match.params.frameworkId
  return (
    <div>
      <Query query={fetchFrameworkEditInfo} variables={{ frameworkId }}>
        {({ loading, data, error }) => {
          if (loading) return <Loading />
          if (error) return <p>Error! {error.message}</p>

          const frameworkData = data && data.fetchFrameworkEditInfo
          return (
            <SkillsFrameworkForm
              frameworkId={frameworkId}
              initialValues={frameworkData}
              goBack={history.goBack}
              canDelete
            />
          )
        }}
      </Query>
    </div>
  )
}

export default withRouter(FrameworkEdit)
