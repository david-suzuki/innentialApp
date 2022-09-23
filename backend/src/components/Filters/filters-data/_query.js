import { isUser } from '~/directives'

export const queryTypes = `
  type Query {
    fetchFiltersForArgs(
      neededSkills: [SkillsInput]!,
      extraSkills: [SkillsInput], 
      user: ID, 
      filters: FilterInput,
      search: String,
      inDPSetting: Boolean
    ): Filters @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchFiltersForArgs: async (
      _,
      { neededSkills, user, filters, search, inDPSetting, extraSkills },
      { user: { _id: currentUser, organizationId }, dataSources }
    ) => {
      return dataSources.Filters.getFiltersForUser({
        user: user || currentUser,
        neededSkills,
        extraSkills,
        search,
        inDPSetting,
        organizationId,
        filters
      })
    }
  }
}
