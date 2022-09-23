import gql from 'graphql-tag'

export const User = {
  fragments: {
    EmployeeData: gql`
      fragment EmployeeData on Employees {
        _id
        firstName
        lastName
        status
        email
        roles
        roleAtWork
        teamInfo
        imageLink
        location
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
    `,
    EmployeeDataWithoutImage: gql`
      fragment EmployeeDataWithoutImage on Employees {
        _id
        firstName
        lastName
        status
        email
        roles
        roleAtWork
        teamInfo
        location
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
    `,
    MemberDataWithoutImage: gql`
      fragment MemberDataWithoutImage on Member {
        _id
        firstName
        lastName
        status
        email
        roles
        roleAtWork
        location
        neededSkills {
          _id
          name
        }
        selectedSkills {
          _id
          name
          level
        }
      }
    `,

    MemberData: gql`
      fragment MemberData on Member {
        _id
        firstName
        lastName
        status
        email
        roles
        roleAtWork
        imageLink
        location
        neededSkills {
          _id
          name
        }
        selectedSkills {
          _id
          name
          level
        }
      }
    `,
    RelevantUserData: gql`
      fragment RelevantUserData on RelevantUser {
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
    `,
    CurrentUserData: gql`
      fragment CurrentUserData on User {
        _id
        firstName
        lastName
        email
        organizationName
        hasEvent
        leader
        roles
        status
        imageLink
        location
        isReviewer
        feedbackLink
        isDemoUser
        premium
        approvals
        approvalPromptDisabled
        approvalLink
        pendingFeedbackRequests
        corporate
        publicLink {
          _id
          link
          active
        }
        fulfillment
        technician
        noPaid
        hasTeams
      }
    `,
    OnboardingUserData: gql`
      fragment OnboardingUserData on User {
        _id
        firstName
        lastName
        email
        roles
        leader
        organizationName
        roleAtWork
        roleId
        selectedWorkSkills {
          category
          level
          name
          slug
          skillId
          _id
          frameworkId
        }
        corporate
        approvals
        status
        noPaid
      }
    `
  }
}

export const Team = {
  fragments: {
    TeamData: gql`
      fragment TeamData on Team {
        _id
        teamName
        slug
        active
        createdAt
        leader {
          ...MemberData
        }
        members {
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
      ${User.fragments.MemberData}
    `,
    TeamDetailsData: gql`
      fragment TeamDetailsData on Team {
        _id
        teamName
        slug
        active
        createdAt
        totalMembers
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
      ${User.fragments.MemberData}
    `,
    SmallerTeamData: gql`
      fragment SmallerTeamData on Team {
        _id
        teamName
        slug
        active
        createdAt
        leader {
          _id
        }
        members {
          _id
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
    `,
    TeamDataWithoutImage: gql`
      fragment TeamDataWithoutImage on Team {
        _id
        teamName
        slug
        active
        createdAt
        leader {
          ...MemberDataWithoutImage
        }
        members {
          ...MemberDataWithoutImage
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
      ${User.fragments.MemberDataWithoutImage}
    `,

    TeamShortData: gql`
      fragment TeamShortData on Team {
        _id
        teamName
        slug
        active
        createdAt
      }
    `,
    TeamEvaluatedSkillData: gql`
      fragment TeamEvaluatedSkillData on TeamEvaluatedSkill {
        _id
        skillId
        name
        skillAvailable
        skillNeeded
      }
    `,
    TeamEvaluatedSkillUserData: gql`
      fragment TeamEvaluatedSkillUserData on TeamEvaluatedSkillUser {
        _id
        userId
        name
        level
      }
    `,
    TeamPathStatisticsData: gql`
      fragment TeamPathStatisticsData on TeamPathStatistics {
        _id
        pathId
        pathName
        assignedTo {
          _id
          firstName
          lastName
          status
          userId
          imageLink
        }
      }
    `
  }
}

const ContentSourceData = gql`
  fragment ContentSourceData on ContentSource {
    _id
    name
    slug
    baseUrls
    createdAt
    updatedAt
    certText
    subscription
    iconSource
  }
`

const DurationData = gql`
  fragment DurationData on Duration {
    _id
    basis
    hoursMin
    hoursMax
    hours
    minutes
    weeks
  }
`

export const LearningContent = {
  fragments: {
    LearningContentData: gql`
      fragment LearningContentData on LearningContent {
        _id
        url
        source {
          ...ContentSourceData
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
          frameworkId
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
        startDate
        createdAt
        newContent
        clicked
        canUnshare
        canShare
        canAddToGoal
        inDevelopmentPlan
        needsApproval
        sharedIn
        recommended
        liked
        disliked
        recommended
        recommendedBy {
          _id
          firstName
          lastName
          imageLink
        }
        duration {
          ...DurationData
        }
        recommendedAt
        certified
        imageLink
        uploadedBy {
          _id
          firstName
          lastName
          email
        }
        availableWithSubscription
        organizationSpecific
      }
      ${ContentSourceData}
      ${DurationData}
    `,
    DevelopmentPlanLearningContentData: gql`
      fragment DevelopmentPlanLearningContentData on DevelopmentPlanLearningContent {
        _id
        contentId
        name
        type
        price
        source {
          _id
          name
          baseUrls
          iconSource
        }
        status
      }
    `
  }
}

export const Request = {
  fragments: {
    RequestData: gql`
      fragment RequestData on Request {
        _id
        content {
          ...LearningContentData
        }
        user {
          ...EmployeeData
        }
        goal {
          _id
          goalName
        }
        approved
        note
        reviewedBy {
          ...EmployeeData
        }
        createdAt
        reviewedAt
        requestURL
      }
      ${LearningContent.fragments.LearningContentData}
      ${User.fragments.EmployeeData}
    `,
    FulfillmentRequestData: gql`
      fragment FulfillmentRequestData on FulfillmentRequest {
        _id
        content {
          ...LearningContentData
        }
        user {
          ...EmployeeData
        }
        fulfilled
        note
        createdAt
        reviewedAt
        learningCredentials {
          _id
          email
          password
        }
      }
      ${LearningContent.fragments.LearningContentData}
      ${User.fragments.EmployeeData}
    `
  }
}

const DevelopmentPlanContentData = gql`
  fragment DevelopmentPlanContentData on DevelopmentPlanContent {
    _id
    content {
      ...LearningContentData
    }
    status
    approved
    goalId
    goalName
    goalCompleted
    goalEnds
    startDate
    endDate
    setBy
    request {
      ...RequestData
    }
    fulfillmentRequest {
      _id
      fulfilled
      note
      reviewedAt
      learningCredentials {
        _id
        email
        password
      }
    }
    note
    order
  }
  ${LearningContent.fragments.LearningContentData}
  ${User.fragments.EmployeeData}
  ${Request.fragments.RequestData}
`

const DevelopmentPlanPathData = gql`
  fragment DevelopmentPlanPathData on DevelopmentPlanLearningPath {
    _id
    pathId
    name
    status
    assignedBy {
      _id
      userId
      name
    }
    stats {
      _id
      inProgressCount
      completedCount
      notStartedCount
    }
  }
`

export const DevelopmentPlan = {
  fragments: {
    DevelopmentPlanData: gql`
      fragment DevelopmentPlanData on DevelopmentPlan {
        _id
        content {
          ...DevelopmentPlanContentData
        }
        mentors {
          ...RelevantUserData
        }
        selectedGoalId
      }
      ${DevelopmentPlanContentData}
      ${User.fragments.RelevantUserData}
    `,
    DevelopmentPlanContentData,
    DevelopmentPlanPathData,
    DevelopmentPlanStatsData: gql`
      fragment DevelopmentPlanStatsData on DevelopmentPlanStats {
        _id
        path {
          ...DevelopmentPlanPathData
        }
        content {
          ...DevelopmentPlanLearningContentData
        }
      }
      ${DevelopmentPlanPathData}
      ${LearningContent.fragments.DevelopmentPlanLearningContentData}
    `
  }
}

export const GoalTemplate = {
  fragments: {
    GoalTemplateListData: gql`
      fragment GoalTemplateListData on GoalTemplate {
        _id
        goalName
        goalType
        measures
        relatedSkills {
          _id
          name
        }
        content {
          _id
          content {
            ...LearningContentData
          }
          note
          order
        }
        mentors {
          ...RelevantUserData
        }
      }
      ${User.fragments.RelevantUserData}
      ${LearningContent.fragments.LearningContentData}
    `
  }
}

const LearningPathFullData = gql`
  fragment LearningPathFullData on LearningPath {
    _id
    name
    description
    updatedAt
    targetGroup
    prerequisites
    abstract
    duration
    publishedDate
    imageLink
    author
    authorImageLink
    trending
    organization {
      _id
      organizationName
    }
    team {
      _id
      teamName
    }
    goalTemplate {
      ...GoalTemplateListData
    }
    createdAt
    active
    skills {
      _id
      name
    }
    userProgress {
      _id
      status
    }
    startConditions
    paid
    autoAssign
    assignee {
      _id
      everyone
      autoassign
      teams {
        _id
        team {
          _id
          teamName
        }
        autoassign
        users {
          _id
          firstName
          lastName
          email
        }
      }
      users {
        _id
        firstName
        lastName
        email
      }
    }
    curatedBy {
      _id
      userId
      name
    }
  }
  ${GoalTemplate.fragments.GoalTemplateListData}
`

const LearningPathManageData = gql`
  fragment LearningPathManageData on LearningPath {
    _id
    name
    description
    updatedAt
    targetGroup
    prerequisites
    abstract
    duration
    publishedDate
    imageLink
    author
    authorImageLink
    trending
    organization {
      _id
      organizationName
    }
    team {
      _id
      teamName
    }
    goalTemplate {
      _id
      goalName
    }
    createdAt
    active
    skills {
      _id
      name
    }
    startConditions
    paid
    autoAssign
    assignee {
      _id
      everyone
      autoassign
      teams {
        _id
        team {
          _id
          teamName
        }
        autoassign
        users {
          _id
          firstName
          lastName
          email
        }
      }
      users {
        _id
        firstName
        lastName
        email
      }
    }
    curatedBy {
      _id
      userId
      name
    }
  }
`

export const LearningPath = {
  fragments: {
    LearningPathListData: gql`
      fragment LearningPathListData on LearningPath {
        _id
        name
        abstract
        duration
        updatedAt
        targetGroup
        prerequisites
        publishedDate
        imageLink
        author
        authorImageLink
        trending
        paid
        organization {
          _id
          organizationName
        }
        team {
          _id
          teamName
        }
        skills {
          _id
          name
          contentCount
          skillId
          slug
        }
        createdAt
        recommendedToTeams {
          _id
          teamName
        }
        userProgress {
          _id
          status
        }
      }
    `,
    LearningPathFullData,
    LearningPathManageData,
    LearningPathEditData: gql`
      fragment LearningPathEditData on LearningPath {
        _id
        name
        description
        imageLink
        updatedAt
        duration
        team {
          _id
          teamName
        }
        goalTemplate {
          ...GoalTemplateListData
        }
        skills {
          _id
          name
        }
      }
      ${GoalTemplate.fragments.GoalTemplateListData}
    `,
    TeamLearningPathsData: gql`
      fragment TeamLearningPathsData on TeamLearningPaths {
        _id
        teamId
        teamName
        learningPaths {
          ...LearningPathManageData
        }
      }
      ${LearningPathManageData}
    `
  }
}

export const Goal = {
  fragments: {
    GoalData: gql`
      fragment GoalData on Goal {
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
        user
        reviewId
        createdAt
        endsAt
        autogenerated
        developmentPlan {
          ...DevelopmentPlanData
        }
        fromPath {
          _id
          name
          targetGroup
        }
        learningPathIndex
        isSelectedGoal
      }
      ${DevelopmentPlan.fragments.DevelopmentPlanData}
    `
  }
}

export const Skills = {
  fragments: {
    SkillData: gql`
      fragment SkillData on Skill {
        slug
        _id
        name
        category
        frameworkId
        contentCount
        mandatory
        skillId
        organizationSpecific
      }
    `,
    SkillChartInfo: gql`
      fragment SkillChartInfo on SkillDetailsData {
        _id
        name
        skillAvailable
        skillNeeded
      }
    `
  }
}

export const Onboarding = {
  fragments: {
    OnboardingInfoData: gql`
      fragment OnboardingInfoData on OnboardingInfo {
        onboarded
        firstAdmin
        userDetailsProvided
        skillsToEvaluate {
          ...SkillData
        }
        shortOnboarding
        technicianOnboarding
        hasAssignedPath
      }
      ${Skills.fragments.SkillData}
    `
  }
}

export const Feedback = {
  fragments: {
    TextFeedbackData: gql`
      fragment TextFeedbackData on TextFeedback {
        _id
        evaluatedBy {
          _id
          firstName
          lastName
          imageLink
          email
          isPlatformUser
        }
        evaluated {
          _id
          teamId
          firstName
          lastName
          imageLink
          email
        }
        evaluatedAt
        content
        skills {
          _id
          skillId
          name
          level
        }
      }
    `,
    FeedbackRequestData: gql`
      fragment FeedbackRequestData on FeedbackRequest {
        _id
        requestedFrom {
          ...EmployeeData
        }
        requestedBy {
          ...EmployeeData
        }
        requestedTeam {
          ...TeamData
        }
        requestedAt
        feedbackShareKey
      }
      ${User.fragments.EmployeeData}
      ${Team.fragments.TeamData}
    `
  }
}

export const Organization = {
  fragments: {
    OrganizationData: gql`
      fragment OrganizationData on Organization {
        _id
        organizationName
        createdAt
        admins
        slug
        feedbackVisible
        approvals
        teamLeadApprovals

        disabledNeededSkills {
          _id
          name
        }
        locations
        employees {
          ...EmployeeData
        }
        totalEmployees
        teams {
          ...TeamData
        }
        inviteLink {
          link
          active
        }
      }
      ${Team.fragments.TeamData}
      ${User.fragments.EmployeeData}
    `,
    OrganizationDataWithoutImages: gql`
      fragment OrganizationDataWithoutImages on Organization {
        _id
        organizationName
        createdAt
        admins
        slug
        feedbackVisible
        approvals
        teamLeadApprovals

        disabledNeededSkills {
          _id
          name
        }
        locations

        teams {
          ...TeamDataWithoutImage
        }
        inviteLink {
          link
          active
        }
      }
      ${Team.fragments.TeamDataWithoutImage}
    `,
    SmallerOrganizationData: gql`
      fragment SmallerOrganizationData on Organization {
        _id
        locations
        feedbackVisible
        approvals
        teamLeadApprovals
        totalEmployees
        teams {
          createdAt
          _id
          teamName
          leader {
            _id
          }
          totalMembers
        }
      }
    `
  }
}

export const Roles = {
  fragments: {
    RoleData: gql`
      fragment RoleData on RoleRequirements {
        _id
        title
        userId
        createdAt
        description
        suggestion
        grouped
        suggestedBy
        nextSteps {
          _id
          title
        }
        coreSkills {
          level
          _id
          fullSkill {
            ...SkillData
          }
        }
        secondarySkills {
          level
          _id
          fullSkill {
            ...SkillData
          }
        }
      }
      ${Skills.fragments.SkillData}
    `
  }
}

export const AdminDashboard = {
  fragments: {
    MostPopularResourcesData: gql`
      fragment MostPopularResourcesData on PopularResource {
        qty
        type
        users
        _id
      }
    `,
    ActivityData: gql`
      fragment ActivityData on Activity {
        learningCompleted
        learningStarted
        xAxis
      }
    `,
    TopInDemandData: gql`
      fragment TopInDemandData on TopInDemand {
        mostNeededSkills {
          _id
          name
          employeesCount
        }
      }
    `
  }
}

export const LeaderDashboard = {
  fragments: {
    MostPopularResourcesData: gql`
      fragment MostPopularResourcesData on PopularResource {
        qty
        type
        users
        _id
      }
    `,
    ActivityData: gql`
      fragment ActivityData on Activity {
        learningCompleted
        learningStarted
        xAxis
      }
    `
  }
}

export const Filters = {
  fragments: {
    FilterData: gql`
      fragment FilterData on Filters {
        _id
        skillPrefs {
          ...SingleFilterData
        }
        extraSkillPrefs {
          ...SingleFilterData
        }
        languagePref {
          ...SingleFilterData
        }
        pricePref {
          ...SingleFilterData
        }
        priceRangePref {
          ...PriceRangeData
        }
        sourcePrefs {
          ...SingleFilterData
        }
        durationPref {
          ...DurationFilterData
        }
        typePrefs {
          ...SingleFilterData
        }
        levelPref {
          ...SingleFilterData
        }
        certPref {
          ...SingleFilterData
        }
        subscriptionPref {
          ...SingleFilterData
        }
      }

      fragment SingleFilterData on SingleFilter {
        _id
        name
        count
      }
      fragment DurationFilterData on DurationFilter {
        _id
        count
        minHours
        maxHours
      }

      fragment PriceRangeData on PriceRange {
        lowestPrice
        highestPrice
      }
    `
  }
}

export const Reviews = {
  fragments: {
    ReviewData: gql`
      fragment ReviewData on Review {
        _id
        name
        startsAt
        closedAt
        status
        progressChecks
        scope
        reviewers
        hasResult
        unreviewedGoals
      }
    `
  }
}

export const RecommendedSkills = {
  fragments: {
    RecommendedSkillsData: gql`
      fragment RecommendedSkillsData on RecommendedSkill {
        _id
        skillId
        name
      }
    `
  }
}

export const Stats = {
  fragments: {
    SkillCountData: gql`
      fragment SkillCountData on SkillCount {
        _id
        name
        employeesCount
      }
    `
  }
}

const CommentMainInfo = gql`
  fragment CommentMainInfo on Comment {
    _id
    path {
      _id
      name
      userProgress {
        _id
        status
      }
    }
    user {
      _id
      firstName
      lastName
      imageLink
    }
    content
    likes
    accepted
    resolved
    createdAt
    abstract
  }
`

export const Comments = {
  fragments: {
    CommentData: gql`
      fragment CommentData on Comment {
        ...CommentMainInfo
        replies {
          ...CommentMainInfo
          replies {
            ...CommentMainInfo
          }
        }
      }
      ${CommentMainInfo}
    `,
    CommentMainInfo
  }
}

export const Events = {
  fragments: {
    EventData: gql`
      fragment EventData on Event {
        _id
        title
        eventType
        format
        scheduleFromDate
        scheduleToDate
        isOnedayEvent
        creater {
          _id
          firstName
          lastName
        }
        invitations {
          _id
          firstName
          lastName
          status
        }
      }
    `,
    EventMainData: gql`
      fragment EventMainData on Event {
        _id
        title
        eventType
        format
        scheduleFromDate
        scheduleToDate
        isOnedayEvent
        creater {
          _id
          firstName
          lastName
        }
        imageLink
      }
    `
  }
}
