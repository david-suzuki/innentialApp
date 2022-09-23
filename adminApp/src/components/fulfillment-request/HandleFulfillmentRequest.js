import React from 'react'
import { FulfillmentRequestForm } from './'
import { useQuery } from 'react-apollo'
import { Loading } from 'element-react'
import { fetchFulfillmentRequest } from '../../api'
import { withRouter, Redirect } from 'react-router-dom'

const HandleFulfillmentRequest = ({ match, history }) => {
  const requestId = match && match.params && match.params.requestId

  const { data, loading, error } = useQuery(fetchFulfillmentRequest, {
    variables: {
      requestId
    }
  })

  if (loading) return <Loading />

  if (error) {
    console.error(error)
    return <Redirect to='/error-page/500' />
  }

  if (data) {
    const request = data && data.fetchFulfillmentRequest

    if (!request) {
      console.error(`Request not found`)
      return <Redirect to='/error-page/404' />
    }

    return <FulfillmentRequestForm request={request} history={history} />
  }
  return null
}

export default withRouter(HandleFulfillmentRequest)
