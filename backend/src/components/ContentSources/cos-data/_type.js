import { getDownloadLink } from '~/utils'

export const types = `
  type ContentSource {
    _id: ID
    name: String
    baseUrls: [String]
    slug: String
    enabled: Boolean
    affiliate: Boolean
    createdAt: DateTime
    updatedAt: DateTime
    iconSource: String
    certText: String
    subscription: Boolean
    tags: [String!]
    accountRequired : Boolean
  }
`

export const typeResolvers = {
  ContentSource: {
    iconSource: ({ _id }) => {
      return getDownloadLink({ _id, expires: 500 * 60, key: 'sources/icons' })
    }
  }
}
