import React from 'react'
import { Checkbox, Notification } from 'element-react'
import { captureFilteredError } from '../general'
import {
  setFeedbackVisibility,
  fetchCurrentUserOrganization,
  fetchUserPeerFeedback,
  toggleApprovalsForOrganization,
  toggleApprovalsForTeamLead
} from '../../api'
import { useMutation } from 'react-apollo'

export default ({ feedbackVisible, approvals, teamLeadApprovals, premium }) => {
  const [mutation] = useMutation(setFeedbackVisibility, {
    update: (proxy, { data: { setFeedbackVisibility: visible } }) => {
      try {
        const { fetchCurrentUserOrganization: organization } = proxy.readQuery({
          query: fetchCurrentUserOrganization
        })
        proxy.writeQuery({
          query: fetchCurrentUserOrganization,
          data: {
            fetchCurrentUserOrganization: {
              ...organization,
              feedbackVisible: visible
            }
          }
        })
      } catch (err) {
        captureFilteredError(err)
      }
    },
    refetchQueries: [{ query: fetchUserPeerFeedback, variables: {} }]
  })

  const [toggleApproval] = useMutation(toggleApprovalsForOrganization)
  const [toggleTeamLeadApproval] = useMutation(toggleApprovalsForTeamLead)

  return (
    <>
      <div className='align-left' style={{ padding: '20px' }}>
        <Checkbox
          checked={approvals}
          onChange={async value => {
            try {
              await toggleApproval({
                variables: {
                  approvals: value
                }
              })
              Notification({
                message: 'Successfully changed permissions',
                duration: 2500,
                offset: 90,
                type: 'success'
              })
            } catch (e) {
              captureFilteredError(e)
            }
          }}
        >
          Turn on learning approvals
        </Checkbox>
      </div>
      <div className='align-left' style={{ padding: '20px' }}>
        <Checkbox
          disabled={!approvals}
          checked={approvals && teamLeadApprovals}
          onChange={async value => {
            try {
              await toggleTeamLeadApproval({
                variables: {
                  teamLeadApprovals: value
                }
              })
              Notification({
                message: 'Successfully changed permissions',
                duration: 2500,
                offset: 90,
                type: 'success'
              })
            } catch (e) {
              captureFilteredError(e)
            }
          }}
        >
          Team leaders can approve their teams' content
        </Checkbox>
      </div>
      {premium && (
        <div className='align-left' style={{ padding: '20px' }}>
          <Checkbox
            checked={feedbackVisible}
            onChange={async value => {
              try {
                await mutation({
                  variables: {
                    visible: value
                  }
                })
                Notification({
                  message: 'Successfully changed permissions',
                  duration: 2500,
                  offset: 90,
                  type: 'success'
                })
              } catch (e) {
                captureFilteredError(e)
              }
            }}
          >
            Employees can see who gave them feedback
          </Checkbox>
        </div>
      )}
    </>
  )
}
