import React, { useState } from 'react'
import RolesCreate from './RolesCreate'
import RolesDisplay from './RolesDisplay'

export default ({ specificOrganizationId = null }) => {
  let [editedRole, setEditedRole] = useState(null)

  return (
    <React.Fragment>
      <RolesCreate
        editedRole={editedRole}
        specificOrganizationId={specificOrganizationId}
      />
      <RolesDisplay
        setEditedRole={setEditedRole}
        specificOrganizationId={specificOrganizationId}
      />
    </React.Fragment>
  )
}
