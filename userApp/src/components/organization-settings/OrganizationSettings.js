import React from 'react'
import { List } from '../ui-components'
import { Tabs, TabsList, Tab, TabContent } from '../ui-components/Tabs'
import organizationSettingsStyle from '../../styles/organizationSettingsStyle'
import {
  ManageOrganizationPermissions,
  FrameworkSettings,
  ManageOrganizationLocations
} from '../organization-settings'

export default ({
  organizationData: {
    locations,
    feedbackVisible,
    approvals,
    teamLeadApprovals
  },
  premium
}) => {
  return (
    <div>
      <List overflow>
        <Tabs className='subtabs'>
          <TabsList>
            <Tab>Permissions</Tab>
            {/* <Tab>Locations</Tab> */}
            {premium && <Tab>Experience guidelines</Tab>}
            {/* <Tab>Messages</Tab> */}
          </TabsList>
          <TabContent>
            <ManageOrganizationPermissions
              feedbackVisible={feedbackVisible}
              premium={premium}
              approvals={approvals}
              teamLeadApprovals={teamLeadApprovals}
            />
          </TabContent>
          {/* <TabContent>
            <ManageOrganizationLocations locations={locations} />
          </TabContent> */}
          {premium && (
            <TabContent>
              <FrameworkSettings />
            </TabContent>
          )}
        </Tabs>
      </List>
      <style jsx>{organizationSettingsStyle}</style>
    </div>
  )
}
