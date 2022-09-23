import { Types } from 'mongoose'
import {
  GoalTemplate,
  LearningPathTemplate,
  Organization
} from '../../../../models'

const createLearningPaths = async (slug, organizationId) => {
  if (slug !== 'default_company_account') {
    // Here we get the demo learning paths from this organization
    const defaultOrg = await Organization.findOne({
      slug: 'default_company_account'
    }).lean()
    // We check if the organization exists before we proceed
    if (defaultOrg) {
      // If it does we get the paths in it, all paths are required demo paths
      const defaultLearningPaths = await LearningPathTemplate.find({
        organization: defaultOrg._id
      }).lean()
      if (defaultLearningPaths) {
        // if there are paths in the default company account we go on and copy them
        const newPaths = await Promise.all(
          defaultLearningPaths.map(async defaultLearningPath => {
            const goalTemplateIds = await Promise.all(
              defaultLearningPath.goalTemplate.map(async templateId => {
                const goal = await GoalTemplate.findById(templateId)
                  .select({ _id: 0 })
                  .lean()

                const goalObj = await GoalTemplate.create({
                  ...goal,
                  createdAt: new Date(),
                  updatedAt: new Date()
                })

                return goalObj._id
              })
            )
            // await goalTemplateIds
            return {
              ...defaultLearningPath,
              _id: new Types.ObjectId(),
              organization: organizationId,
              goalTemplate: goalTemplateIds,
              team: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              author: null,
              setByUser: null
            }
          })
        )
        // await newPaths
        return LearningPathTemplate.create(newPaths)
      }
    }
  }
}

export default createLearningPaths
