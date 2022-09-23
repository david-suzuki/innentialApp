import gql from 'graphql-tag'
import {
  LearningPath,
  AdminDashboard,
  LeaderDashboard,
  Goal,
  Feedback,
  Organization,
  Team,
  User,
  Skills,
  Roles,
  Filters,
  LearningContent,
  Request,
  Reviews,
  Onboarding,
  DevelopmentPlan,
  Comments,
  Events
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

export const publicGetAuthToken = gql`
  query publicGetAuthToken($userId: ID!) {
    publicGetAuthToken(userId: $userId)
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

// SKILLS
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

// MY EVENTS
export const fetchAllMyEvents = gql`
  query fetchAllMyEvents {
    fetchAllMyEvents {
      ...EventMainData
    }
  }
  ${Events.fragments.EventMainData}
`

export const fetchAllInvitations = gql`
  query fetchAllInvitations {
    fetchAllInvitations {
      ...EventMainData
    }
  }
  ${Events.fragments.EventMainData}
`

export const fetchAllPastEvents = gql`
  query fetchAllPastEvents {
    fetchAllPastEvents {
      ...EventMainData
    }
  }
  ${Events.fragments.EventMainData}
`
export const fetchEventById = gql`
  query fetchEventById($eventId: ID!) {
    fetchEventById(_id: $eventId) {
      _id
      title
      description
      eventType
      format
      eventLink
      eventLinkExternal
      eventLocation
      scheduleFromDate
      scheduleToDate
      isOnedayEvent
      isPaid
      currency
      price
      attendee {
        attendeeType
        attendeeIds
      }
      inviteLink {
        url
        status
      }
      skills {
        _id
        name
      }
      invitations {
        _id
        firstName
        lastName
        status
      }
      imageLink
    }
  }
`

export const fetchAllUpcomingAdminEvents = gql`
  query fetchAllUpcomingAdminEvents {
    fetchAllUpcomingAdminEvents {
      ...EventData
    }
  }
  ${Events.fragments.EventData}
`

export const fetchAllDraftAdminEvents = gql`
  query fetchAllDraftAdminEvents {
    fetchAllDraftAdminEvents {
      ...EventData
    }
  }
  ${Events.fragments.EventData}
`

export const fetchAllPastAdminEvents = gql`
  query fetchAllPastAdminEvents {
    fetchAllPastAdminEvents {
      ...EventData
    }
  }
  ${Events.fragments.EventData}
`

export const fetchAttendeeUsers = gql`
  query fetchAttendeeUsers {
    fetchAttendeeUsers {
      _id
      firstName
      lastName
      email
      assigned
    }
  }
`

export const fetchAttendeeTeams = gql`
  query fetchAttendeeTeams {
    fetchAttendeeTeams {
      _id
      teamName
      assigned
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
// INTERESTS
export const fetchAllIndustries = gql`
  query fetchAllIndustries {
    fetchAllIndustries {
      _id
      name
      slug
    }
  }
`

export const publicFetchAllIndustries = gql`
  query publicFetchAllIndustries {
    publicFetchAllIndustries {
      _id
      name
      slug
    }
  }
`

export const publicFetchInvitation = gql`
  query publicFetchInvitation($pendingInvitation: ID!) {
    publicFetchInvitation(pendingInvitation: $pendingInvitation) {
      _id
      email
    }
  }
`

export const currentUser = gql`
  query currentUser {
    currentUser {
      ...CurrentUserData
    }
  }
  ${User.fragments.CurrentUserData}
`

export const currentUserProfile = gql`
  query currentUserProfile {
    currentUserProfile {
      user {
        ...OnboardingUserData
      }
      onboardingInfo {
        ...OnboardingInfoData
      }
    }
  }
  ${User.fragments.OnboardingUserData}
  ${Onboarding.fragments.OnboardingInfoData}
`
export const fetchUserTeamsInOrganization = gql`
  query fetchUserTeamsInOrganization($userId: ID!) {
    fetchUserTeamsInOrganization(userId: $userId) {
      ...TeamDetailsData
    }
  }
  ${Team.fragments.TeamDetailsData}
`
export const fetchNonUserTeamsInOrganization = gql`
  query fetchNonUserTeamsInOrganization($userId: ID!) {
    fetchNonUserTeamsInOrganization(userId: $userId) {
      ...TeamDetailsData
    }
  }
  ${Team.fragments.TeamDetailsData}
`
export const currentUserSkillsProfile = gql`
  query currentUserSkillsProfile {
    currentUserSkillsProfile {
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
        frameworkId
      }
      selectedInterests {
        name
        slug
        _id
      }
    }
  }
`

export const fetchCurrentUserOrganization = gql`
  query fetchCurrentUserOrganization {
    fetchCurrentUserOrganization {
      ...OrganizationData
    }
  }
  ${Organization.fragments.OrganizationData}
`
export const fetchCurrentUserOrganizationTeams = gql`
  query fetchCurrentUserOrganizationTeams {
    fetchCurrentUserOrganization {
      _id
      teams {
        ...TeamData
      }
    }
  }
  ${Team.fragments.TeamData}
`
export const fetchSmallerCurrentUserOrganizationTeams = gql`
  query fetchSmallerCurrentUserOrganizationTeams {
    fetchCurrentUserOrganization {
      _id
      teams {
        ...SmallerTeamData
      }
    }
  }
  ${Team.fragments.SmallerTeamData}
`
export const fetchTeamsForTeamPopup = gql`
  query fetchTeamsForTeamPopup {
    fetchCurrentUserOrganization {
      _id
      teams {
        _id
        teamName
      }
    }
  }
`
export const fetchFilteredEmployeesNotPartOfTeam = gql`
  query fetchFilteredEmployeesNotPartOfTeam($teamId: ID!, $email: String) {
    fetchFilteredEmployeesNotPartOfTeam(teamId: $teamId, email: $email) {
      _id
      firstName
      lastName
      email
    }
  }
`
export const fetchFilteredEmployees = gql`
  query fetchFilteredEmployees($email: String, $alreadyAssigned: [ID]) {
    fetchFilteredEmployees(email: $email, alreadyAssigned: $alreadyAssigned) {
      _id
      firstName
      lastName
      email
    }
  }
`
export const fetchDataForCreateTeam = gql`
  query fetchDataForCreateTeam {
    fetchCurrentUserOrganization {
      _id
      employees {
        _id
        firstName
        lastName
        email
      }
    }
  }
`
export const fetchTeamLeadApprovals = gql`
  query fetchTeamLeadApprovals {
    fetchCurrentUserOrganization {
      _id
      teamLeadApprovals
    }
  }
`
export const fetchDataForRecommendedContent = gql`
  query fetchDataForRecommendedContent {
    fetchCurrentUserOrganization {
      _id
      employees {
        _id
        firstName
        lastName
        email
      }
      teams {
        _id
        teamName
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
      }
    }
  }
`
export const fetchMyTeamsData = gql`
  query fetchMyTeamsData {
    fetchCurrentUserTeams {
      _id
      teamName
      totalMembers
      leader {
        ...MemberData
      }
      members {
        _id
      }
      createdAt
    }
  }
  ${User.fragments.MemberData}
`
export const fetchCurrentUserOrganizationTeamsInitialData = gql`
  query fetchCurrentUserOrganizationTeamsInitialData {
    fetchCurrentUserOrganization {
      _id
      teams {
        _id
        teamName
        totalMembers
        leader {
          ...MemberData
        }
        members {
          _id
        }
        createdAt
      }
    }
  }
  ${User.fragments.MemberData}
`
export const fetchTeamsForRecommendedContent = gql`
  query fetchTeamsForRecommendedContent {
    fetchCurrentUserOrganization {
      _id
      employees {
        _id
        firstName
        lastName
        email
      }
      teams {
        _id
        teamName
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
      }
    }
  }
`
export const fetchAddTeamMemberRequiredData = gql`
  query fetchAddTeamMemberRequiredData($teamId: ID!) {
    fetchCurrentUserOrganization {
      _id
      employees {
        _id
        firstName
        lastName
        email
      }
    }
    fetchTeam(teamId: $teamId) {
      _id
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
    }
  }
`
export const fetchDataForSkillDetails = gql`
  query fetchDataForSkillDetails($skillId: ID) {
    fetchCurrentUserOrganization {
      _id
      teams {
        _id
        leader {
          ...MemberData
        }
      }
    }
    fetchUsersFromOrganizationWithSkill(skillId: $skillId) {
      ...EmployeeData
    }
  }
  ${User.fragments.EmployeeData}
  ${User.fragments.MemberData}
`
export const fetchCurrentUserOrganizationApprovals = gql`
  query fetchCurrentUserOrganizationApprovals {
    fetchCurrentUserOrganization {
      _id
      approvals
      teamLeadApprovals
    }
  }
`
export const fetchCurrentUserOrganizationInviteLink = gql`
  query fetchCurrentUserInviteLink {
    fetchCurrentUserOrganization {
      _id
      inviteLink {
        link
        active
      }
    }
  }
`
export const fetchCurrentUserOrganizationName = gql`
  query fetchCurrentUserOrganizationName {
    fetchCurrentUserOrganization {
      _id
      organizationName
    }
  }
`
export const fetchCurrentUserOrganizationWithoutImages = gql`
  query fetchCurrentUserOrganizationWithoutImages {
    fetchCurrentUserOrganization {
      ...OrganizationDataWithoutImages
    }
  }
  ${Organization.fragments.OrganizationDataWithoutImages}
`
export const fetchDisabledNeededSkills = gql`
  query fetchDisabledNeededSkills {
    fetchCurrentUserOrganization {
      _id
      disabledNeededSkills {
        _id
        name
      }
    }
  }
`
export const fetchSmallerCurrentUserOrganization = gql`
  query fetchSmallerCurrentUserOrganization {
    fetchCurrentUserOrganization {
      ...SmallerOrganizationData
    }
  }
  ${Organization.fragments.SmallerOrganizationData}
`

export const fetchIfUserOrganizationExist = gql`
  query fetchIfUserOrganizationExist {
    fetchIfUserOrganizationExist
  }
`

export const fetchCurrentUserEmployees = gql`
  query fetchCurrentUserEmployees(
    $employeesLimit: Int
    $employeesSkip: Int
    $selectedSkillsFilter: [ID]
    $nameFilter: String
  ) {
    fetchCurrentUserOrganizationEmployees {
      _id
      organizationId
      totalEmployees(
        selectedSkillsFilter: $selectedSkillsFilter
        nameFilter: $nameFilter
      )
      employees(
        employeesLimit: $employeesLimit
        employeesSkip: $employeesSkip
        selectedSkillsFilter: $selectedSkillsFilter
        nameFilter: $nameFilter
      ) {
        ...EmployeeData
      }
    }
  }
  ${User.fragments.EmployeeData}
`
export const fetchCurrentUserEmployeesWithoutImage = gql`
  query fetchCurrentUserEmployeesWithoutImage(
    $employeesLimit: Int
    $employeesSkip: Int
  ) {
    fetchCurrentUserOrganization {
      _id
      employees(
        employeesLimit: $employeesLimit
        employeesSkip: $employeesSkip
      ) {
        _id
        status

        location
        firstName
        lastName
        roles
        roleAtWork
        teamInfo
        neededSkills {
          _id
          name
        }
        selectedSkills {
          _id
          name
          level
          skillId
        }
      }
    }
  }
`
export const fetchTeamDetails = gql`
  query fetchTeamDetails($teamId: ID!) {
    fetchTeam(teamId: $teamId) {
      ...TeamDetailsData
    }
  }
  ${Team.fragments.TeamDetailsData}
`
export const fetchUserTeamsDetails = gql`
  query fetchUserTeamsDetails {
    fetchCurrentUserOrganization {
      _id
      teams {
        ...TeamDetailsData
      }
    }
  }
  ${Team.fragments.TeamDetailsData}
`
export const fetchTeamMembers = gql`
  query fetchTeamMembers($membersLimit: Int, $membersSkip: Int, $teamId: ID!) {
    fetchTeamMembers(
      membersLimit: $membersLimit
      membersSkip: $membersSkip
      teamId: $teamId
    ) {
      _id
      members {
        ...MemberData
      }
    }
  }
  ${User.fragments.MemberData}
`
export const fetchCurrentUserOrganizationTeamsIds = gql`
  query fetchCurrentUserOrganizationTeamsIds {
    fetchCurrentUserOrganizationTeamsIds
  }
`

export const fetchOpenAssessmentsForUser = gql`
  query fetchOpenAssessmentsForUser {
    fetchOpenAssessmentsForUser {
      teamId
      _id
      email
    }
  }
`

export const fetchCurrentUserTeams = gql`
  query fetchCurrentUserTeams {
    fetchCurrentUserTeams {
      ...TeamData
    }
  }
  ${Team.fragments.TeamData}
`
export const fetchSmallerCurrentUserTeams = gql`
  query fetchSmallerCurrentUserTeams {
    fetchCurrentUserOrganization {
      _id
      teams {
        _id
        teamName
        leader {
          ...MemberData
        }
      }
    }
  }

  ${User.fragments.MemberData}
`
export const fetchCurrentUserOrganizationTeamsDetails = gql`
  query fetchCurrentUserOrganizationTeamsDetails {
    fetchCurrentUserOrganization {
      _id
      teams {
        _id
        teamName
        slug
        active
        createdAt
        leader {
          ...MemberData
        }
        requiredSkills {
          _id
          skillId
          level
        }
        feedbackLink
        publicLink {
          _id
          link
          active
        }
      }
    }
  }
  ${User.fragments.MemberData}
`
export const fetchCurrentUserTeamsIds = gql`
  query fetchCurrentUserTeamsIds {
    fetchCurrentUserTeams {
      _id
    }
  }
`

export const fetchUsersTeam = gql`
  query fetchUsersTeam($userId: String!) {
    fetchUsersTeam(userId: $userId) {
      ...TeamData
    }
  }
  ${Team.fragments.TeamData}
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
      participants {
        _id
        participants
        emails
      }
      membersParticipated
      membersCompleted
      reportLink
    }
  }
`

export const fetchTeam = gql`
  query fetchTeam($teamId: ID!) {
    fetchTeam(teamId: $teamId) {
      ...TeamData
    }
  }
  ${Team.fragments.TeamData}
`

export const fetchRelevantContentForUser = gql`
  query fetchRelevantContentForUser(
    $limit: Int
    $filters: FilterInput
    $neededSkills: [SkillsInput]!
    $sortMethod: String
  ) {
    fetchRelevantContentForUser(
      limit: $limit
      filters: $filters
      neededSkills: $neededSkills
      sortMethod: $sortMethod
    ) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchLikedContentForUser = gql`
  query fetchLikedContentForUser {
    fetchLikedContentForUser {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchCompletedAssesmentsForUser = gql`
  query fetchCompletedAssesmentsForUser {
    fetchCompletedAssesmentsForUser {
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
      membersCompleted
      reportLink
    }
  }
`

export const fetchArchivedTeams = gql`
  query fetchArchivedTeams {
    fetchArchivedTeams {
      ...TeamData
    }
  }
  ${Team.fragments.TeamData}
`

export const getImgUploadLink = gql`
  query getImgUploadLink($contentType: String) {
    getImgUploadLink(contentType: $contentType)
  }
`

export const fetchPDFUploadLink = gql`
  query fetchPDFUploadLink($contentType: String, $contentId: ID) {
    fetchPDFUploadLink(contentType: $contentType, contentId: $contentId)
  }
`

export const fetchUserContentInteractions = gql`
  query fetchUserContentInteractions {
    fetchUserContentInteractions {
      user
      likedContent
      dislikedContent
      currentContent
      clickedContent
      pastContent
      downloadedPdfs
      learningCredentials {
        _id
        email
        password
      }
    }
  }
`

export const fetchEvaluationInfo = gql`
  query fetchEvaluationInfo {
    fetchEvaluationInfo {
      _id
      teamInformations {
        _id
        teamId
        teamName
        allCompleted
        shouldSetRequired
        usersToEvaluate {
          _id
          userId
          fullName
          completed
          shouldEvaluate
        }
        evaluatedUsers
      }
    }
  }
`

export const fetchUsersEvaluateInfo = gql`
  query fetchUsersEvaluateInfo($userId: String!) {
    fetchUsersEvaluateInfo(userId: $userId) {
      category
      level
      name
      slug
      _id
      skillId
      frameworkId
    }
  }
`

export const fetchRequiredTeamSkills = gql`
  query fetchRequiredTeamSkills($teamId: String!) {
    fetchRequiredTeamSkills(teamId: $teamId) {
      category
      name
      slug
      _id
      skillId
      frameworkId
    }
  }
`

export const fetchLatestTeamEvaluation = gql`
  query fetchLatestTeamEvaluation($teamId: String!, $search: String) {
    fetchLatestTeamEvaluation(teamId: $teamId, search: $search) {
      ...TeamEvaluatedSkillData
      usersForTooltip {
        ...TeamEvaluatedSkillUserData
      }
      users
      usersInOrganization
    }
  }
  ${Team.fragments.TeamEvaluatedSkillData}
  ${Team.fragments.TeamEvaluatedSkillUserData}
`

export const fetchOrganizationEvaluation = gql`
  query fetchOrganizationEvaluation {
    fetchOrganizationEvaluation {
      _id
      evaluations {
        _id
        teamId
        evaluatedBy
        memberEvaluations {
          _id
          userId
          skills {
            _id
            skillId
            evaluatedLevel
          }
        }
        requiredSkills {
          _id
          skillId
          category
          name
          slug
          level
        }
        leadersSkills {
          _id
          skillId
          category
          name
          slug
          level
        }
      }
      unEvaluatedUsers {
        _id
        user
        roleAtWork
        selectedWorkSkills {
          _id
          skillId
          name
          level
        }
      }
      allProfiles {
        _id
        user
        roleAtWork
        selectedWorkSkills {
          _id
          skillId
          name
          level
        }
      }
    }
  }
`

export const fetchOrganizationSpecificSkills = gql`
  query fetchOrganizationSpecificSkills {
    fetchOrganizationSpecificSkills {
      ...SkillData
    }
  }
  ${Skills.fragments.SkillData}
`

export const fetchOrganizationUserProfiles = gql`
  query fetchOrganizationUserProfiles {
    fetchOrganizationUserProfiles {
      _id
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
`

export const currentUserPreferredTypes = gql`
  query currentUserPreferredTypes {
    currentUserPreferredTypes {
      types
      sortMethod
      price
    }
  }
`

export const fetchUsersProfile = gql`
  query fetchUsersProfile($userId: String!) {
    fetchUsersProfile(userId: $userId) {
      _id
      status
      email
      roles
      leader
      firstName
      lastName
      roleAtWork
      roleId
      teamInfo
      previousTeams
      imageLink
      location
      evaluatedSkills {
        _id
        skillId
        evaluatedLevel
      }

      rawFeedback {
        _id
        skillId
        feedback {
          _id
          evaluatedAt
          evaluatedLevel
          evaluatedBy {
            _id
            firstName
            lastName
            imageLink
          }
        }
      }

      skillsProfile {
        _id
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

export const fetchSharedInTeamContent = gql`
  query fetchSharedInTeamContent {
    fetchSharedInTeamContent {
      _id
      teams
      lastShared
      sharedBy

      notes {
        _id
        userId
        note
      }

      sharedContent {
        ...LearningContentData
      }
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchLearningContent = gql`
  query fetchLearningContent($learningContentId: ID) {
    fetchLearningContent(learningContentId: $learningContentId) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchSharedByMeContent = gql`
  query fetchSharedByMeContent {
    fetchSharedByMeContent {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`
export const fetchDataForTeamContentList = gql`
  query fetchDataForTeamContentList {
    fetchCurrentUserOrganization {
      _id
      teams {
        _id
        createdAt
        teamName
        slug
      }
      employees {
        _id
        firstName
        lastName
        email
      }
    }
  }
`

export const fetchDislikedContentForUser = gql`
  query fetchDislikedContentForUser {
    fetchDislikedContentForUser {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchOrganizationLocations = gql`
  query fetchOrganizationLocations {
    fetchOrganizationLocations
  }
`
export const requestContentInformationForUrl = gql`
  query requestContentInformationForUrl($url: String!) {
    requestContentInformationForUrl(url: $url) {
      exists
      content {
        ...LearningContentData
      }
      data {
        title
        author
        publishedDate
      }
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchUserUploadedContent = gql`
  query fetchUserUploadedContent {
    fetchUserUploadedContent {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchStatsOverviewData = gql`
  query fetchStatsOverviewData {
    fetchStatsOverviewData {
      employees
      newEmployees
      teams
      newTeams
      feedback
      newFeedback
    }
  }
`

export const fetchStatsTeamsData = gql`
  query fetchStatsTeamsData {
    fetchStatsTeamsData {
      teamsSkillGap {
        _id
        teamName
        teamMemberCount
        neededSkills
        availableSkills
        neededSkillsNames
      }
      mostRequiredSkills {
        _id
        name
        employeesCount
      }
    }
  }
`

export const fetchStatsGrowthData = gql`
  query fetchStatsGrowthData {
    fetchStatsGrowthData {
      skillsPeopleHave {
        _id
        name
        employeesCount
      }
      mostNeededSkills {
        _id
        name
        employeesCount
      }
      interests {
        _id
        name
        employeesCount
      }
    }
  }
`

export const fetchGrowthDetails = gql`
  query fetchGrowthDetails($key: String!, $teamId: ID) {
    fetchGrowthDetails(key: $key, teamId: $teamId) {
      _id
      name
      employeesCount
    }
  }
`

export const fetchRequiredSkillsDetails = gql`
  query fetchRequiredSkillsDetails {
    fetchRequiredSkillsDetails {
      _id
      name
      employeesCount
    }
  }
`

export const fetchSkillGapDetails = gql`
  query fetchSkillGapDetails {
    fetchSkillGapDetails {
      _id
      teamName
      teamMemberCount
      neededSkills
      availableSkills
      neededSkillsNames
    }
  }
`

export const fetchNeededSkillUserList = gql`
  query fetchNeededSkillUserList($skillId: ID!, $teamId: ID) {
    fetchNeededSkillUserList(skillId: $skillId, teamId: $teamId) {
      _id
      firstName
      lastName
      email
      organizationName
      leader
      roles
      status
      imageLink
      location
      neededSkills {
        _id
        name
      }
      roleAtWork
    }
  }
`

export const fetchInterestUserList = gql`
  query fetchInterestUserList($interestId: ID!) {
    fetchInterestUserList(interestId: $interestId) {
      _id
      firstName
      lastName
      email
      organizationName
      leader
      roles
      status
      imageLink
      location
      roleAtWork
    }
  }
`

export const fetchNeededSkillTeamList = gql`
  query fetchNeededSkillTeamList($skillId: ID!) {
    fetchNeededSkillTeamList(skillId: $skillId) {
      ...TeamData
    }
  }
  ${Team.fragments.TeamData}
`

export const fetchOrganizationEvaluationToo = gql`
  query fetchOrganizationEvaluationToo {
    fetchOrganizationEvaluationToo {
      ...TeamEvaluatedSkillData
      usersForTooltip {
        ...TeamEvaluatedSkillUserData
      }
      users
      usersInOrganization
    }
  }
  ${Team.fragments.TeamEvaluatedSkillData}
  ${Team.fragments.TeamEvaluatedSkillUserData}
`

export const fetchOnboardedTeamsInOrganization = gql`
  query fetchOnboardedTeamsInOrganization {
    fetchOnboardedTeamsInOrganization {
      ...TeamShortData
    }
  }
  ${Team.fragments.TeamShortData}
`

export const fetchSkillDetailsInTeam = gql`
  query fetchSkillDetailsInTeam($teamId: String!, $skillId: String!) {
    fetchSkillDetailsInTeam(teamId: $teamId, skillId: $skillId) {
      _id
      name
      skillId
      skillAvailable
      skillNeeded
      userId
      evaluatedLevel
    }
  }
`

export const fetchSkillAvailableInOrganization = gql`
  query fetchSkillAvailableInOrganization($teamId: String!, $skillId: String!) {
    fetchSkillAvailableInOrganization(teamId: $teamId, skillId: $skillId) {
      _id
      name
      skillId
      skillAvailable
      skillNeeded
      userId
      evaluatedLevel
    }
  }
`

export const fetchOrganizationSkillFrameworks = gql`
  query fetchOrganizationSkillFrameworks {
    fetchOrganizationSkillFrameworks {
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

export const fetchSkillFrameworkForID = gql`
  query fetchSkillFrameworkForID($connectedTo: ID!) {
    fetchSkillFrameworkForID(connectedTo: $connectedTo) {
      _id
      levelTexts {
        _id
        level1Text
        level2Text
        level3Text
        level4Text
        level5Text
      }
      orgFramework
    }
  }
`

export const fetchSkillCategoriesForOrganizationAdmin = gql`
  query fetchSkillCategoriesForOrganizationAdmin {
    fetchSkillCategoriesForOrganizationAdmin {
      _id
      name
      orgFrameworkId
    }
  }
`

export const fetchRelevantUsersInOrganization = gql`
  query fetchRelevantUsersInOrganization {
    fetchRelevantUsersInOrganization {
      _id
      img
      isActive
      label
      location
      name
      profession
      status
      profileRelevancy
      skills {
        _id
        level
        name
        skillId
        relevancyRating
      }
    }
  }
`

export const fetchSkillListForCategory = gql`
  query fetchSkillListForCategory($categoryId: ID!) {
    fetchSkillListForCategory(categoryId: $categoryId)
  }
`

export const fetchUserReviews = gql`
  query fetchUserReviews {
    fetchUserReviews {
      ...ReviewData
    }
  }
  ${Reviews.fragments.ReviewData}
`

export const fetchOrganizationReviews = gql`
  query fetchOrganizationReviews {
    fetchOrganizationReviews {
      ...ReviewData
    }
  }
  ${Reviews.fragments.ReviewData}
`

export const fetchReviewStartInfo = gql`
  query fetchReviewStartInfo($reviewId: ID!) {
    fetchReviewStartInfo(reviewId: $reviewId) {
      _id
      name
      teams {
        _id
        teamName
        users {
          _id
          userName
          email
          roleAtWork
          location
          imageLink
          numberOfGoals
          goalsSet
          hasEventScheduled
        }
        isReviewer
      }
      type
    }
  }
`

export const fetchOrganizationReviewSchedules = gql`
  query fetchOrganizationReviewSchedules {
    fetchOrganizationReviewSchedules {
      _id
      name
      scope
      reviewers
      firstReviewStart
      nextReviewStart
      reviewFrequency
      progressChecks
    }
  }
`

export const fetchReviewScheduleEditInfo = gql`
  query fetchReviewScheduleEditInfo($templateId: ID!) {
    fetchReviewScheduleEditInfo(templateId: $templateId) {
      _id
      name
      goalType
      scopeType
      oneTimeReview
      specificScopes {
        _id
      }
      specificUsers {
        _id
        firstName
        lastName
        email
      }
      reviewers
      firstReviewStart
      specificReviewers {
        _id
        firstName
        lastName
        email
        roles
        status
      }
      reviewFrequency {
        _id
        repeatCount
        repeatInterval
        day
      }
      progressCheckFrequency {
        _id
        repeatCount
        repeatInterval
        day
      }
    }
  }
`

export const fetchUserGoalInfoForReview = gql`
  query fetchUserGoalInfoForReview($userId: ID!, $reviewId: ID!) {
    fetchUserGoalInfoForReview(userId: $userId, reviewId: $reviewId) {
      _id
      reviewName
      userName
      active
      nextReviewId
      templateId
      oneTimeReview
      goals {
        _id
        goalName
        goalType
        relatedSkills {
          _id
          name
          level
          frameworkId
        }
        measures {
          _id
          measureName
          completed
          successRate
        }
        skills {
          _id
          skillId
          skillName
          level
          related
        }
        feedback
        setBy
      }
      goalsCompleted
      nextGoals {
        _id
        goalName
        goalType
        relatedSkills {
          _id
          name
          level
          frameworkId
        }
        measures {
          _id
          measureName
          completed
          successRate
        }
        setBy
        createdAt
        endsAt
        developmentPlan {
          _id
          content {
            _id
            content {
              ...LearningContentData
            }
            status
            setBy
            approved
          }
          mentors {
            _id
            img
            isActive
            label
            location
            name
            profession
            status
            skills {
              _id
              level
              name
              skillId
              relevancyRating
            }
          }
        }
      }
      skillProgression {
        _id
        skillName
        oldValue
        newValue
      }
      feedback
      feedbackFromOthers {
        ...TextFeedbackData
      }
    }
  }
  ${LearningContent.fragments.LearningContentData}
  ${Feedback.fragments.TextFeedbackData}
`

export const fetchUserGoals = gql`
  query fetchUserGoals {
    fetchUserGoals {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const fetchUsersGoals = gql`
  query fetchUsersGoals($userId: ID!) {
    fetchUsersGoals(userId: $userId) {
      _id
      goalName
      goalType
      isPrivate
      relatedSkills {
        _id
        name
        level
        frameworkId
      }
      measures {
        _id
        measureName
        completed
        successRate
      }
      feedback
      status
      skills {
        _id
        skillId
        skillName
        level
        related
      }
      setBy
      reviewId
      createdAt
      endsAt
      developmentPlan {
        _id
        content {
          _id
        }
        mentors {
          _id
        }
      }
    }
  }
`

export const fetchReviewResultInfo = gql`
  query fetchReviewResultInfo($reviewId: ID!) {
    fetchReviewResultInfo(reviewId: $reviewId) {
      _id
      name
      closedAt
      userResults {
        _id
        user {
          _id
          firstName
          lastName
          email
          status
          imageLink
          roleAtWork
        }
        reviewedAt
        reviewer
        feedback
        goalsReviewed {
          _id
          goalName
          goalType
          relatedSkills {
            _id
            name
            level
            frameworkId
          }
          measures {
            _id
            measureName
            completed
            successRate
          }
          feedback
          status
          skills {
            _id
            skillId
            skillName
            level
            related
          }
        }
        goalsSet {
          _id
          goalName
          goalType
          relatedSkills {
            _id
            name
            level
            frameworkId
          }
          measures {
            _id
            measureName
            completed
            successRate
          }
          feedback
          status
          skills {
            _id
            skillId
            skillName
            level
            related
          }
          createdAt
          endsAt
        }
        skillProgression {
          _id
          skillName
          oldValue
          newValue
        }
      }
    }
  }
`

export const fetchSingleGoal = gql`
  query fetchSingleGoal($goalId: ID!) {
    fetchSingleGoal(goalId: $goalId) {
      _id
      goalName
      goalType
      relatedSkills {
        _id
        name
        level
        frameworkId
      }
      measures {
        _id
        measureName
        completed
        successRate
      }
      feedback
      setBy
      createdAt
      endsAt
    }
  }
`

export const fetchDevelopmentPlanRelatedContent = gql`
  query fetchDevelopmentPlanRelatedContent(
    $neededSkills: [SkillsInput]!
    $limit: Int
    $userId: ID
    $filters: FilterInput
    $inPath: Boolean
  ) {
    fetchDevelopmentPlanRelatedContent(
      neededSkills: $neededSkills
      limit: $limit
      userId: $userId
      filters: $filters
      inPath: $inPath
    ) {
      relatedContentLength
      relatedContent {
        ...LearningContentData
      }
      recommended {
        ...LearningContentData
      }
      totalRelatedContent
      savedForLater {
        ...LearningContentData
      }
      relatedMentors {
        _id
        img
        label
        location
        name
        profession
        profileRelevancy
        skills {
          _id
          level
          name
          skillId
          relevancyRating
        }
      }
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchPeerFeedbackInfo = gql`
  query fetchPeerFeedbackInfo($feedbackShareKey: String!) {
    fetchPeerFeedbackInfo(feedbackShareKey: $feedbackShareKey) {
      _id
      userName
    }
  }
`

export const fetchDevelopmentPlan = gql`
  query fetchDevelopmentPlan($user: ID!, $reviewId: ID) {
    fetchDevelopmentPlan(user: $user, reviewId: $reviewId) {
      _id
      content {
        _id
        content {
          ...LearningContentData
        }
        status
        goalName
        goalId
        goalCompleted
        goalEnds
        startDate
        endDate
        setBy
        approved
      }
      mentors {
        _id
        img
        isActive
        label
        location
        name
        profession
        status
        goalId
        goalName
        goalCompleted
        goalEnds
        skills {
          _id
          level
          name
          skillId
          relevancyRating
        }
      }
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchUserDevelopmentPlan = gql`
  query fetchUserDevelopmentPlan {
    fetchUserDevelopmentPlan {
      _id
      content {
        _id
        content {
          ...LearningContentData
        }
        status
        goalName
        goalId
        goalCompleted
        goalEnds
        startDate
        endDate
        setBy
        approved
        order
      }
      mentors {
        _id
        img
        isActive
        label
        location
        name
        profession
        status
        goalId
        goalName
        goalCompleted
        goalEnds
        skills {
          _id
          level
          name
          skillId
          relevancyRating
        }
      }
      selectedGoalId
      selectedGoalName
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchDevelopmentPlanWithStats = gql`
  query fetchDevelopmentPlanWithStats($userId: ID!) {
    fetchDevelopmentPlanWithStats(userId: $userId) {
      ...DevelopmentPlanStatsData
    }
  }
  ${DevelopmentPlan.fragments.DevelopmentPlanStatsData}
`

export const searchLearningContent = gql`
  query searchLearningContent(
    $searchString: String
    $filters: FilterInput
    $limit: Int
  ) {
    searchLearningContent(
      searchString: $searchString
      filters: $filters
      limit: $limit
    ) {
      count
      content {
        ...LearningContentData
      }
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchContentPlanForGoal = gql`
  query fetchContentPlanForGoal($goalId: ID!) {
    fetchContentPlanForGoal(goalId: $goalId) {
      _id
      user
      goal {
        _id
        goalName
        goalType
        relatedSkills {
          _id
          name
          level
          frameworkId
        }
        measures {
          _id
          measureName
          completed
          successRate
        }
        feedback
        status
        setBy
        createdAt
        endsAt
      }
      developmentPlan {
        _id
        content {
          _id
          content {
            ...LearningContentData
          }
          status
          goalName
          goalId
          startDate
          endDate
          setBy
          approved
          note
        }
        mentors {
          _id
          img
          isActive
          label
          location
          name
          profession
          status
          goalId
          goalName
          skills {
            _id
            level
            name
            skillId
            relevancyRating
          }
        }
      }
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchDraftGoalsOfUserTeams = gql`
  query fetchDraftGoalsOfUserTeams {
    fetchDraftGoalsOfUserTeams {
      _id
      teamName
      users {
        _id
        userName
        roleAtWork
        location
        imageLink
        numberOfGoals
      }
    }
  }
`

export const fetchDraftGoalsForUser = gql`
  query fetchDraftGoalsForUser($userId: ID!) {
    fetchDraftGoalsForUser(userId: $userId) {
      _id
      goalName
      goalType
      isPrivate
      relatedSkills {
        _id
        name
        level
        frameworkId
      }
      measures {
        _id
        measureName
        completed
        successRate
      }
      feedback
      status
      setBy
      developmentPlan {
        _id
        content {
          _id
          content {
            ...LearningContentData
          }
          status
          setBy
          approved
        }
        mentors {
          _id
          img
          isActive
          label
          location
          name
          profession
          status
          skills {
            _id
            level
            name
            skillId
            relevancyRating
          }
        }
      }
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const checkContentPlanForGoal = gql`
  query checkContentPlanForGoal($goalId: ID!) {
    checkContentPlanForGoal(goalId: $goalId)
  }
`

export const fetchLeadersReviewSchedules = gql`
  query fetchLeadersReviewSchedules {
    fetchLeadersReviewSchedules {
      _id
      name
      scope
      reviewers
      firstReviewStart
      nextReviewStart
      reviewFrequency
      progressChecks
    }
  }
`

export const fetchUpcomingOrActiveReviewEventInfo = gql`
  query fetchUpcomingOrActiveReviewEventInfo($reviewId: ID, $templateId: ID) {
    fetchUpcomingOrActiveReviewEventInfo(
      reviewId: $reviewId
      templateId: $templateId
    ) {
      _id
      status
      startsAt
      reviewStartInfo {
        _id
        name
        teams {
          _id
          teamName
          users {
            _id
            userName
            email
            roleAtWork
            location
            imageLink
            numberOfGoals
            goalsSet
            hasEventScheduled
          }
          isReviewer
        }
        type
      }
    }
  }
`
export const fetchOrganizationCustomInvitation = gql`
  query fetchOrganizationCustomInvitation {
    fetchOrganizationCustomInvitation {
      _id
      customInvitationMessage
      customInvitationEnabled
    }
  }
`

export const fetchRoles = gql`
  query fetchRoles($organizationOnly: Boolean) {
    fetchRoles(organizationOnly: $organizationOnly) {
      ...RoleData
    }
  }
  ${Roles.fragments.RoleData}
`
export const fetchRoleSuggestions = gql`
  query fetchRoleSuggestions {
    fetchRoleSuggestions {
      ...RoleData
    }
  }
  ${Roles.fragments.RoleData}
`

export const fetchRoleGroups = gql`
  query fetchRoleGroups {
    fetchRoleGroups {
      _id
      groupName
      relatedRoles {
        ...RoleData
      }
    }
  }
  ${Roles.fragments.RoleData}
`

export const checkReadyForReviewGoalsForUser = gql`
  query checkReadyForReviewGoalsForUser {
    checkReadyForReviewGoalsForUser
  }
`

export const fetchOrganizationLearningPath = gql`
  query fetchOrganizationLearningPath {
    fetchOrganizationLearningPath {
      ...LearningPathManageData
    }
  }
  ${LearningPath.fragments.LearningPathManageData}
`

export const fetchTeamLearningPath = gql`
  query fetchTeamLearningPath {
    fetchTeamLearningPath {
      ...TeamLearningPathsData
    }
  }
  ${LearningPath.fragments.TeamLearningPathsData}
`

export const fetchOrganizationLearningPathForDashboard = gql`
  query fetchOrganizationLearningPathForDashboard($search: String) {
    fetchOrganizationLearningPathForDashboard(search: $search) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const fetchTeamsLearningPathsForDashboard = gql`
  query fetchTeamsLearningPathsForDashboard($search: String) {
    fetchTeamsLearningPathsForDashboard(search: $search) {
      _id
      key
      value {
        ...LearningPathListData
      }
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const fetchLearningPathById = gql`
  query fetchLearningPathById($id: ID!) {
    fetchLearningPathById(id: $id) {
      ...LearningPathFullData
    }
  }
  ${LearningPath.fragments.LearningPathFullData}
`

export const fetchLearningPathEditInfo = gql`
  query fetchLearningPathEditInfo($pathId: ID!) {
    fetchLearningPathById(id: $pathId) {
      ...LearningPathEditData
    }
  }
  ${LearningPath.fragments.LearningPathEditData}
`

export const fetchLearningPathsForDashboard = gql`
  query fetchLearningPathsForDashboard(
    $search: String
    $limit: Int
    $categories: [String!]
  ) {
    fetchLearningPathsForDashboard(
      search: $search
      limit: $limit
      categories: $categories
    ) {
      _id
      key
      value {
        ...LearningPathListData
      }
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const fetchUserPeerFeedback = gql`
  query fetchUserPeerFeedback {
    fetchUserPeerFeedback {
      ...TextFeedbackData
    }
  }
  ${Feedback.fragments.TextFeedbackData}
`

export const fetchPeerFeedback = gql`
  query fetchPeerFeedback($userId: ID!) {
    fetchPeerFeedback(userId: $userId) {
      ...TextFeedbackData
    }
  }
  ${Feedback.fragments.TextFeedbackData}
`

export const fetchFeedbackReceipts = gql`
  query fetchFeedbackReceipts {
    fetchFeedbackReceipts {
      ...TextFeedbackData
    }
  }
  ${Feedback.fragments.TextFeedbackData}
`

export const fetchUserPeerFeedbackRequests = gql`
  query fetchUserPeerFeedbackRequests($userId: ID) {
    fetchUserPeerFeedbackRequests(userId: $userId) {
      ...FeedbackRequestData
    }
  }
  ${Feedback.fragments.FeedbackRequestData}
`

export const fetchUserRoleGap = gql`
  query fetchUserRoleGap($user: ID, $roleId: ID) {
    fetchUserRoleGap(user: $user, roleId: $roleId) {
      ...SkillChartInfo
    }
  }
  ${Skills.fragments.SkillChartInfo}
`

export const fetchNextRoles = gql`
  query fetchNextRoles($roleId: ID) {
    fetchNextRoles(roleId: $roleId) {
      ...RoleData
    }
  }
  ${Roles.fragments.RoleData}
`

export const fetchFiltersForArgs = gql`
  query fetchFiltersForArgs(
    $neededSkills: [SkillsInput]!
    $extraSkills: [SkillsInput]
    $user: ID
    $filters: FilterInput
    $search: String
    $inDPSetting: Boolean
  ) {
    fetchFiltersForArgs(
      neededSkills: $neededSkills
      extraSkills: $extraSkills
      user: $user
      filters: $filters
      search: $search
      inDPSetting: $inDPSetting
    ) {
      ...FilterData
    }
  }
  ${Filters.fragments.FilterData}
`

export const fetchContentForOnboardingPlan = gql`
  query fetchContentForOnboardingPlan(
    $neededSkills: [SelectedSkillInput]!
    $filters: FilterInput
    $contentSeen: [ID]!
  ) {
    fetchContentForOnboardingPlan(
      neededSkills: $neededSkills
      filters: $filters
      contentSeen: $contentSeen
    ) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const fetchContentForNextStepPlan = gql`
  query fetchContentForNextStepPlan(
    $neededSkills: [NeededSkillInput]!
    $filters: FilterInput
    $contentSeen: [ID]!
  ) {
    fetchContentForNextStepPlan(
      neededSkills: $neededSkills
      filters: $filters
      contentSeen: $contentSeen
    ) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const publicFetchOrganizationIDForToken = gql`
  query publicFetchOrganizationIDForToken($token: String!) {
    publicFetchOrganizationIDForToken(token: $token) {
      _id
      organizationName
    }
  }
`

export const fetchRequestsForOrganization = gql`
  query fetchRequestsForOrganization {
    fetchRequestsForOrganization {
      ...RequestData
    }
  }
  ${Request.fragments.RequestData}
`

export const fetchRequestsForUser = gql`
  query fetchRequestsForUser($user: ID!) {
    fetchRequestsForUser(user: $user) {
      ...RequestData
    }
  }
  ${Request.fragments.RequestData}
`

export const fetchUserRequests = gql`
  query fetchUserRequests {
    fetchUserRequests {
      ...RequestData
    }
  }
  ${Request.fragments.RequestData}
`

export const fetchRequestsForTeamLeader = gql`
  query fetchRequestsForTeamLeader {
    fetchRequestsForTeamLeader {
      ...RequestData
    }
  }
  ${Request.fragments.RequestData}
`

export const fetchMostPopularResources = gql`
  query fetchMostPopularResources($organizationId: ID!) {
    fetchMostPopularResources(organizationId: $organizationId) {
      ...MostPopularResourcesData
    }
  }
  ${AdminDashboard.fragments.MostPopularResourcesData}
`

export const fetchMostPopularResourcesForTeams = gql`
  query fetchMostPopularResourcesForTeams($leaderId: ID!) {
    fetchMostPopularResourcesForTeams(leaderId: $leaderId) {
      ...MostPopularResourcesData
    }
  }
  ${LeaderDashboard.fragments.MostPopularResourcesData}
`

export const fetchTopInDemandSkills = gql`
  query fetchTopInDemandSkills($organizationId: ID!) {
    fetchTopInDemandSkills(organizationId: $organizationId) {
      ...TopInDemandData
    }
  }
  ${AdminDashboard.fragments.TopInDemandData}
`

export const fetchTopInDemandSkillsForTeam = gql`
  query fetchTopInDemandSkillsForTeam($teamId: ID!) {
    fetchTopInDemandSkillsForTeam(teamId: $teamId) {
      ...TopInDemandData
    }
  }
  ${AdminDashboard.fragments.TopInDemandData}
`

export const fetchActivity = gql`
  query fetchActivity($timeSpan: String) {
    fetchActivity(timeSpan: $timeSpan) {
      ...ActivityData
    }
  }
  ${AdminDashboard.fragments.ActivityData}
`

export const fetchActivityForTeam = gql`
  query fetchActivityForTeam($teamId: ID!, $timeSpan: String) {
    fetchActivityForTeam(teamId: $teamId, timeSpan: $timeSpan) {
      ...ActivityData
    }
  }
  ${LeaderDashboard.fragments.ActivityData}
`

export const fetchActivityForTeams = gql`
  query fetchActivityForTeams($leaderId: ID!, $timeSpan: String) {
    fetchActivityForTeams(leaderId: $leaderId, timeSpan: $timeSpan) {
      ...ActivityData
    }
  }
  ${LeaderDashboard.fragments.ActivityData}
`

export const fetchUserPendingFeedbackRequests = gql`
  query fetchUserPendingFeedbackRequests {
    fetchUserPendingFeedbackRequests {
      ...FeedbackRequestData
    }
  }
  ${Feedback.fragments.FeedbackRequestData}
`

export const fetchTeamFeedbackEvaluation = gql`
  query fetchTeamFeedbackEvaluation($teamId: ID!) {
    fetchTeamFeedbackEvaluation(teamId: $teamId) {
      ...TeamEvaluatedSkillData
    }
  }
  ${Team.fragments.TeamEvaluatedSkillData}
`

export const publicFetchExternalFeedbackInfo = gql`
  query publicFetchExternalFeedbackInfo($token: String!) {
    publicFetchExternalFeedbackInfo(token: $token) {
      _id
      userName
      corporate
      skills {
        category
        level
        name
        slug
        _id
        skillId
        framework {
          _id
          level1Text
          level2Text
          level3Text
          level4Text
          level5Text
        }
      }
    }
  }
`

export const fetchRelevantLearningPaths = gql`
  query fetchRelevantLearningPaths($neededSkills: [SelectedSkillInput!]) {
    fetchRelevantLearningPaths(neededSkills: $neededSkills) {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const fetchRelevantLearningPathsForUser = gql`
  query fetchRelevantLearningPathsForUser {
    fetchRelevantLearningPathsForUser {
      ...LearningPathListData
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const fetchNextStepsForUser = gql`
  query fetchNextStepsForUser {
    fetchNextStepsForUser {
      _id
      awaitingXLP
    }
  }
`

export const fetchTeamEvaluationsForOrganization = gql`
  query fetchTeamEvaluationsForOrganization($offset: Int, $search: String) {
    fetchTeamEvaluationsForOrganization(offset: $offset, search: $search) {
      _id
      teamName
      skills {
        ...TeamEvaluatedSkillData
        usersForTooltip {
          ...TeamEvaluatedSkillUserData
        }
        users
        usersInOrganization
      }
    }
  }
  ${Team.fragments.TeamEvaluatedSkillData}
  ${Team.fragments.TeamEvaluatedSkillUserData}
`

export const fetchUserFulfillmentRequests = gql`
  query fetchUserFulfillmentRequests {
    fetchUserFulfillmentRequests {
      ...FulfillmentRequestData
    }
  }
  ${Request.fragments.FulfillmentRequestData}
`

export const fetchUserCompletedContentPlan = gql`
  query fetchUserCompletedContentPlan($limit: Int) {
    fetchUserCompletedContentPlan(limit: $limit) {
      ...DevelopmentPlanContentData
    }
  }
  ${DevelopmentPlan.fragments.DevelopmentPlanContentData}
`

export const fetchRecommendedSkills = gql`
  query fetchRecommendedSkills {
    fetchRecommendedSkills {
      ...SkillData
    }
  }
  ${Skills.fragments.SkillData}
`

export const fetchTopUsedSkills = gql`
  query fetchTopUsedSkills {
    fetchTopUsedSkills {
      ...SkillData
    }
  }
  ${Skills.fragments.SkillData}
`

export const skillsExistInPaths = gql`
  query skillsExistInPaths($skillIds: [ID!]) {
    skillsExistInPaths(skillIds: $skillIds)
  }
`

export const fetchAssignedLearningPathsForUser = gql`
  query fetchAssignedLearningPathsForUser {
    fetchAssignedLearningPathsForUser {
      _id
      key
      value {
        ...LearningPathListData
      }
    }
  }
  ${LearningPath.fragments.LearningPathListData}
`

export const fetchTeamLearningPathsProgress = gql`
  query fetchTeamLearningPathsProgress($teamId: ID!, $filter: String) {
    fetchTeamLearningPathsProgress(teamId: $teamId, filter: $filter) {
      ...TeamPathStatisticsData
    }
  }
  ${Team.fragments.TeamPathStatisticsData}
`

export const fetchLearningPathCategories = gql`
  query fetchLearningPathCategories($onboarding: Boolean) {
    fetchLearningPathCategories(onboarding: $onboarding)
  }
`

export const fetchAllCommentsForPath = gql`
  query fetchAllCommentsForPath($pathId: ID!) {
    fetchAllCommentsForPath(pathId: $pathId) {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`

export const fetchAllCommentsForUser = gql`
  query fetchAllCommentsForUser {
    fetchAllCommentsForUser {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`

export const fetchAllResolvedCommentsForUser = gql`
  query fetchAllResolvedCommentsForUser {
    fetchAllResolvedCommentsForUser {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`

export const fetchAllComments = gql`
  query fetchAllComments {
    fetchAllComments {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
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

export const fetchEventImageUploadLink = gql`
  query fetchEventImageUploadLink($contentType: String, $eventId: ID!) {
    fetchEventImageUploadLink(contentType: $contentType, _id: $eventId)
  }
`
