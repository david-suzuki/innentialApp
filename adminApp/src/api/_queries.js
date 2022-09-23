import gql from 'graphql-tag'
import {
  Organization,
  LearningPath,
  Goal,
  Stats,
  LearningContent,
  Roles,
  ContentSource,
  Team,
  User,
  FulfillmentRequest
} from './_fragments'

// LOCAL
export const storeQuery = gql`
  query store {
    store @client {
      field
      anotherField
    }
  }
`

// REMOTE
export const connectionQuery = gql`
  query connection {
    connection
  }
`

export const authQuery = gql`
  query authenticate {
    checkAuth
  }
`

export const fetchApiUrl = gql`
  query fetchApiUrl {
    fetchApiUrl
  }
`

// LEARNING CONTENT
export const fetchAllLearningContent = gql`
  query fetchAllLearningContent(
    $filter: String
    $source: ID
    $limit: Int
    $offset: Int
  ) {
    fetchAllLearningContent(
      filter: $filter
      source: $source
      limit: $limit
      offset: $offset
    ) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchAllRatedLearningContent = gql`
  query fetchAllRatedLearningContent($limit: Int) {
    fetchAllRatedLearningContent(limit: $limit) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchLearningContentRating = gql`
  query fetchLearningContentRating(
    $learningContentId: ID!
    $organizationId: ID
  ) {
    fetchLearningContentRating(
      learningContentId: $learningContentId
      organizationId: $organizationId
    ) {
      ...LearningContentRatingData
    }
  }
  ${LearningContent.fragments.LearningContentRatingData}
`

export const fetchLearningContent = gql`
  query fetchLearningContent($learningContentId: ID) {
    fetchLearningContent(learningContentId: $learningContentId) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchLearningContentEditForm = gql`
  query fetchLearningContentEditForm($learningContentId: ID!) {
    fetchLearningContentEditForm(learningContentId: $learningContentId) {
      ...LearningContentEditData
    }
  }
  ${LearningContent.fragments.LearningContentEditData}
`

export const fetchRelevantLearningContent = gql`
  query fetchRelevantLearningContent(
    $selectedSkills: [SelectedSkillInput!]!
    $neededSkills: [SkillsInput]
    $selectedLineOfWork: RelatedLineOfWorkInput
    $selectedInterests: [RelatedInterestInput]
    $selectedIndustry: RelatedIndustryInput
    $filter: String
    $source: ID
  ) {
    fetchRelevantLearningContent(
      selectedSkills: $selectedSkills
      neededSkills: $neededSkills
      selectedLineOfWork: $selectedLineOfWork
      selectedInterests: $selectedInterests
      selectedIndustry: $selectedIndustry
      filter: $filter
      source: $source
    ) {
      _id
      url
      source {
        _id
        name
        slug
        baseUrls
        createdAt
        updatedAt
      }
      type
      title
      author
      price {
        currency
        value
        _id
      }
      relatedPrimarySkills {
        name
        skillLevel
        importance
        _id
      }
      relatedSecondarySkills {
        name
        _id
      }
      relatedInterests {
        name
        _id
      }
      relatedIndustries {
        name
        _id
      }
      relatedLineOfWork {
        name
        _id
      }
      relevanceRating
      publishedDate
      createdAt
      spider
    }
  }
`

// SKILLS
export const fetchAllSkills = gql`
  query fetchAllSkills {
    fetchAllSkills {
      _id
      name
      slug
      category
      createdAt
      updatedAt
      enabled
      organizationSpecific
      frameworkId
    }
  }
`

export const fetchOrganizationSkillsForAdmin = gql`
  query fetchOrganizationSkillsForAdmin($organizationId: ID!) {
    fetchOrganizationSkillsForAdmin(organizationId: $organizationId) {
      _id
      name
      slug
      category
      createdAt
      enabled
      mandatory
      organizationSpecific
      useCustomCategory
      orgFrameworkId
    }
  }
`

export const fetchRegularSkills = gql`
  query fetchRegularSkills {
    fetchRegularSkills {
      _id
      name
      slug
      category
    }
  }
`

export const fetchSkillEditForm = gql`
  query fetchSkillEditForm($skillId: ID!) {
    fetchSkillEditForm(skillId: $skillId) {
      name
      category
    }
  }
`

// INTERESTS
export const fetchAllInterests = gql`
  query fetchAllInterests {
    fetchAllInterests {
      _id
      name
      slug
    }
  }
`

// INDUSTRIES
export const fetchAllIndustries = gql`
  query fetchAllIndustries {
    fetchAllIndustries {
      _id
      name
      slug
    }
  }
`

// LINES OF WORKS
export const fetchAllLinesOfWork = gql`
  query fetchAllLinesOfWork {
    fetchAllLinesOfWork {
      _id
      name
      slug
    }
  }
`

// ORGANIZATIONS

// TODO: In ordder to use slug and not break cache write, generate slug on the fly before sending it to the server
export const fetchAllOrganizations = gql`
  query fetchAllOrganizations(
    $limit: Int
    $offset: Int
    $displayPaid: Boolean
  ) {
    fetchAllOrganizations(
      limit: $limit
      offset: $offset
      displayPaid: $displayPaid
    ) {
      ...OrganizationBasicData
    }
  }
  ${Organization.fragments.OrganizationBasicData}
`

export const fetchAllOrganizationsReduced = gql`
  query fetchAllOrganizationsReduced(
    $limit: Int
    $offset: Int
    $displayPaid: Boolean
  ) {
    fetchAllOrganizations(
      limit: $limit
      offset: $offset
      displayPaid: $displayPaid
    ) {
      _id
      organizationName
      employees {
        _id
      }
    }
  }
`

export const fetchOrganizationsListLength = gql`
  query fetchOrganizationsListLength($displayPaid: Boolean) {
    fetchOrganizationsListLength(displayPaid: $displayPaid)
  }
`

export const fetchOrganization = gql`
  query fetchOrganization($organizationId: ID!) {
    fetchOrganization(organizationId: $organizationId) {
      ...OrganizationBasicData
      employees {
        ...EmployeeBasicData
      }
      teams {
        ...TeamBasicData
      }
    }
  }
  ${Organization.fragments.OrganizationBasicData}
  ${Team.fragments.TeamBasicData}
  ${User.fragments.EmployeeBasicData}
`

// USERS

export const fetchAllUsers = gql`
  query fetchAllUsers($filter: String, $limit: Int, $offset: Int) {
    fetchAllUsers(filter: $filter, limit: $limit, offset: $offset) {
      _id
      firstName
      lastName
      email
      organizationName
      leader
      roles
      status
    }
  }
`
export const fetchUsersListLength = gql`
  query fetchUsersListLength {
    fetchUsersListLength
  }
`
export const fetchUser = gql`
  query fetchUser($userId: ID!) {
    fetchUser(userId: $userId) {
      _id
      firstName
      lastName
      email
      organizationName
      leader
      roles
      status
      isReceivingContentEmails
      profile {
        user
        relatedLineOfWork {
          name
          _id
        }
        roleAtWork
        neededWorkSkills {
          category
          level
          name
          slug
          skillId
          _id
        }
        selectedWorkSkills {
          category
          level
          name
          slug
          skillId
          _id
        }
        selectedInterests {
          name
          slug
          _id
        }
      }
    }
  }
`

export const fetchMembersCompleted = gql`
  query fetchMembersCompleted($teamId: ID!) {
    fetchMembersCompleted(teamId: $teamId) {
      open
      emails
      participants
    }
  }
`

export const fetchAllStageResults = gql`
  query fetchAllStageResults($teamId: ID!) {
    fetchAllStageResults(teamId: $teamId) {
      _id
      engagement
      stage
      startDate
      endDate
      keyPerformance {
        _id
        goalsManagement
        independence
        rolesClarity
        structure
        leadership
        comsAndFeedback
        planningAndDecisionMaking
        followUps
        acceptanceAndNorms
        cooperation
      }
      comments
      membersParticipated
    }
  }
`

export const fetchToolsForReport = gql`
  query fetchToolsForReport($assessmentId: ID!) {
    fetchToolsForReport(assessmentId: $assessmentId)
  }
`

export const fetchTeamLearningContent = gql`
  query fetchTeamLearningContent {
    fetchTeamLearningContent {
      _id
      title
      pdfSource
      author
      relatedPerformanceArea
      createdAt
    }
  }
`

// TODO: Move below to user app later on
// INVITATION

export const publicFetchInvitation = gql`
  query publicFetchInvitation($pendingInvitation: ID!) {
    publicFetchInvitation(pendingInvitation: $pendingInvitation) {
      _id
      email
    }
  }
`

// CONTENT SOURCES

export const fetchSourcesListLength = gql`
  query fetchSourcesListLength {
    fetchSourcesListLength
  }
`

export const fetchAmountOfContentForSource = gql`
  query fetchAmountOfContentForSource($source: ID!) {
    fetchAmountOfContentForSource(source: $source)
  }
`

export const fetchAllContentSources = gql`
  query fetchAllContentSources($limit: Int, $offset: Int) {
    fetchAllContentSources(limit: $limit, offset: $offset) {
      ...ContentSourceData
    }
  }
  ${ContentSource.fragments.ContentSourceData}
`

export const fetchSourceEditForm = gql`
  query fetchSourceEditForm($sourceId: ID!) {
    fetchSourceEditForm(sourceId: $sourceId) {
      ...ContentSourceData
    }
  }
  ${ContentSource.fragments.ContentSourceData}
`

export const fetchIconUploadLink = gql`
  query fetchIconUploadLink($contentType: String, $sourceId: ID!) {
    fetchIconUploadLink(contentType: $contentType, sourceId: $sourceId)
  }
`

export const fetchBannerUploadLink = gql`
  query fetchBannerUploadLink($contentType: String, $pathId: ID!) {
    fetchBannerUploadLink(contentType: $contentType, pathId: $pathId)
  }
`

export const fetchThumbnailUploadLink = gql`
  query fetchThumbnailUploadLink($contentType: String, $contentId: ID!) {
    fetchThumbnailUploadLink(contentType: $contentType, contentId: $contentId)
  }
`

export const fetchAuthorImageUploadLink = gql`
  query fetchAuthorImageUploadLink($contentType: String, $pathId: ID!) {
    fetchAuthorImageUploadLink(contentType: $contentType, pathId: $pathId)
  }
`

export const fetchAuthorCompanyLogoUploadLink = gql`
  query fetchAuthorCompanyLogoUploadLink($contentType: String, $pathId: ID!) {
    fetchAuthorCompanyLogoUploadLink(contentType: $contentType, pathId: $pathId)
  }
`

export const fetchLearningContentListLength = gql`
  query fetchLearningContentListLength($filter: String, $source: ID) {
    fetchLearningContentListLength(filter: $filter, source: $source)
  }
`

export const fetchRatedLearningContentListLength = gql`
  query fetchRatedLearningContentListLength {
    fetchRatedLearningContentListLength
  }
`

export const fetchOrganizationSpecificContent = gql`
  query fetchOrganizationSpecificContent(
    $organizationId: ID!
    $filter: String
    $source: ID
    $limit: Int
    $offset: Int
  ) {
    fetchOrganizationSpecificContent(
      organizationId: $organizationId
      filter: $filter
      source: $source
      limit: $limit
      offset: $offset
    ) {
      _id
      url
      source {
        _id
        name
        slug
        baseUrls
        createdAt
        updatedAt
      }
      type
      title
      author
      organizationSpecific
      price {
        currency
        value
        _id
      }
      relatedPrimarySkills {
        name
        skillLevel
        importance
        _id
      }
      relatedSecondarySkills {
        name
        _id
      }
      relatedInterests {
        name
        _id
      }
      relatedIndustries {
        name
        _id
      }
      relatedLineOfWork {
        name
        _id
      }
      publishedDate
      createdAt
      spider
    }
  }
`

export const fetchOrganizationContentListLength = gql`
  query fetchOrganizationContentListLength(
    $organizationId: ID!
    $filter: String
    $source: ID
  ) {
    fetchOrganizationContentListLength(
      organizationId: $organizationId
      filter: $filter
      source: $source
    )
  }
`

export const fetchAmountOfContentForSkill = gql`
  query fetchAmountOfContentForSkill($skillId: ID!) {
    fetchAmountOfContentForSkill(skillId: $skillId)
  }
`

export const fetchSkillDeleteInfo = gql`
  query fetchSkillDeleteInfo($skillId: ID!) {
    fetchSkillDeleteInfo(skillId: $skillId)
  }
`

export const fetchSkillStats = gql`
  query fetchSkillStats {
    fetchSkillStats {
      _id
      name
      count
      articles
      books
      eLearning
      tools
      newContent
    }
  }
`

export const fetchAllSkillCategories = gql`
  query fetchAllSkillCategories {
    fetchAllSkillCategories {
      _id
      name
      slug
      organizationSpecific
      createdAt
      updatedAt
      frameworkId
    }
  }
`

export const fetchRegularSkillCategories = gql`
  query fetchRegularSkillCategories {
    fetchRegularSkillCategories {
      _id
      name
      slug
      organizationSpecific
      createdAt
      updatedAt
      frameworkId
    }
  }
`

export const fetchSkillCategoriesForOrganization = gql`
  query fetchSkillCategoriesForOrganization($organizationId: ID!) {
    fetchSkillCategoriesForOrganization(organizationId: $organizationId) {
      _id
      name
      slug
      organizationSpecific
      createdAt
      updatedAt
      enabled
      orgFrameworkId
    }
  }
`

export const fetchCategoryDuplicateInfo = gql`
  query fetchCategoryDuplicateInfo($name: String) {
    fetchCategoryDuplicateInfo(name: $name)
  }
`

export const fetchDuplicateSkillInfo = gql`
  query fetchDuplicateSkillInfo($name: String!) {
    fetchDuplicateSkillInfo(name: $name)
  }
`

export const fetchAdminTeamContentStats = gql`
  query fetchAdminTeamContentStats($organizationId: ID!) {
    fetchAdminTeamContentStats(organizationId: $organizationId) {
      _id
      teamName
      total {
        _id
        liked
        added
        opened
        shared
      }
    }
  }
`

export const fetchFrameworkEditInfo = gql`
  query fetchFrameworkEditInfo($frameworkId: ID!) {
    fetchFrameworkEditInfo(frameworkId: $frameworkId) {
      _id
      levelTexts {
        _id
        level1Text
        level2Text
        level3Text
        level4Text
        level5Text
      }
    }
  }
`

export const fetchAllRoles = gql`
  query fetchAllRoles($organizationId: String) {
    fetchAllRoles(organizationId: $organizationId) {
      ...RoleData
    }
  }
  ${Roles.fragments.RoleData}
`
export const fetchGoalsStatsForOrganization = gql`
  query fetchGoalsStatsForOrganization($organizationId: ID!) {
    fetchGoalsStatsForOrganization(organizationId: $organizationId) {
      _id
      draft
      review
      active
      completed
      privateGoal
      teamName
    }
  }
`
export const fetchInnentialLearningPaths = gql`
  query fetchInnentialLearningPaths(
    $showOrganization: Boolean
    $params: InputQueryParams
  ) {
    fetchInnentialLearningPaths(
      showOrganization: $showOrganization
      params: $params
    ) {
      ...LearningPathListData
    }
    totalNumberOfInnentialLearningPaths(showOrganization: $showOrganization)
  }
  ${LearningPath.fragments.LearningPathListData}
`
export const fetchInnentialLearningPathStatistics = gql`
  query fetchInnentialLearningPathStatistics(
    $showOrganization: Boolean
    $params: InputQueryParams
  ) {
    fetchInnentialLearningPathStatistics(
      showOrganization: $showOrganization
      params: $params
    ) {
      ...LearningPathStatisticsListData
    }
    totalNumberOfInnentialLearningPaths(showOrganization: $showOrganization)
  }
  ${LearningPath.fragments.LearningPathStatisticsListData}
`
export const fetchInnentialLearningPathDetails = gql`
  query fetchInnentialLearningPathDetails($id: ID!) {
    fetchInnentialLearningPathDetails(id: $id) {
      ...LearningPathDetails
    }
  }
  ${LearningPath.fragments.LearningPathDetails}
`
export const fetchLearningPathById = gql`
  query fetchLearningPathById($id: ID!) {
    fetchLearningPathById(id: $id) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const fetchLearningPathByIdAdmin = gql`
  query fetchLearningPathByIdAdmin($id: ID!) {
    fetchLearningPathByIdAdmin(id: $id) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const fetchOrganizationGoals = gql`
  query fetchOrganizationGoals($organizationId: ID!) {
    fetchOrganizationGoals(organizationId: $organizationId) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const fetchOrganizationStatsGrowthData = gql`
  query fetchOrganizationStatsGrowthData($organizationId: ID!) {
    fetchOrganizationStatsGrowthData(organizationId: $organizationId) {
      ...GrowthData
    }
  }
  ${Stats.fragments.GrowthData}
`

export const fetchAllGrowthData = gql`
  query fetchAllGrowthData(
    $showActiveClients: Boolean
    $showLastSixMonths: Boolean
  ) {
    fetchAllGrowthData(
      showActiveClients: $showActiveClients
      showLastSixMonths: $showLastSixMonths
    ) {
      ...GrowthData
    }
  }
  ${Stats.fragments.GrowthData}
`

export const fetchSkillBreakdown = gql`
  query fetchSkillBreakdown(
    $skillId: ID!
    $showActiveClients: Boolean
    $showLastSixMonths: Boolean
  ) {
    fetchSkillBreakdown(
      skillId: $skillId
      showActiveClients: $showActiveClients
      showLastSixMonths: $showLastSixMonths
    ) {
      _id
      firstName
      lastName
      email
    }
  }
`

export const fetchOrganizationRequiredSkillData = gql`
  query fetchOrganizationRequiredSkillData($organizationId: ID!) {
    fetchOrganizationRequiredSkillData(organizationId: $organizationId) {
      ...SkillCountData
    }
  }
  ${Stats.fragments.SkillCountData}
`
export const fetchLearningPathStatistics = gql`
  query fetchLearningPathStatistics($organizationId: ID) {
    fetchLearningPathStatistics(organizationId: $organizationId) {
      ...LearningPathStatisticsData
    }
  }
  ${Stats.fragments.LearningPathStatisticsData}
`
export const fetchAllFulfillmentRequests = gql`
  query fetchAllFulfillmentRequests(
    $user: ID
    $organizationId: ID
    $limit: Int
    $offset: Int
  ) {
    fetchAllFulfillmentRequests(
      user: $user
      organizationId: $organizationId
      limit: $limit
      offset: $offset
    ) {
      ...FulfillmentRequestData
    }
  }
  ${FulfillmentRequest.fragments.FulfillmentRequestData}
`

export const fetchFulfillmentRequest = gql`
  query fetchFulfillmentRequest($requestId: ID!) {
    fetchFulfillmentRequest(requestId: $requestId) {
      ...FulfillmentRequestData
    }
  }
  ${FulfillmentRequest.fragments.FulfillmentRequestData}
`

export const fetchInnentialAndOrgLearningPaths = gql`
  query fetchInnentialAndOrgLearningPaths($organizationId: ID!) {
    fetchInnentialAndOrgLearningPaths(organizationId: $organizationId) {
      _id
      name
      organization {
        _id
      }
    }
  }
`

export const findUsers = gql`
  query findUsers($search: String!) {
    findUsers(search: $search) {
      _id
      firstName
      lastName
      email
      organizationName
      leader
      roles
      status
    }
  }
`

export const fetchPDFUploadLink = gql`
  query fetchPDFUploadLink($contentType: String) {
    fetchPDFUploadLink(contentType: $contentType)
  }
`
