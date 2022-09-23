import gql from 'graphql-tag'
import {
  LearningPath,
  Goal,
  Organization,
  DevelopmentPlan,
  Roles,
  Feedback,
  LearningContent,
  Skills,
  Request,
  User,
  Reviews,
  Team,
  Onboarding,
  Comments,
  Events
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

export const logoutMutation = gql`
  mutation logout {
    logout
  }
`

export const publicResetPassword = gql`
  mutation publicResetPassword($email: String!) {
    publicResetPassword(email: $email)
  }
`

export const publicResetPasswordSetPassword = gql`
  mutation publicResetPasswordSetPassword(
    $password: String!
    $resetId: String!
  ) {
    publicResetPasswordSetPassword(password: $password, resetId: $resetId)
  }
`

export const onboardingMutation = gql`
  mutation onboardUserDevelopmentPlan(
    $inputData: UserOnboardingDevelopmentPlan!
  ) {
    onboardUserDevelopmentPlan(inputData: $inputData)
  }
`

export const onboardUserPersonalInfo = gql`
  mutation onboardUserPersonalInfo($inputData: UserOnboardingPersonalInfo!) {
    onboardUserPersonalInfo(inputData: $inputData) {
      ...SkillData
    }
  }
  ${Skills.fragments.SkillData}
`

// export const onboardUserSkillsInfo = gql`
//   mutation onboardUserSkillsInfo(inputData: UserOnboardingPersonalInfo!) {
//     onboardUserSkillsInfo(inputData: $inputData)
//   }
// `

export const profileSkillsChangeMutation = gql`
  mutation profileSkillsChangeMutation(
    $UserProfileSkillsChangeInput: UserProfileSkillsChangeInput!
  ) {
    profileSkillsChangeMutation(inputData: $UserProfileSkillsChangeInput) {
      user
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

export const profilePositionChangeMutation = gql`
  mutation profilePositionChangeMutation(
    $UserProfilePositionChangeInput: UserProfilePositionChangeInput!
  ) {
    profilePositionChangeMutation(inputData: $UserProfilePositionChangeInput) {
      user
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

export const profileGrowthChangeMutation = gql`
  mutation profileGrowthChangeMutation(
    $UserProfileGrowthChangeInput: UserProfileGrowthChangeInput!
  ) {
    profileGrowthChangeMutation(inputData: $UserProfileGrowthChangeInput) {
      user
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

export const profilePasswordChangeMutation = gql`
  mutation profilePasswordChangeMutation(
    $UserProfilePasswordChangeInput: UserProfilePasswordChangeInput!
  ) {
    profilePasswordChangeMutation(inputData: $UserProfilePasswordChangeInput)
  }
`

export const profileNameChangeMutation = gql`
  mutation profileNameChangeMutation($firstName: String, $lastName: String) {
    profileNameChangeMutation(firstName: $firstName, lastName: $lastName)
  }
`

export const updateNeededSkills = gql`
  mutation updateNeededSkills($neededWorkSkills: [UserProfileSkillsInput]!) {
    updateNeededSkills(neededWorkSkills: $neededWorkSkills) {
      user
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

export const organizationOnboardingMutation = gql`
  mutation onboardOrganization(
    $OrganizationOnboardingInput: OrganizationOnboardingInput!
  ) {
    onboardOrganization(inputData: $OrganizationOnboardingInput)
  }
`

export const publicAcceptInvitation = gql`
  mutation publicAcceptInvitation($pendingInvitation: String!) {
    publicAcceptInvitation(pendingInvitation: $pendingInvitation) {
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

export const publicCancelInvitation = gql`
  mutation publicCancelInvitation($userId: ID!) {
    publicCancelInvitation(userId: $userId)
  }
`

export const publicSignupMutation = gql`
  mutation publicSignupUser($password: String!, $userId: ID!) {
    publicSignupUser(password: $password, userId: $userId)
  }
`

export const createNewTeam = gql`
  mutation createNewTeam(
    $OrganizationCreateTeamData: OrganizationCreateTeamData!
  ) {
    createNewTeam(inputData: $OrganizationCreateTeamData)
  }
`

export const addNewMember = gql`
  mutation addNewMember($MemberInput: MemberInput!) {
    addNewMember(inputData: $MemberInput) {
      ...MemberData
    }
  }
  ${User.fragments.MemberData}
`

export const addNewUser = gql`
  mutation addNewUser($email: String!, $role: String!, $invite: Boolean) {
    addNewUser(email: $email, role: $role, invite: $invite) {
      ...EmployeeData
    }
  }
  ${User.fragments.EmployeeData}
`
export const removeTeamMember = gql`
  mutation removeTeamMember($uid: String!, $teamId: String!) {
    removeTeamMember(uid: $uid, teamId: $teamId)
  }
`

export const deleteUserFromOrganization = gql`
  mutation deleteUserFromOrganization($userId: ID!, $organizationId: ID!) {
    deleteUserFromOrganization(userId: $userId, organizationId: $organizationId)
  }
`

export const keepCurrentContent = gql`
  mutation keepCurrentContent($contentIds: [ID]!) {
    keepCurrentContent(contentIds: $contentIds)
  }
`

export const dislikeContent = gql`
  mutation dislikeContent($learningContentId: ID!) {
    dislikeContent(learningContentId: $learningContentId)
  }
`
export const likeContent = gql`
  mutation likeContent($learningContentId: ID!) {
    likeContent(learningContentId: $learningContentId)
  }
`

export const markContentAsViewed = gql`
  mutation markContentAsViewed($learningContentId: ID!) {
    markContentAsViewed(learningContentId: $learningContentId)
  }
`

export const publicRegisterUser = gql`
  mutation publicRegisterUser(
    $userData: UserRegisterInput!
    $metaData: RegistrationMetaInput
  ) {
    publicRegisterUser(userData: $userData, metaData: $metaData)
  }
`

export const publicRegisterUserAcceptInvitation = gql`
  mutation publicRegisterUserAcceptInvitation($pendingInvitation: String!) {
    publicRegisterUserAcceptInvitation(pendingInvitation: $pendingInvitation) {
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

export const deleteTeam = gql`
  mutation deleteTeam($teamId: ID!) {
    deleteTeam(teamId: $teamId)
  }
`

export const archiveTeam = gql`
  mutation archiveTeam($teamId: ID!) {
    archiveTeam(teamId: $teamId) {
      _id
      teamName
      slug
      active
      membersGetStageReport
      leader {
        _id
        firstName
        lastName
        email
        roles
        status
        roleAtWork
        imageLink
      }
      members {
        _id
        firstName
        lastName
        email
        roles
        status
        roleAtWork
        imageLink
      }
    }
  }
`

export const addDownloadedPdfs = gql`
  mutation addDownloadedPdfs($downloadedPdf: String) {
    addDownloadedPdfs(downloadedPdf: $downloadedPdf)
  }
`

export const setUsersEvaluation = gql`
  mutation setUsersEvaluation($inputData: UserEvaluationInput!) {
    setUsersEvaluation(inputData: $inputData) {
      ...CurrentUserData
    }
  }
  ${User.fragments.CurrentUserData}
`

export const setTeamsRequiredSkills = gql`
  mutation setTeamsRequiredSkills($inputData: TeamRelevancyInput!) {
    setTeamsRequiredSkills(inputData: $inputData)
  }
`

export const createTeamStageAssessment = gql`
  mutation createTeamStageAssessment($teamId: ID!) {
    createTeamStageAssessment(teamId: $teamId)
  }
`

export const updateLearningPreferences = gql`
  mutation updateLearningPreferences(
    $types: [String]
    $sortMethod: String
    $price: [String]
  ) {
    updateLearningPreferences(
      types: $types
      sortMethod: $sortMethod
      price: $price
    )
  }
`

export const setNewLeader = gql`
  mutation setNewLeader($uid: String!, $teamId: String!) {
    setNewLeader(uid: $uid, teamId: $teamId)
  }
`

export const deleteProfileImage = gql`
  mutation deleteProfileImage {
    deleteProfileImage
  }
`

export const shareLearningContentInTeam = gql`
  mutation shareLearningContentInTeam(
    $teamIds: [String]
    $contentId: String
    $note: String
  ) {
    shareLearningContentInTeam(
      teamIds: $teamIds
      contentId: $contentId
      note: $note
    ) {
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

export const unshareLearningContent = gql`
  mutation unshareLearningContent($contentId: String, $teamIds: [String]) {
    unshareLearningContent(contentId: $contentId, teamIds: $teamIds)
  }
`

export const setUsersLocation = gql`
  mutation setUsersLocation($location: String) {
    setUsersLocation(location: $location) {
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
    }
  }
`

export const setOrganizationLocations = gql`
  mutation setOrganizationLocations($locations: [String]) {
    setOrganizationLocations(locations: $locations)
  }
`
export const userAddLearningContent = gql`
  mutation userAddLearningContent($learningContentData: LearningContentInput!) {
    userAddLearningContent(inputData: $learningContentData) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const userEditLearningContent = gql`
  mutation userEditLearningContent(
    $learningContentData: LearningContentInput!
    $learningContentId: ID!
  ) {
    userEditLearningContent(
      inputData: $learningContentData
      learningContentId: $learningContentId
    ) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const userAddLearningContentPDF = gql`
  mutation userAddLearningContentPDF(
    $learningContentData: LearningContentInput!
  ) {
    userAddLearningContentPDF(inputData: $learningContentData) {
      ...LearningContentData
    }
  }
  ${LearningContent.fragments.LearningContentData}
`

export const deleteUserLearningContent = gql`
  mutation deleteUserLearningContent($learningContentId: ID!) {
    deleteUserLearningContent(learningContentId: $learningContentId)
  }
`

export const createReviewTemplate = gql`
  mutation createReviewTemplate($inputData: ReviewTemplateInput) {
    createReviewTemplate(inputData: $inputData)
  }
`
// export const setUseCustomFrameworks = gql`
//   mutation setUseCustomFrameworks($useCustomFrameworks: Boolean!) {
//     setUseCustomFrameworks(useCustomFrameworks: $useCustomFrameworks)
//   }
// `

export const modifyFrameworkForOrganization = gql`
  mutation modifyFrameworkForOrganization($inputData: AddFrameworkInput!) {
    modifyFrameworkForOrganization(inputData: $inputData) {
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

export const deleteFramework = gql`
  mutation deleteFramework($frameworkId: ID!) {
    deleteFramework(frameworkId: $frameworkId)
  }
`

export const deleteReviewTemplate = gql`
  mutation deleteReviewTemplate($templateId: ID!) {
    deleteReviewTemplate(templateId: $templateId)
  }
`

export const addGoalsToReview = gql`
  mutation addGoalsToReview($inputData: UserGoalInput!) {
    addGoalsToReview(inputData: $inputData) {
      ...ReviewData
    }
  }
  ${Reviews.fragments.ReviewData}
`

export const reviewGoals = gql`
  mutation reviewGoals($inputData: UserGoalResultInput!) {
    reviewGoals(inputData: $inputData) {
      _id
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
        skills {
          _id
          skillId
          skillName
          level
          related
        }
        measures {
          _id
          measureName
          completed
          successRate
        }
        feedback
        setBy
      }
      skillProgression {
        _id
        skillName
        oldValue
        newValue
      }
    }
  }
`

export const startReview = gql`
  mutation startReview($reviewId: ID!) {
    startReview(reviewId: $reviewId) {
      ...ReviewData
    }
  }
  ${Reviews.fragments.ReviewData}
`

export const closeReview = gql`
  mutation closeReview($reviewId: ID!, $goalIds: [ID]) {
    closeReview(reviewId: $reviewId, goalIds: $goalIds) {
      ...ReviewData
    }
  }
  ${Reviews.fragments.ReviewData}
`

export const updateGoal = gql`
  mutation updateGoal($inputData: GoalResultInput!) {
    updateGoal(inputData: $inputData) {
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
    }
  }
`
export const updateGoalRelatedSkills = gql`
  mutation updateGoalRelatedSkills($goalId: ID!, $skills: [ID]) {
    updateGoalRelatedSkills(goalId: $goalId, skills: $skills) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const generateUserFeedbackLinks = gql`
  mutation generateUserFeedbackLinks {
    generateUserFeedbackLinks {
      ...CurrentUserData
    }
  }
  ${User.fragments.CurrentUserData}
`

export const setDevelopmentPlan = gql`
  mutation setDevelopmentPlan($inputData: DevelopmentPlanInput!) {
    setDevelopmentPlan(inputData: $inputData) {
      ...GoalData
      isUserOnlyGoal
    }
  }
  ${Goal.fragments.GoalData}
`

export const setContentStatus = gql`
  mutation setContentStatus($status: String!, $contentId: ID!) {
    setContentStatus(status: $status, contentId: $contentId) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const draftGoals = gql`
  mutation draftGoals($goals: [SingleGoalInput]!) {
    draftGoals(goals: $goals) {
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
      autogenerated
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

export const setGoalStatus = gql`
  mutation setGoalStatus($goalId: ID!, $status: String!) {
    setGoalStatus(goalId: $goalId, status: $status) {
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
      isPrivate
      isUserOnlyGoal
      finishedPath {
        _id
        name
      }
      developmentPlan {
        ...DevelopmentPlanData
      }
    }
  }
  ${DevelopmentPlan.fragments.DevelopmentPlanData}
`

export const deleteGoal = gql`
  mutation deleteGoal($goalId: ID!) {
    deleteGoal(goalId: $goalId)
  }
`

export const recommendContent = gql`
  mutation recommendContent($userIds: [ID]!, $contentId: ID!) {
    recommendContent(userIds: $userIds, contentId: $contentId)
  }
`

export const userAddSkill = gql`
  mutation userAddSkill($inputData: SkillInput!) {
    userAddSkill(inputData: $inputData) {
      _id
      name
      slug
      category
      frameworkId
      orgFrameworkId
    }
  }
`

export const changeGoalPreferences = gql`
  mutation changeGoalPreferences($selectedGoalId: ID, $pathId: ID) {
    changeGoalPreferences(selectedGoalId: $selectedGoalId, pathId: $pathId)
  }
`

export const renameTeam = gql`
  mutation renameTeam($teamName: String!, $teamId: ID!) {
    renameTeam(teamName: $teamName, teamId: $teamId) {
      _id
      teamName
      slug
      active
      leader {
        _id
        firstName
        lastName
        email
        roles
        status
        roleAtWork
        imageLink
      }
      members {
        _id
        firstName
        lastName
        email
        roles
        status
        roleAtWork
        imageLink
      }
    }
  }
`

export const setCustomInvitationMessage = gql`
  mutation setCustomInvitationMessage(
    $customInvitationMessage: String
    $customInvitationEnabled: Boolean
  ) {
    setCustomInvitationMessage(
      customInvitationMessage: $customInvitationMessage
      customInvitationEnabled: $customInvitationEnabled
    ) {
      _id
      customInvitationMessage
      customInvitationEnabled
    }
  }
`
export const scheduleEvent = gql`
  mutation scheduleEvent(
    $userId: ID!
    $scheduledDate: DateTime!
    $reviewId: ID!
  ) {
    scheduleEvent(
      userId: $userId
      scheduledDate: $scheduledDate
      reviewId: $reviewId
    )
  }
`

export const promoteUser = gql`
  mutation promoteUser($userId: ID!) {
    promoteUser(userId: $userId) {
      status
      email
      roles
      firstName
      lastName
      _id
      roleAtWork
      teamInfo
      imageLink
      location
    }
  }
`

export const addRoleRequirements = gql`
  mutation addRoleRequirements($inputData: CreateRoleInput!) {
    addRoleRequirements(inputData: $inputData) {
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

export const deleteRoleGroup = gql`
  mutation deleteRoleGroup($groupId: String!) {
    deleteRoleGroup(groupId: $groupId)
  }
`

export const addRoleSuggestion = gql`
  mutation addRoleSuggestion($title: String!) {
    addRoleSuggestion(title: $title) {
      ...RoleData
    }
  }
  ${Roles.fragments.RoleData}
`

export const addRoleGroup = gql`
  mutation addRoleGroup($inputData: CreateRoleGroupInput!) {
    addRoleGroup(inputData: $inputData) {
      _id
      groupName
      relatedRoles {
        ...RoleData
      }
    }
  }
  ${Roles.fragments.RoleData}
`

export const approveGoals = gql`
  mutation approveGoals(
    $goals: [GoalApproveInput]!
    $deadline: DateTime
    $addReview: Boolean
    $user: ID!
  ) {
    approveGoals(
      goals: $goals
      deadline: $deadline
      addReview: $addReview
      user: $user
    )
  }
`

export const deleteOrganizationLearningPath = gql`
  mutation deleteOrganizationLearningPath($id: ID!) {
    deleteOrganizationLearningPath(id: $id) {
      ...LearningPathFullData
    }
  }
  ${LearningPath.fragments.LearningPathFullData}
`

export const createLearningPath = gql`
  mutation createLearningPath($input: LearningPathInput!) {
    createLearningPath(input: $input) {
      ...LearningPathFullData
    }
  }
  ${LearningPath.fragments.LearningPathFullData}
`
export const deleteLearningPathBanner = gql`
  mutation deleteLearningPathBanner($pathId: ID!, $key: String) {
    deleteLearningPathBanner(pathId: $pathId, key: $key)
  }
`

export const updateLearningPath = gql`
  mutation updateLearningPath(
    $input: LearningPathInput!
    $updateExisting: Boolean
  ) {
    updateLearningPath(input: $input, updateExisting: $updateExisting) {
      ...LearningPathFullData
    }
  }
  ${LearningPath.fragments.LearningPathFullData}
`

export const transformLearningPathToGoals = gql`
  mutation transformLearningPathToGoals(
    $id: ID!
    $targetUser: ID
    $forApproval: Boolean
  ) {
    transformLearningPathToGoals(
      id: $id
      targetUser: $targetUser
      forApproval: $forApproval
    ) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const transformLearningPathMultiple = gql`
  mutation transformLearningPathMultiple(
    $id: ID!
    $users: [ID!]
    $deadline: DateTime
    $addReview: Boolean
  ) {
    transformLearningPathMultiple(
      id: $id
      users: $users
      deadline: $deadline
      addReview: $addReview
    ) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const reviewFeedback = gql`
  mutation reviewFeedback($inputData: ReviewFeedbackInput!) {
    reviewFeedback(inputData: $inputData) {
      _id
      feedback
      skillProgression {
        _id
        skillName
        oldValue
        newValue
      }
    }
  }
`

export const requestUserFeedback = gql`
  mutation requestUserFeedback($userId: ID!, $teamId: ID) {
    requestUserFeedback(userId: $userId, teamId: $teamId) {
      ...FeedbackRequestData
    }
  }
  ${Feedback.fragments.FeedbackRequestData}
`

export const setFeedbackVisibility = gql`
  mutation setFeedbackVisibility($visible: Boolean) {
    setFeedbackVisibility(visible: $visible)
  }
`

export const editDisabledProfile = gql`
  mutation editDisabledProfile($inputData: UserProfileEditInput!) {
    editDisabledProfile(inputData: $inputData) {
      _id
      status
      email
      roles
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

export const inviteDisabledUser = gql`
  mutation inviteDisabledUser($userId: ID!, $deleteData: Boolean) {
    inviteDisabledUser(userId: $userId, deleteData: $deleteData)
  }
`

export const trackContentEvent = gql`
  mutation trackContentEvent($inputData: EventInput!) {
    trackContentEvent(inputData: $inputData)
  }
`

export const generateInviteLink = gql`
  mutation generateInviteLink {
    generateInviteLink {
      ...OrganizationData
    }
  }
  ${Organization.fragments.OrganizationData}
`

export const publicOnboardFromLink = gql`
  mutation publicOnboardFromLink($email: String!, $organizationId: ID!) {
    publicOnboardFromLink(email: $email, organizationId: $organizationId)
  }
`

export const toggleInviteLinkActive = gql`
  mutation toggleInviteLinkActive($active: Boolean) {
    toggleInviteLinkActive(active: $active) {
      ...OrganizationData
    }
  }
  ${Organization.fragments.OrganizationData}
`

export const createLearningGoal = gql`
  mutation createLearningGoal($goal: SingleGoalInput!) {
    createLearningGoal(goal: $goal) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const assessSkills = gql`
  mutation assessSkills($skills: [UserProfileSkillsInput]!) {
    assessSkills(skills: $skills) {
      user
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

export const requestLearningContent = gql`
  mutation requestLearningContent($contentId: ID!, $goalId: ID) {
    requestLearningContent(contentId: $contentId, goalId: $goalId) {
      ...RequestData
    }
  }
  ${Request.fragments.RequestData}
`

export const reviewContentRequest = gql`
  mutation reviewContentRequest(
    $approved: Boolean!
    $requestId: ID!
    $note: String
  ) {
    reviewContentRequest(
      approved: $approved
      requestId: $requestId
      note: $note
    ) {
      ...RequestData
    }
  }
  ${Request.fragments.RequestData}
`

export const toggleApprovalsForOrganization = gql`
  mutation toggleApprovalsForOrganization($approvals: Boolean) {
    toggleApprovalsForOrganization(approvals: $approvals) {
      _id
      approvals
    }
  }
`

export const toggleApprovalsForTeamLead = gql`
  mutation toggleApprovalsForTeamLead($teamLeadApprovals: Boolean) {
    toggleApprovalsForTeamLead(teamLeadApprovals: $teamLeadApprovals) {
      _id
      teamLeadApprovals
    }
  }
`

export const addContentToActiveGoal = gql`
  mutation addContentToActiveGoal(
    $contentId: ID!
    $contentType: String
    $price: Float
    $goalId: ID!
    $subscriptionAvailable: Boolean
  ) {
    addContentToActiveGoal(
      contentId: $contentId
      contentType: $contentType
      price: $price
      goalId: $goalId
      subscriptionAvailable: $subscriptionAvailable
    ) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const removeItemFromDevPlan = gql`
  mutation removeItemFromDevPlan($contentId: ID!) {
    removeItemFromDevPlan(contentId: $contentId) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const moveToSavedForLater = gql`
  mutation moveToSavedForLater($contentId: ID!) {
    moveToSavedForLater(contentId: $contentId) {
      ...GoalData
    }
  }
  ${Goal.fragments.GoalData}
`

export const disableApprovalPrompt = gql`
  mutation disableApprovalPrompt {
    disableApprovalPrompt {
      ...CurrentUserData
    }
  }
  ${User.fragments.CurrentUserData}
`

export const testMutation = gql`
  mutation testMutation {
    testMutation
  }
`

export const changeLearningPathsStatus = gql`
  mutation changeLearningPathsStatus($pathIds: [ID!], $value: Boolean!) {
    changeLearningPathsStatus(pathIds: $pathIds, value: $value) {
      ...LearningPathFullData
    }
  }
  ${LearningPath.fragments.LearningPathFullData}
`

export const generateTeamFeedbackLinks = gql`
  mutation generateTeamFeedbackLinks($teamId: ID) {
    generateTeamFeedbackLinks(teamId: $teamId) {
      ...TeamData
    }
  }
  ${Team.fragments.TeamData}
`

// export const generateExternalFeedbackLink = gql`
//   mutation generateExternalFeedbackLink {
//     generateExternalFeedbackLink
//   }
// `

// export const generateExternalTeamFeedbackLink = gql`
//   mutation generateExternalTeamFeedbackLink($teamId: ID) {
//     generateExternalTeamFeedbackLink(teamId: $teamId)
//   }
// `

export const publicSetUsersEvaluation = gql`
  mutation publicSetUsersEvaluation(
    $feedbackData: UserEvaluationInput!
    $personalData: UserRegisterInput!
  ) {
    publicSetUsersEvaluation(
      feedbackData: $feedbackData
      personalData: $personalData
    )
  }
`

export const requestLearningContentDelivery = gql`
  mutation requestLearningContentDelivery($contentId: ID!) {
    requestLearningContentDelivery(contentId: $contentId) {
      ...FulfillmentRequestData
    }
  }
  ${Request.fragments.FulfillmentRequestData}
`

export const addLearningItemFeedback = gql`
  mutation addLearningItemFeedback(
    $value: Int
    $interesting: Boolean
    $contentId: ID!
  ) {
    addLearningItemFeedback(
      value: $value
      interesting: $interesting
      contentId: $contentId
    )
  }
`

export const assignLearningPaths = gql`
  mutation assignLearningPaths($input: AssignLearningPathInput!) {
    assignLearningPaths(input: $input) {
      ...LearningPathFullData
    }
  }
  ${LearningPath.fragments.LearningPathFullData}
`

export const assignLearningPathsLeader = gql`
  mutation assignLearningPathsLeader($input: AssignLearningPathInput!) {
    assignLearningPathsLeader(input: $input) {
      ...LearningPathFullData
    }
  }
  ${LearningPath.fragments.LearningPathFullData}
`

export const createComment = gql`
  mutation createComment($inputData: CommentInput!) {
    createComment(inputData: $inputData) {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`

export const createReply = gql`
  mutation createComment($inputData: CommentInput!) {
    createComment(inputData: $inputData) {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`

export const editComment = gql`
  mutation editComment($inputData: CommentEditInput!) {
    editComment(inputData: $inputData) {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`

export const editReply = gql`
  mutation editComment($inputData: CommentEditInput!) {
    editComment(inputData: $inputData) {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`

export const likeComment = gql`
  mutation likeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`

export const deleteComment = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      ...CommentData
    }
  }
  ${Comments.fragments.CommentData}
`
export const declineInvitation = gql`
  mutation declineInvitation($eventId: ID!) {
    declineInvitation(_id: $eventId) {
      _id
      title
      description
      scheduleFromDate
      scheduleToDate
      eventType
      isOnedayEvent
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
    }
  }
`

export const acceptInvitation = gql`
  mutation acceptInvitation($eventId: ID!) {
    acceptInvitation(_id: $eventId) {
      _id
      title
      description
      scheduleFromDate
      scheduleToDate
      eventType
      isOnedayEvent
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
    }
  }
`
export const createEvent = gql`
  mutation createEvent($input: CreateEventInput!) {
    createEvent(inputData: $input) {
      ...EventData
    }
  }
  ${Events.fragments.EventData}
`
export const editEvent = gql`
  mutation editEvent($input: EditEventInput!) {
    editEvent(inputData: $input) {
      ...EventData
    }
  }
  ${Events.fragments.EventData}
`
export const deleteEvent = gql`
  mutation deleteEvent($eventId: ID!) {
    deleteEvent(_id: $eventId) {
      _id
    }
  }
`

export const publicEvent = gql`
  mutation publicEvent($eventId: ID!) {
    publicEvent(_id: $eventId) {
      ...EventData
    }
  }
  ${Events.fragments.EventData}
`
export const deleteEventImage = gql`
  mutation deleteEventImage($eventId: ID!, $key: String) {
    deleteEventImage(_id: $eventId, key: $key)
  }
`
