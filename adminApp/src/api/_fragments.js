import gql from 'graphql-tag'

export const User = {
  fragments: {
    EmployeeBasicData: gql`
      fragment EmployeeBasicData on Employees {
        _id
        status
        email
        roles
        firstName
        lastName
        registeredFrom
        roleAtWork
        inbound {
          _id
          path
        }
      }
    `,
    MemberData: gql`
      fragment MemberData on Member {
        _id
        firstName
        lastName
        email
        roles
        status
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
          name
        }
      }
    `
  }
}

export const Team = {
  fragments: {
    TeamBasicData: gql`
      fragment TeamBasicData on Team {
        _id
        teamName
        slug
        leader {
          ...MemberData
        }
        members {
          ...MemberData
        }
        active
        recommendedPaths {
          _id
          name
        }
      }
      ${User.fragments.MemberData}
    `
  }
}
const DurationData = gql`
  fragment DurationData on Duration {
    _id
    basis
    hoursMin
    hoursMax
    hours
    weeks
    minutes
  }
`

const LearningContentGradeRatingData = gql`
  fragment LearningContentGradeRatingData on LearningContentGradeRating {
    _id
    grade
    count
    countRatio
    interesting
    uninteresting
  }
`

export const LearningContent = {
  fragments: {
    LearningContentData: gql`
      fragment LearningContentData on LearningContent {
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
        duration {
          ...DurationData
        }
        certified
        german
        externalRating
        nOfReviews
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
        imageLink
        spider
        averageRating
      }
      ${DurationData}
    `,
    LearningContentEditData: gql`
      fragment LearningContentEditData on LearningContentEditType {
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
        duration {
          ...DurationData
        }
        certified
        german
        externalRating
        nOfReviews
        relatedPrimarySkills {
          value
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
        imageLink
        selectedSecondarySkills {
          key
          value
          skillId
          _id
        }
        selectedInterests {
          key
          value
          _id
        }
        selectedIndustries {
          key
          value
          _id
        }
        selectedPrimarySkills {
          key
          value
          _id
          skillId
          skillLevel
          importance
        }
      }
      ${DurationData}
    `,
    LearningContentRatingData: gql`
      fragment LearningContentRatingData on LearningContentRating {
        _id
        contentId
        average
        count
        rating {
          ...LearningContentGradeRatingData
        }
      }
      ${LearningContentGradeRatingData}
    `,
    LearningContentGradeRatingData
  }
}

export const Organization = {
  fragments: {
    OrganizationBasicDataOriginal: gql`
      fragment OrganizationBasicData on Organization {
        _id
        organizationName
        admins
        slug
        disabled
        premium
        corporate
        fulfillment
        technicians
        isPayingOrganization
        isDemoOrganization
        size
        locations
        industry
        neededSkillsEnabled
        disabledNeededSkills {
          _id
          name
        }
        employees {
          ...EmployeeBasicData
        }
        teams {
          ...TeamBasicData
        }
      }
      ${Team.fragments.TeamBasicData}
      ${User.fragments.EmployeeBasicData}
    `,
    OrganizationBasicData: gql`
      fragment OrganizationBasicData on Organization {
        _id
        organizationName
        admins
        slug
        disabled
        premium
        isPayingOrganization
        isDemoOrganization
        size
        locations
        industry
        neededSkillsEnabled
        corporate
        fulfillment
        technicians
        events
      }
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
          category
        }
        content {
          _id
          content {
            _id
            title
            type
            relatedPrimarySkills {
              _id
              name
              skillLevel
              importance
            }
            price {
              _id
              value
              currency
            }
          }
          note
          order
        }
      }
    `
  }
}

export const DevelopmentPlan = {
  fragments: {
    DevelopmentPlanData: gql`
      fragment DevelopmentPlanData on DevelopmentPlan {
        _id
        content {
          _id
          content {
            ...LearningContentData
          }
          status
          fulfillmentRequest {
            _id
          }
        }
        mentors {
          ...RelevantUserData
        }
      }
      ${LearningContent.fragments.LearningContentData}
      ${User.fragments.RelevantUserData}
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
        status
        measures {
          _id
          measureName
        }
        relatedSkills {
          _id
          name
          category
        }
        owner {
          _id
          firstName
          lastName
          email
        }
        fromPath {
          _id
          name
        }
        isPrivate
        developmentPlan {
          ...DevelopmentPlanData
        }
      }
      ${DevelopmentPlan.fragments.DevelopmentPlanData}
    `
  }
}

const SkillCountData = gql`
  fragment SkillCountData on SkillCount {
    _id
    name
    employeesCount
  }
`

const LearningContentStatisticsData = gql`
  fragment LearningContentStatisticsData on LearningContentStatistics {
    _id
    title
    type
    contentId
    notStartedCount
    inProgressCount
    completedCount
  }
`
const LearningGoalStatisticsData = gql`
  fragment LearningGoalStatisticsData on LearningGoalStatistics {
    _id
    name
    goalId
    inProgressCount
    completedCount
    learningContentStatistics {
      ...LearningContentStatisticsData
    }
  }
  ${LearningContentStatisticsData}
`
export const Stats = {
  fragments: {
    GrowthData: gql`
      fragment GrowthData on FetchStatsGrowthData {
        _id
        skillsPeopleHave {
          ...SkillCountData
        }
        mostNeededSkills {
          ...SkillCountData
        }
        interests {
          ...SkillCountData
        }
      }
      ${SkillCountData}
    `,
    SkillCountData,
    LearningPathStatisticsData: gql`
      fragment LearningPathStatisticsData on LearningPathStatistics {
        _id
        name
        learningPathId
        inProgressCount
        completedCount
        learningGoalStatistics {
          ...LearningGoalStatisticsData
        }
      }
      ${LearningGoalStatisticsData}
      ${LearningContentStatisticsData}
    `,
    LearningGoalStatisticsData,
    LearningContentStatisticsData
  }
}
export const Roles = {
  fragments: {
    RoleData: gql`
      fragment RoleData on RoleRequirements {
        _id
        title
        description
        nextSteps {
          _id
          title
        }
        createdAt
        coreSkills {
          level
          value
          _id
          fullSkill {
            _id
            name
            slug
            category
          }
        }
        secondarySkills {
          level
          value
          _id
          fullSkill {
            _id
            name
            slug
            category
          }
        }
        organization {
          _id
          organizationName
        }
      }
    `
  }
}

export const ContentSource = {
  fragments: {
    ContentSourceData: gql`
      fragment ContentSourceData on ContentSource {
        _id
        name
        slug
        enabled
        affiliate
        baseUrls
        createdAt
        updatedAt
        certText
        subscription
        iconSource
        tags
        accountRequired
      }
    `
  }
}

export const FulfillmentRequest = {
  fragments: {
    FulfillmentRequestData: gql`
      fragment FulfillmentRequestData on FulfillmentRequest {
        _id
        content {
          _id
          title
          url
          price {
            _id
            value
            currency
          }
          source {
            _id
            name
          }
        }
        user {
          ...EmployeeBasicData
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
      ${User.fragments.EmployeeBasicData}
    `
  }
}
export const LearningPath = {
  fragments: {
    LearningPathStatisticsListData: gql`
      fragment LearningPathStatisticsListData on PathTemplateContent {
        _id
        ...LearningPathStatisticsData
      }

      ${Stats.fragments.LearningPathStatisticsData}
    `,
    LearningPathListData: gql`
      fragment LearningPathListData on LearningPath {
        _id
        name
        description
        updatedAt
        active
        targetGroup
        abstract
        duration
        prerequisites
        publishedDate
        imageLink
        internalNotes
        author
        authorDescription
        authorPosition
        authorImageLink
        authorCompanyLogoImageLink
        trending
        organization {
          _id
          organizationName
        }
        goalTemplate {
          ...GoalTemplateListData
        }
        startConditions
      }
      ${GoalTemplate.fragments.GoalTemplateListData}
    `,
    LearningPathDetails: gql`
      fragment LearningPathDetails on LearningPath {
        _id
        description
        category
        abstract
        duration
        publishedDate
        goalTemplate {
          ...GoalTemplateListData
        }
      }
      ${GoalTemplate.fragments.GoalTemplateListData}
    `
  }
}
