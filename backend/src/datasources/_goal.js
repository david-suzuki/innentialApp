import MongoDataSourceClass from './_mongo-datasource-class'
import { Goal, LearningPathTemplate } from '~/models'

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }

  async getNextGoalInPath(pathId, user) {
    if (!pathId) throw new Error(`Insufficient arguments provided`)

    const lp = await LearningPathTemplate.findOne({
      _id: pathId
    })
      .select({ goalTemplate: 1 })
      .lean()

    if (lp) {
      const goalsInPath = await this.model.find({
        user,
        status: 'ACTIVE',
        fromTemplate: { $in: lp.goalTemplate }
      })
      if (goalsInPath.length > 0) return goalsInPath[0]._id
    }
    return null
  }

  async fetchNextGoalId(goal) {
    if (!goal) throw new Error(`Insufficient arguments provided`)
    const { user, fromTemplate } = goal

    if (fromTemplate) {
      const lp = await LearningPathTemplate.findOne({
        goalTemplate: fromTemplate
      })
        .select({ goalTemplate: 1 })
        .lean()
      if (lp) {
        const ix = lp.goalTemplate.findIndex(
          templateId => String(fromTemplate) === String(templateId)
        )
        const templateId = lp.goalTemplate[ix + 1]
        if (templateId) {
          const nextGoal = await this.model.findOne({
            fromTemplate: templateId,
            user,
            status: 'ACTIVE'
          })
          if (nextGoal) {
            return nextGoal._id
          }
        }
        const otherGoalsInPath = await this.model.find({
          user,
          status: 'ACTIVE',
          fromTemplate: { $in: lp.goalTemplate }
        })
        if (otherGoalsInPath.length > 0) return otherGoalsInPath[0]._id
      }
    }

    const nextGoal = await this.model
      .findOne({ user, status: 'ACTIVE' })
      .select({ _id: 1 })
      .lean()

    return nextGoal ? nextGoal._id : null
  }

  // writes
})(Goal)
