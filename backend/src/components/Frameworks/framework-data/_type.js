export const types = `
  type LevelTexts {
    _id: ID!
    level1Text: String!
    level2Text: String!
    level3Text: String!
    level4Text: String!
    level5Text: String!
  }

  type Framework {
    _id: ID!
    levelTexts: LevelTexts
    orgFramework: ID
  }
`

export const typeResolvers = {
  Framework: {
    levelTexts: async ({
      _id,
      level1Text,
      level2Text,
      level3Text,
      level4Text,
      level5Text
    }) => {
      return {
        _id,
        level1Text,
        level2Text,
        level3Text,
        level4Text,
        level5Text
      }
    }
  }
}
