import gql from 'graphql-tag'
import {
  Organization,
  LearningPath,
  Roles,
  ContentSource,
  FulfillmentRequest,
  Team,
  LearningContent
} from './_fragments'

// LOCAL
export const storeMutation = gql`
  mutation setStore($field: String!, $anotherField: String) {
    setStore(field: $field, anotherField: $anotherField) @client
  }
`

// REMOTE
export const loginMutation = gql`
  mutation login($UserCredentials: UserCredentials!) {
    publicLogin(input: $UserCredentials)
  }
`

// LEARNING CONTENT
export const addLearningContent = gql`
  mutation addLearningContent($learningContentData: LearningContentInput!) {
    addLearningContent(inputData: $learningContentData) {
      _id
      url
      type
      title
      author
      publishedDate
      price {
        currency
        value
      }
      relatedPrimarySkills {
        _id
        name
        skillLevel
        importance
      }
      relatedSecondarySkills {
        _id
        name
      }
      relatedInterests {
        _id
        name
      }
      relatedIndustries {
        _id
        name
      }
      relatedLineOfWork {
        _id
        name
      }
    }
  }
`

export const addLearningContentFile = gql`
  mutation addLearningContentFile($learningContentData: LearningContentInput!) {
    addLearningContentFile(inputData: $learningContentData) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const editLearningContent = gql`
  mutation editLearningContent(
    $learningContentData: LearningContentInput!
    $learningContentId: ID!
  ) {
    editLearningContent(
      inputData: $learningContentData
      learningContentId: $learningContentId
    ) {
      _id
      url
      type
      title
      author
      publishedDate
      price {
        currency
        value
      }
      relatedPrimarySkills {
        _id
        name
        skillLevel
        importance
      }
      relatedSecondarySkills {
        _id
        name
      }
      relatedInterests {
        _id
        name
      }
      relatedIndustries {
        _id
        name
      }
      relatedLineOfWork {
        _id
        name
      }
    }
  }
`

export const deleteLearningContent = gql`
  mutation deleteLearningContent($learningContentId: ID!) {
    deleteLearningContent(learningContentId: $learningContentId)
  }
`

export const deleteSpiderContent = gql`
  mutation deleteSpiderContent($spider: String!, $date: DateTime!) {
    deleteSpiderContent(spider: $spider, date: $date)
  }
`

// ORGANIZATIONS
export const addOrganization = gql`
  mutation addOrganization($OrganizationAddData: OrganizationAddData!) {
    addOrganization(inputData: $OrganizationAddData) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`

// ORGANIZATIONS
export const addDemoOrganization = gql`
  mutation addDemoOrganization($OrganizationAddData: OrganizationAddData!) {
    addDemoOrganization(inputData: $OrganizationAddData) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`

export const deleteOrganization = gql`
  mutation deleteOrganization($organizationId: ID!) {
    deleteOrganization(organizationId: $organizationId)
  }
`
export const editOrganization = gql`
  mutation editOrganization($OrganizationEditData: OrganizationEditData!) {
    editOrganization(inputData: $OrganizationEditData) {
      _id
      organizationName
    }
  }
`

export const resetDemoOrganization = gql`
  mutation resetDemoOrganization($organizationId: ID!) {
    resetDemoOrganization(organizationId: $organizationId)
  }
`

export const addNewEmployee = gql`
  mutation addNewEmployee(
    $OrganizationAddEmployeeData: OrganizationAddEmployeeData!
  ) {
    addNewEmployee(inputData: $OrganizationAddEmployeeData) {
      _id
      status
      email
      roles
      firstName
      lastName
    }
  }
`
export const addNewTeam = gql`
  mutation addNewTeam($OrganizationAddTeamData: OrganizationAddTeamData!) {
    addNewTeam(inputData: $OrganizationAddTeamData) {
      _id
      teamName
      slug
      leader {
        _id
        firstName
        lastName
        email
      }
      members {
        _id
        firstName
        lastName
        email
      }
      membersGetStageReport
    }
  }
`

// USER

export const deleteUserFromOrganization = gql`
  mutation deleteUserFromOrganization($userId: ID!, $organizationId: ID!) {
    deleteUserFromOrganization(userId: $userId, organizationId: $organizationId)
  }
`

// TEAM

export const addMember = gql`
  mutation addMember($MemberInput: MemberInput!) {
    addMember(inputdata: $MemberInput)
  }
`
export const deleteUserFromTeam = gql`
  mutation deleteUserFromTeam($userId: ID!, $teamId: ID!) {
    deleteUserFromTeam(userId: $userId, teamId: $teamId)
  }
`
export const archiveTeam = gql`
  mutation archiveTeam($teamId: ID!) {
    archiveTeam(teamId: $teamId)
  }
`
export const deleteTeam = gql`
  mutation deleteTeam($teamId: ID!) {
    deleteTeam(teamId: $teamId)
  }
`

export const changeTeamLeader = gql`
  mutation changeTeamLeader($MemberInput: MemberInput!) {
    changeTeamLeader(inputdata: $MemberInput)
  }
`

export const addTeamLearningContent = gql`
  mutation addTeamLearningContent($TeamContentInput: TeamContentInput!) {
    addTeamLearningContent(inputdata: $TeamContentInput)
  }
`

export const deleteTeamLearningContent = gql`
  mutation deleteTeamLearningContent($contentId: ID!) {
    deleteTeamLearningContent(contentId: $contentId)
  }
`

export const toggleMembersGetReport = gql`
  mutation toggleMembersGetReport($teamId: ID!) {
    toggleMembersGetReport(teamId: $teamId)
  }
`

export const createTeamStageAssessment = gql`
  mutation createTeamStageAssessment($teamId: ID!) {
    createTeamStageAssessment(teamId: $teamId)
  }
`
export const fetchFormsAndMakeResult = gql`
  mutation fetchFormsAndMakeResult($teamId: ID!) {
    fetchFormsAndMakeResult(teamId: $teamId)
  }
`

// TODO: Move below to user app later on
// INVITATION

export const publicAcceptInvitation = gql`
  mutation publicAcceptInvitation($email: String!) {
    publicAcceptInvitation(email: $email) {
      _id
      email
    }
  }
`

export const deleteUser = gql`
  mutation deleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`

export const addSkill = gql`
  mutation addSkill($skillData: SkillInput!) {
    addSkill(inputData: $skillData) {
      _id
      name
      slug
      category
      enabled
    }
  }
`

export const editSkill = gql`
  mutation editSkill($skillData: SkillEditInput!, $skillId: ID!) {
    editSkill(inputData: $skillData, skillId: $skillId) {
      _id
      name
      slug
      category
      enabled
    }
  }
`

export const disableSelectedSkills = gql`
  mutation disableSelectedSkills($skillIDs: [ID!]) {
    disableSelectedSkills(skillIDs: $skillIDs) {
      _id
      name
      slug
      category
      enabled
    }
  }
`

export const enableSelectedSkills = gql`
  mutation enableSelectedSkills($skillIDs: [ID!]) {
    enableSelectedSkills(skillIDs: $skillIDs) {
      _id
      name
      slug
      category
      enabled
    }
  }
`

export const addSkillForOrganization = gql`
  mutation addSkillForOrganization(
    $skillData: SkillInput!
    $organizationId: ID!
  ) {
    addSkillForOrganization(
      inputData: $skillData
      organizationId: $organizationId
    ) {
      _id
      name
      slug
      category
      enabled
    }
  }
`

export const disableSelectedSkillsForOrganization = gql`
  mutation disableSelectedSkillsForOrganization(
    $skillIDs: [ID!]
    $organizationId: ID!
  ) {
    disableSelectedSkillsForOrganization(
      skillIDs: $skillIDs
      organizationId: $organizationId
    )
  }
`

export const enableSelectedSkillsForOrganization = gql`
  mutation enableSelectedSkillsForOrganization(
    $skillIDs: [ID!]
    $organizationId: ID!
  ) {
    enableSelectedSkillsForOrganization(
      skillIDs: $skillIDs
      organizationId: $organizationId
    )
  }
`

export const disableNeededSkillsForOrganization = gql`
  mutation disableNeededSkillsForOrganization(
    $skills: [NeededSkillInput!]
    $organizationId: ID!
  ) {
    disableNeededSkillsForOrganization(
      skills: $skills
      organizationId: $organizationId
    ) {
      _id
      name
    }
  }
`

export const enableNeededSkillsForOrganization = gql`
  mutation enableNeededSkillsForOrganization(
    $skills: [NeededSkillInput!]
    $organizationId: ID!
  ) {
    enableNeededSkillsForOrganization(
      skills: $skills
      organizationId: $organizationId
    ) {
      _id
      name
    }
  }
`

export const deleteSkillFromOrganization = gql`
  mutation deleteSkillFromOrganization($skillId: ID!, $organizationId: ID!) {
    deleteSkillFromOrganization(
      skillId: $skillId
      organizationId: $organizationId
    )
  }
`
// CONTENT SOURCES

export const addContentSource = gql`
  mutation addContentSource($sourceData: ContentSourceInput!) {
    addContentSource(inputData: $sourceData) {
      ...ContentSourceData
    }
  }
  ${ContentSource.fragments.ContentSourceData}
`

export const editContentSource = gql`
  mutation editContentSource($sourceData: ContentSourceInput!, $sourceId: ID!) {
    editContentSource(inputData: $sourceData, sourceId: $sourceId) {
      ...ContentSourceData
    }
  }
  ${ContentSource.fragments.ContentSourceData}
`

export const disableSelectedSources = gql`
  mutation disableSelectedSources($sourceIDs: [ID!]) {
    disableSelectedSources(sourceIDs: $sourceIDs) {
      ...ContentSourceData
    }
  }
  ${ContentSource.fragments.ContentSourceData}
`

export const enableSelectedSources = gql`
  mutation enableSelectedSources($sourceIDs: [ID!]) {
    enableSelectedSources(sourceIDs: $sourceIDs) {
      ...ContentSourceData
    }
  }
  ${ContentSource.fragments.ContentSourceData}
`

export const deleteContentSource = gql`
  mutation deleteContentSource($sourceId: ID!) {
    deleteContentSource(sourceId: $sourceId)
  }
`

export const removeSkill = gql`
  mutation removeSkill($skillId: ID!) {
    removeSkill(skillId: $skillId)
  }
`

export const addSkillCategory = gql`
  mutation addSkillCategory($inputData: SkillCategoryInput!) {
    addSkillCategory(inputData: $inputData) {
      _id
      name
      slug
      createdAt
      updatedAt
      organizationSpecific
    }
  }
`

export const disableSelectedCategoriesForOrganization = gql`
  mutation disableSelectedCategoriesForOrganization(
    $categoryIDs: [ID!]
    $organizationId: ID!
  ) {
    disableSelectedCategoriesForOrganization(
      categoryIDs: $categoryIDs
      organizationId: $organizationId
    ) {
      _id
      name
      slug
      createdAt
      updatedAt
      organizationSpecific
      enabled
    }
  }
`

export const enableSelectedCategoriesForOrganization = gql`
  mutation enableSelectedCategoriesForOrganization(
    $categoryIDs: [ID!]
    $organizationId: ID!
  ) {
    enableSelectedCategoriesForOrganization(
      categoryIDs: $categoryIDs
      organizationId: $organizationId
    ) {
      _id
      name
      slug
      createdAt
      updatedAt
      organizationSpecific
      enabled
    }
  }
`

export const deleteCategoryFromOrganization = gql`
  mutation deleteCategoryFromOrganization(
    $categoryId: ID!
    $organizationId: ID!
  ) {
    deleteCategoryFromOrganization(
      categoryId: $categoryId
      organizationId: $organizationId
    )
  }
`

export const deleteCategory = gql`
  mutation deleteCategory($categoryId: ID!) {
    deleteCategory(categoryId: $categoryId)
  }
`

export const renameCategory = gql`
  mutation renameCategory($categoryId: ID!, $name: String!) {
    renameCategory(categoryId: $categoryId, name: $name) {
      _id
      name
      slug
      createdAt
      updatedAt
      organizationSpecific
    }
  }
`

export const setCustomCategoryForSkill = gql`
  mutation setCustomCategoryForSkill(
    $skillId: ID!
    $categoryId: ID!
    $organizationId: ID!
  ) {
    setCustomCategoryForSkill(
      skillId: $skillId
      categoryId: $categoryId
      organizationId: $organizationId
    ) {
      _id
      name
      slug
      category
      enabled
    }
  }
`

export const resetCustomCategoryForSkill = gql`
  mutation resetCustomCategoryForSkill($skillId: ID!, $organizationId: ID!) {
    resetCustomCategoryForSkill(
      skillId: $skillId
      organizationId: $organizationId
    ) {
      _id
      name
      slug
      category
      enabled
    }
  }
`

export const toggleWeeklyEmail = gql`
  mutation toggleWeeklyEmail($userId: String) {
    toggleWeeklyEmail(userId: $userId)
  }
`

export const sendTestEmail = gql`
  mutation sendTestEmail($email: String!) {
    sendTestEmail(email: $email)
  }
`

export const getUdemyCoursesForIDs = gql`
  mutation getUdemyCoursesForIDs($skillIds: [ID]!) {
    getUdemyCoursesForIDs(skillIds: $skillIds)
  }
`

export const initializeNeededSkills = gql`
  mutation initializeNeededSkills($organizationId: ID!) {
    initializeNeededSkills(organizationId: $organizationId)
  }
`

export const addFramework = gql`
  mutation addFramework($inputData: AddFrameworkInput!) {
    addFramework(inputData: $inputData)
  }
`

export const editFramework = gql`
  mutation editFramework($inputData: EditFrameworkInput!) {
    editFramework(inputData: $inputData)
  }
`

export const createRoleInOrganization = gql`
  mutation createRoleInOrganization($roleData: CreateRoleInput!) {
    createRoleInOrganization(roleData: $roleData) {
      ...RoleData
    }
  }
  ${Roles.fragments.RoleData}
`

export const deleteRole = gql`
  mutation deleteRole($roleId: String!) {
    deleteRole(roleId: $roleId)
  }
`

export const deleteFramework = gql`
  mutation deleteFramework($frameworkId: ID!) {
    deleteFramework(frameworkId: $frameworkId)
  }
`

export const addFrameworkForOrganization = gql`
  mutation addFrameworkForOrganization(
    $inputData: AddFrameworkInput!
    $organizationId: ID!
  ) {
    addFrameworkForOrganization(
      inputData: $inputData
      organizationId: $organizationId
    )
  }
`

export const toggleOrganizationIsPaying = gql`
  mutation toggleOrganizationIsPaying($value: Boolean!, $organizationId: ID!) {
    toggleOrganizationIsPaying(value: $value, organizationId: $organizationId) {
      _id
      organizationName
      admins
      slug
      isPayingOrganization
      isDemoOrganization
      size
      locations
      industry
      employees {
        _id
        status
        email
        roles
        firstName
        lastName
      }
      teams {
        _id
        teamName
        slug
        leader {
          _id
          firstName
          lastName
          email
        }
        members {
          _id
          firstName
          lastName
          email
        }
        membersGetStageReport
      }
      neededSkillsEnabled
      disabledNeededSkills {
        _id
        name
      }
    }
  }
`

export const cleanupDeadContent = gql`
  mutation cleanupDeadContent($source: ID!) {
    cleanupDeadContent(source: $source)
  }
`

// PATH TEMPLATES
export const deleteOrganizationLearningPathByAdmin = gql`
  mutation deleteOrganizationLearningPathByAdmin($id: ID!) {
    deleteOrganizationLearningPathByAdmin(id: $id) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`
export const createLearningPath = gql`
  mutation createLearningPathAdmin($input: LearningPathInput!) {
    createLearningPathAdmin(input: $input) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const duplicateLearningPath = gql`
  mutation duplicateLearningPathAdmin($id: ID!) {
    duplicateLearningPathAdmin(id: $id) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const updateLearningPath = gql`
  mutation updateLearningPathAdmin(
    $input: LearningPathInput!
    $updateExisting: Boolean
  ) {
    updateLearningPathAdmin(input: $input, updateExisting: $updateExisting) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const changeLearningPathsStatus = gql`
  mutation changeLearningPathsStatus($pathIds: [ID!], $value: Boolean!) {
    changeLearningPathsStatus(pathIds: $pathIds, value: $value) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const activateOrganization = gql`
  mutation activateOrganization($organizationId: ID!) {
    activateOrganization(organizationId: $organizationId) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`

export const setOrganizationPremium = gql`
  mutation setOrganizationPremium($value: Boolean!, $organizationId: ID!) {
    setOrganizationPremium(value: $value, organizationId: $organizationId) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`

export const toggleOrganizationIsCorporate = gql`
  mutation toggleOrganizationIsCorporate(
    $corporate: Boolean!
    $organizationId: ID!
  ) {
    toggleOrganizationIsCorporate(
      corporate: $corporate
      organizationId: $organizationId
    ) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`

export const makeNotMandatoryForOrganization = gql`
  mutation makeNotMandatoryForOrganization(
    $skills: [NeededSkillInput!]
    $organizationId: ID!
  ) {
    makeNotMandatoryForOrganization(
      skills: $skills
      organizationId: $organizationId
    )
  }
`

export const makeMandatoryForOrganization = gql`
  mutation makeMandatoryForOrganization(
    $skills: [NeededSkillInput!]
    $organizationId: ID!
  ) {
    makeMandatoryForOrganization(
      skills: $skills
      organizationId: $organizationId
    )
  }
`

export const toggleOrganizationFulfillment = gql`
  mutation toggleOrganizationFulfillment(
    $fulfillment: Boolean!
    $organizationId: ID!
  ) {
    toggleOrganizationFulfillment(
      fulfillment: $fulfillment
      organizationId: $organizationId
    ) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`

export const fetchLearningContentIDBySource = gql`
  mutation fetchLearningContentIDBySource($url: String!) {
    fetchLearningContentIDBySource(url: $url)
  }
`

export const generateCredentialsForLearning = gql`
  mutation generateCredentialsForLearning($user: ID!) {
    generateCredentialsForLearning(user: $user) {
      _id
      email
      password
    }
  }
`

export const completeFulfillmentRequest = gql`
  mutation completeFulfillmentRequest($requestId: ID!, $note: String) {
    completeFulfillmentRequest(requestId: $requestId, note: $note) {
      ...FulfillmentRequestData
    }
  }
  ${FulfillmentRequest.fragments.FulfillmentRequestData}
`

export const setTeamRecommendedLearningPaths = gql`
  mutation setTeamRecommendedLearningPaths(
    $recommendedPaths: [ID]
    $teamId: ID!
  ) {
    setTeamRecommendedLearningPaths(
      recommendedPaths: $recommendedPaths
      teamId: $teamId
    ) {
      ...TeamBasicData
    }
  }
  ${Team.fragments.TeamBasicData}
`

export const transformLearningPathToGoalsAdmin = gql`
  mutation transformLearningPathToGoalsAdmin($id: ID!, $targetUser: ID!) {
    transformLearningPathToGoalsAdmin(id: $id, targetUser: $targetUser) {
      _id
    }
  }
`

export const toggleOrganizationTechnicians = gql`
  mutation toggleOrganizationTechnicians(
    $technicians: Boolean!
    $organizationId: ID!
  ) {
    toggleOrganizationTechnicians(
      technicians: $technicians
      organizationId: $organizationId
    ) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`

export const toggleOrganizationEvents = gql`
  mutation toggleOrganizationEvents($events: Boolean!, $organizationId: ID!) {
    toggleOrganizationEvents(events: $events, organizationId: $organizationId) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`
