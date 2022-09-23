import { ReviewTemplate, Team, Organization } from '~/models'
;(async () => {
  const allDemoTemplates = await ReviewTemplate.find({
    name: 'Quarterly IT Review'
  })
  await Promise.all(
    allDemoTemplates.map(async rt => {
      const org = await Organization.findById(rt.organizationId)
      if (!org || !org.isDemoOrganization) return
      if (rt.specificScopes.length === 0) {
        const itTeam = await Team.findOne({ organizationId: rt.organizationId })
        if (itTeam) {
          await ReviewTemplate.findOneAndUpdate(
            { _id: rt._id },
            {
              $set: {
                specificScopes: [itTeam._id]
              }
            }
          )
        }
      }
    })
  )
})()
