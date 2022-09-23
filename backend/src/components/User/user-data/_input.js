export default `
  input UserProfileSkillsInput {
    category: String,
    level: Int,
    name: String,
    slug: String, 
    _id: String
  }
  input UserProfileInterestsInput {
    name: String, 
    slug: String,
    _id: String
  }
  input UserProfileRelatedLineOfWorkInput {
    name: String,
    _id: String
  }
  input UserProfileInput {
    user: String
    relatedLineOfWork: UserProfileRelatedLineOfWorkInput
    roleAtWork: String
    roleId: ID
    suggestRole: Boolean
    neededWorkSkills: [UserProfileSkillsInput]
    selectedWorkSkills: [UserProfileSkillsInput]
    selectedInterests: [UserProfileInterestsInput]
  }

  input UserOnboardingPersonalInfo {
    firstName: String
    lastName: String
    roleAtWork: String
    roleId: ID
    technician: Boolean
  }

  input UserOnboardingDevelopmentPlan {
    neededWorkSkills: [SelectedSkillInput]
    selectedWorkSkills: [SelectedSkillInput]
    developmentPlan: [DPContentInput]
  }

  input UserProfileEditInput {
    user: ID!
    firstName: String
    lastName: String
    roleAtWork: String
    roleId: ID
    selectedWorkSkills: [UserProfileSkillsInput]
  }

  input UserProfileSkillsChangeInput {
    key: String
    skills: [UserProfileSkillsInput]
  }

  input UserProfilePositionChangeInput {
    roleAtWork: String
    roleId: ID
    relatedLineOfWork: UserProfileRelatedLineOfWorkInput
  }

  input UserProfileGrowthChangeInput {
    selectedInterests: [UserProfileInterestsInput]
    neededWorkSkills: [UserProfileSkillsInput]
  }

  input UserProfilePasswordChangeInput {
    oldPassword: String
    newPassword: String
  }

  input RegistrationMetaInput {
    registeredFrom: String
    withPath: ID
    subscribe: Boolean
  }
`
