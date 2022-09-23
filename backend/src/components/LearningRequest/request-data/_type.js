import { LearningContent, User, Goal } from '../../../models'
import { appUrls } from '../../../utils'

export const types = `
  type Request {
    _id: ID!
    content: LearningContent!
    user: Employees!
    goal: Goal
    approved: Boolean
    note: String
    reviewedBy: Employees
    createdAt: DateTime
    reviewedAt: DateTime
    requestURL: URL
  }
`

export const typeResolvers = {
  Request: {
    content: async ({ contentId }) => LearningContent.findById(contentId),
    user: async ({ user }) => User.findById(user),
    goal: async ({ goalId }) => Goal.findById(goalId),
    reviewedBy: async ({ reviewedBy }) => User.findById(reviewedBy),
    requestURL: ({ _id, user }) =>
      `${appUrls['user']}/user-requests/${user}?highlight=${_id}`
  }
}
