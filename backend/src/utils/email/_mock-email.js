import { User, Organization } from '~/models'
import {
  onboardingReminderTemplate,
  activateGoalsReminder,
  reviewSchedulingReminder,
  reviewPreparationReminder,
  reviewClosingReminder,
  setUpDevPlanReminder,
  leaderApproveGoalsNotification,
  leaderTeamProgressNotification,
  learningPathNotification,
  recommendedContentNotification,
  sharedContentNotification,
  weeklyContentNotification,
  userGoalsApprovedNotification,
  firstInvitationTemplate,
  feedbackNotification,
  learningPathRequestedNotification,
  learningPathAssignedNotification,
  userLearningApprovalNotification,
  adminApprovalsReminder,
  deliveryFulfilledNotification,
  registrationTemplate,
  questionAskedNotification,
  questionReplyNotification,
  commentLikedNotification
} from './'
import appUrls from '../_app-urls'
import sendEmail from './_send-email'
import {
  feedbackRequestNotification,
  teamFeedbackNotification,
  teamRequiredSkillsNotification
} from './_email-templates'
// import {
//   mapContentToTemplate,
//   mapContentToSharedEmail,
//   mapContentToRecommendationEmail
// } from '../../config/jobs/utils'
import getUsersForNotification from '../../components/User/user-data/utils/_getUsersForNotification'

const appLink = appUrls['user']

const feedback = `
  Feedback Feedback Feedback Feedback Feedback Feedback 
  Feedback Feedback Feedback Feedback Feedback Feedback 
  Feedback Feedback Feedback Feedback Feedback Feedback 
  Feedback Feedback Feedback Feedback Feedback Feedback 
`

const placeholderSkills = ['Javascript', 'Effective communication']

const activeGoalPlaceholder = {
  pathName: 'LEARNING PATH PLACEHOLDER'
}

const placeholderContent = [
  {
    _id: '555555555555555555555553',
    title: 'PLACEHOLDER CONTENT 1',
    paid: true,
    type: 'E-LEARNING',
    source: 'Udemy', // string
    level: 'BEGINNER', // enum
    link: 'https://placeholder.content', // raw link
    skills: ['Javascript', 'React'], // array of strings
    sharedBy: null, // object { _id, name }
    appLink, // string
    recommended: true // bool
  },
  {
    _id: '555555555555555555555554',
    title: 'PLACEHOLDER CONTENT 2',
    paid: false,
    type: 'ARTICLE',
    source: 'Medium', // string
    link: 'https://placehold3r.content', // raw link
    skills: ['Effective communication', 'Team building'], // array of strings
    sharedBy: {
      _id: '555555555555555555555552',
      name: 'PLACEHOLDER USER',
      imgLink:
        'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
    }, // object { _id, name }
    appLink, // string
    recommended: null // bool
  }
]

const placeholderApprovalContent = [
  {
    _id: '555555555555555555555553',
    title: 'PLACEHOLDER CONTENT 1',
    paid: true,
    type: 'E-LEARNING',
    source: 'Udemy', // string
    level: 'BEGINNER', // enum
    link: 'https://placeholder.content', // raw link
    skills: ['Javascript', 'React'], // array of strings
    sharedBy: {
      _id: '555555555555555555555552',
      name: 'PLACEHOLDER USER',
      imgLink:
        'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
    }, // object { _id, name }
    appLink, // string
    recommended: null, // bool
    approved: true,
    request: true,
    note: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia, arcu at mattis ultrices, diam mi ultrices tellus, sit amet auctor massa nunc sed turpis. Cras porttitor, libero vel consequat mattis, nibh risus pretium mauris, et tristique tellus ipsum id ligula. Maecenas tempor, metus luctus placerat consectetur, nulla nunc ornare dolor, at interdum sapien metus a nulla. Etiam rutrum mauris ac sem maximus viverra. Suspendisse maximus, tortor eu tempor ultricies, justo est bibendum nibh, sed laoreet augue turpis nec turpis. Donec tristique, diam sit amet porta ullamcorper, purus sapien lobortis libero, vel fermentum ex lectus eu neque. Mauris eu eros nibh. Nam nibh odio, porttitor quis faucibus vitae, porta et enim. Nulla non viverra arcu.
    `
  },
  {
    _id: '555555555555555555555554',
    title: 'PLACEHOLDER CONTENT 2',
    paid: false,
    type: 'ARTICLE',
    source: 'Medium', // string
    link: 'https://placehold3r.content', // raw link
    skills: ['Effective communication', 'Team building'], // array of strings
    sharedBy: {
      _id: '555555555555555555555552',
      name: 'PLACEHOLDER USER',
      imgLink:
        'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
    }, // object { _id, name }
    appLink, // string
    recommended: null, // bool
    approved: false,
    request: true,
    note: ''
  }
]

const placeholderUsersAndGoals = [
  {
    _id: '555555555555555555555556',
    name: 'PLACEHOLDER USER 1',
    roleAtWork: 'PLACEHOLDER ROLE 1',
    goals: ['PLACEHOLDER GOAL 1', 'PLACEHOLDER GOAL 2'],
    activeGoal: activeGoalPlaceholder,
    imgLink:
      'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
  },
  {
    _id: '555555555555555555555557',
    name: 'PLACEHOLDER USER 2',
    roleAtWork: 'PLACEHOLDER ROLE 2',
    goals: ['PLACEHOLDER GOAL 1'],
    activeGoal: activeGoalPlaceholder,
    imgLink:
      'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
  }
]

const placeholderUsers = [
  {
    name: 'John Doe',
    roleAtWork: 'Dev',
    imgLink:
      'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
  },
  {
    name: 'John Doe King the 2nd',
    roleAtWork: 'Dev',
    imgLink:
      'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
  },
  {
    name: 'John Doe',
    roleAtWork: 'Dev',
    imgLink:
      'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
  },
  {
    name: 'John Doe',
    roleAtWork: 'Dev',
    imgLink:
      'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
  }
]

const placeholderTeams = [
  {
    _id: '555555555555555555555559',
    teamName: 'Team Alpha',
    users: placeholderUsersAndGoals
  },
  {
    _id: '555555555555555555555521',
    teamName: 'Team Bravo',
    users: placeholderUsersAndGoals
  }
]

const emailDataByType = {
  LPPROGRESSSTARTED: {
    template: learningPathNotification,
    subject: 'The beginning of your Learning Path',
    args: {
      activePath: activeGoalPlaceholder,
      goals: ['ACTIVE', 'ACTIVE'],
      status: 'NOT STARTED',
      nextResource: {
        _id: '555555555555555555555555',
        title: 'PLACEHOLDER CONTENT 1',
        type: 'E-LEARNING',
        source: 'Udemy',
        link: 'http://placeholder.content',
        skills: ['Effective communication', 'Team building'], // array of strings
        appLink, // string
        delivery: true
      },
      appLink
    }
  },
  LPPROGRESSCOMPLETED: {
    template: learningPathNotification,
    subject: 'The next step in your Learning Path',
    args: {
      activePath: activeGoalPlaceholder,
      goals: ['PAST', 'SELECTED', 'ACTIVE'],
      status: 'COMPLETED',
      nextResource: {
        _id: '555555555555555555555555',
        title: 'PLACEHOLDER CONTENT 1',
        type: 'E-LEARNING',
        source: 'Udemy',
        link: 'http://placeholder.content',
        skills: ['Effective communication', 'Team building'], // array of strings
        appLink, // string
        delivery: true
      },
      appLink
    }
  },
  LEARNINGPATHASSIGN: {
    template: learningPathNotification,
    subject: 'PLACEHOLDER just assigned a Learning Path to you',
    args: {
      activePath: activeGoalPlaceholder,
      goals: ['ACTIVE', 'ACTIVE'],
      status: 'NOT STARTED',
      nextResource: {
        _id: '555555555555555555555555',
        title: 'PLACEHOLDER CONTENT 1',
        type: 'E-LEARNING',
        source: 'Udemy',
        link: 'http://placeholder.content',
        skills: ['Effective communication', 'Team building'], // array of strings
        appLink, // string
        delivery: true
      },
      appLink
    }
  },
  USERPROGRESS: {
    template: learningPathNotification,
    subject: 'Your Learning Path progress',
    args: {
      activePath: activeGoalPlaceholder,
      goals: ['SELECTED', 'ACTIVE'],
      status: 'IN PROGRESS',
      nextResource: {
        _id: '555555555555555555555555',
        title: 'PLACEHOLDER CONTENT 1',
        type: 'E-LEARNING',
        source: 'Udemy',
        link: 'http://placeholder.content',
        skills: ['Effective communication', 'Team building'], // array of strings
        appLink, // string
        delivery: true
      },
      appLink
    }
  },
  TEAMPROGRESS: {
    template: leaderTeamProgressNotification,
    subject: 'Team progress weekly check-in',
    args: {
      teams: placeholderTeams,
      appLink
    }
  },
  DEVPLANREMINDER: {
    template: setUpDevPlanReminder,
    subject: 'Action required: set up your development plan!',
    args: {
      name: ({ firstName }) => firstName,
      content: placeholderContent,
      appLink
    }
  },
  ACTIVATEGOALS: {
    template: activateGoalsReminder,
    subject: 'Action required: activate your goals!',
    args: {
      name: '[NAME]',
      goalsSet: () => Math.random() > 0.5,
      appLink
    }
  },
  PREPAREDRAFTS: {
    template: reviewPreparationReminder,
    subject:
      "Action required: you don't have all meetings scheduled for your review",
    args: {
      name: '[NAME]',
      reviewName: 'PLACEHOLDER REVIEW',
      reviewer: 'PLACEHOLDER REVIEWER',
      hasPreviousGoals: () => Math.random() > 0.5,
      appLink
    }
  },
  SCHEDULEREVIEW: {
    template: reviewSchedulingReminder,
    subject: 'Action required: review starting soon!',
    args: {
      name: '[NAME]',
      reviewName: 'PLACEHOLDER REVIEW',
      reviewId: '555555555555555555555555',
      users: placeholderUsers,
      appLink
    }
  },
  CLOSEREVIEW: {
    template: reviewClosingReminder,
    subject: 'Action required: are you done reviewing?',
    args: {
      name: '[NAME]',
      reviewName: 'PLACEHOLDER REVIEW',
      appLink
    }
  },
  WEEKLYCONTENT: {
    template: weeklyContentNotification,
    subject: 'New learning available at Innential',
    args: {
      usersSkills: placeholderSkills,
      topWeeklyContent: placeholderContent,
      topPaidContent: placeholderContent,
      appLink
    }
  },
  SHAREDCONTENT: {
    template: sharedContentNotification,
    subject: `Your team's top shared learning at Innential`,
    args: {
      topSharedContent: [
        {
          name: 'PLACEHOLDER TEAM',
          content: placeholderContent
        }
      ],
      appLink
    }
  },
  RECOMMENDEDCONTENT: {
    template: recommendedContentNotification,
    subject: 'You have new recommendations',
    args: {
      name: '[NAME]',
      recommendedBy: 'PLACEHOLDER LEADER',
      content: placeholderContent,
      appLink
    }
  },
  ONBOARDINGREMINDER: {
    template: onboardingReminderTemplate,
    subject: 'Reminder to onboard',
    args: {
      pendingInvitation: '555555555555555555555555',
      appLink
    }
  },
  LEADERGOALSREADY: {
    template: leaderApproveGoalsNotification,
    subject: "Action required: Your teammates' goals are awaiting approval!",
    args: {
      name: '[NAME]',
      usersAndGoals: placeholderUsersAndGoals,
      // usersAndGoalsInReview: placeholderUsersAndGoals,
      appLink
    }
  },
  GOALSAPPROVED: {
    template: userGoalsApprovedNotification,
    subject: 'Your goals have been reviewed',
    args: {
      name: '[NAME]',
      reviewer: 'PLACEHOLDER REVIEWER',
      goalsApproved: [
        { goalName: 'PLACEHOLDER GOAL 1' },
        {
          goalName: 'PLACEHOLDER GOAL 2',
          note: `
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia, arcu at mattis ultrices, diam mi ultrices tellus, sit amet auctor massa nunc sed turpis. Cras porttitor, libero vel consequat mattis, nibh risus pretium mauris, et tristique tellus ipsum id ligula. Maecenas tempor, metus luctus placerat consectetur, nulla nunc ornare dolor, at interdum sapien metus a nulla. Etiam rutrum mauris ac sem maximus viverra. Suspendisse maximus, tortor eu tempor ultricies, justo est bibendum nibh, sed laoreet augue turpis nec turpis. Donec tristique, diam sit amet porta ullamcorper, purus sapien lobortis libero, vel fermentum ex lectus eu neque. Mauris eu eros nibh. Nam nibh odio, porttitor quis faucibus vitae, porta et enim. Nulla non viverra arcu.
        `
        }
      ],
      goalsDisapproved: [
        { goalName: 'PLACEHOLDER GOAL 1', note: 'PLACEHOLDER NOTE 1' },
        {
          goalName: 'PLACEHOLDER GOAL 2',
          note: `
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia, arcu at mattis ultrices, diam mi ultrices tellus, sit amet auctor massa nunc sed turpis. Cras porttitor, libero vel consequat mattis, nibh risus pretium mauris, et tristique tellus ipsum id ligula. Maecenas tempor, metus luctus placerat consectetur, nulla nunc ornare dolor, at interdum sapien metus a nulla. Etiam rutrum mauris ac sem maximus viverra. Suspendisse maximus, tortor eu tempor ultricies, justo est bibendum nibh, sed laoreet augue turpis nec turpis. Donec tristique, diam sit amet porta ullamcorper, purus sapien lobortis libero, vel fermentum ex lectus eu neque. Mauris eu eros nibh. Nam nibh odio, porttitor quis faucibus vitae, porta et enim. Nulla non viverra arcu.
        `
        }
      ],
      deadline: new Date(),
      appLink
    }
  },
  REQUESTSREVIEWED: {
    template: userLearningApprovalNotification,
    subject: 'Your approval requests have been reviewed',
    args: {
      appLink,
      delivery: true,
      content: placeholderApprovalContent,
      name: '[NAME]'
    }
  },
  LEARNINGDELIVERED: {
    template: deliveryFulfilledNotification,
    subject: 'Your learning has arrived!',
    args: {
      appLink,
      item: {
        _id: '555555555555555555555555',
        title: 'PLACEHOLDER CONTENT 1',
        type: 'E-LEARNING',
        source: 'Udemy',
        link: 'http://placeholder.content',
        skills: ['Effective communication', 'Team building'], // array of strings
        appLink, // string
        delivery: true
      },
      name: '[NAME]'
    }
  },
  REQUESTSREMINDER: {
    template: adminApprovalsReminder,
    subject: 'Action required: There are learning items to approve',
    args: {
      appLink,
      users: placeholderUsers.map(user => ({
        ...user,
        total: 88.88,
        nItems: 69
      })),
      name: '[NAME]'
    }
  },
  FIRSTINVITATION: {
    MOCK: {
      template: firstInvitationTemplate,
      subject: 'You have been invited to join Innential',
      args: {
        appUrl: appLink,
        invitation: '555555555555555555555555',
        invitingPerson: null,
        organizationName: '[ORGANIZATION]',
        users: placeholderUsers
      }
    },
    REAL: {
      template: firstInvitationTemplate,
      subject: 'You have been invited to join Innential',
      args: {
        appUrl: appLink,
        invitation: async user => getPendingInvitationForUser(user),
        invitingPerson: null,
        organizationName: async user =>
          getOrganizationName(user.organizationId),
        users: user => {
          return getOrganizationUsersExceptUser(user)
        }
      }
    }
  },
  FIRSTINVITATIONCORPORATE: {
    template: firstInvitationTemplate,
    subject: 'PLACEHOLDER invited you to join Innential',
    args: {
      appUrl: appLink,
      invitation: '555555555555555555555555',
      invitingPerson: {
        name: '[NAME]',
        roleAtWork: '[ROLE]',
        imgLink: null
      },
      organizationName: '[ORGANIZATION]',
      corporate: true,
      users: placeholderUsers
    }
  },
  FEEDBACKNOTIFICATION: {
    template: feedbackNotification,
    subject: 'PLACEHOLDER just gave you feedback',
    args: {
      appLink,
      name: '[NAME]',
      userId: '',
      from: 'PLACEHOLDER COLLEAGUE',
      feedback
    }
  },
  TEAMREQUIREDSKILLSCHANGE: {
    template: teamRequiredSkillsNotification,
    subject: `ACTION REQUIRED: There's been a change of required skills in your team`,
    args: {
      name: '[NAME]',
      teamName: '[TEAMNAME]',
      appLink
    }
  },
  TEAMFEEDBACK: {
    template: teamFeedbackNotification,
    subject: `[USER] just gave feedback to your team`,
    args: {
      name: '[NAME]',
      teamName: '[TEAMNAME]',
      teamId: '',
      from: '[USER]',
      feedback,
      appLink
    }
  },
  FEEDBACKREQUEST: {
    template: feedbackRequestNotification,
    subject: `[USER] just requested feedback`,
    args: {
      name: '[NAME]',
      from: '[USER]',
      feedbackShareKey: '',
      appLink
    }
  },
  LEARNINGPATHREQUEST: {
    template: learningPathRequestedNotification,
    subject: 'PLACEHOLDER just requested a learning path',
    args: {
      appLink,
      name: '[NAME]',
      userId: '',
      from: {
        firstName: 'PLACEHOLDER',
        lastName: 'COLLEAGUE'
      },
      pathName: 'PLACEHOLDER PATH'
    }
  },
  REGISTRATION: {
    template: registrationTemplate,
    subject: 'Your registration is complete',
    args: {
      appLink,
      invitation: '555555555555555555555555'
    }
  },
  QUESTIONPOSTED: {
    template: questionAskedNotification,
    subject: '[PLACEHOLDER] just asked a question in a learning path',
    args: {
      pathId: '555555555555555555555555',
      pathname: '[PLACEHOLDER PATH]',
      abstract: '[PLACEHOLDER QUESTION]',
      content: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia, arcu at mattis ultrices, diam mi ultrices tellus, sit amet auctor massa nunc sed turpis. Cras porttitor, libero vel consequat mattis, nibh risus pretium mauris, et tristique tellus ipsum id ligula. Maecenas tempor, metus luctus placerat consectetur, nulla nunc ornare dolor, at interdum sapien metus a nulla. Etiam rutrum mauris ac sem maximus viverra. Suspendisse maximus, tortor eu tempor ultricies, justo est bibendum nibh, sed laoreet augue turpis nec turpis. Donec tristique, diam sit amet porta ullamcorper, purus sapien lobortis libero, vel fermentum ex lectus eu neque. Mauris eu eros nibh. Nam nibh odio, porttitor quis faucibus vitae, porta et enim. Nulla non viverra arcu.
      `,
      user: {
        _id: '555555555555555555555552',
        name: 'PLACEHOLDER USER',
        imgLink:
          'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
      },
      appLink,
      name: '[NAME]'
    }
  },
  REPLYPOSTED: {
    template: questionReplyNotification,
    subject: '[PLACEHOLDER] just posted an answer to your question',
    args: {
      content: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia, arcu at mattis ultrices, diam mi ultrices tellus, sit amet auctor massa nunc sed turpis. Cras porttitor, libero vel consequat mattis, nibh risus pretium mauris, et tristique tellus ipsum id ligula. Maecenas tempor, metus luctus placerat consectetur, nulla nunc ornare dolor, at interdum sapien metus a nulla. Etiam rutrum mauris ac sem maximus viverra. Suspendisse maximus, tortor eu tempor ultricies, justo est bibendum nibh, sed laoreet augue turpis nec turpis. Donec tristique, diam sit amet porta ullamcorper, purus sapien lobortis libero, vel fermentum ex lectus eu neque. Mauris eu eros nibh. Nam nibh odio, porttitor quis faucibus vitae, porta et enim. Nulla non viverra arcu.
      `,
      user: {
        _id: '555555555555555555555552',
        name: 'PLACEHOLDER USER',
        imgLink:
          'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
      },
      appLink,
      name: '[NAME]'
    }
  },
  COMMENTLIKED: {
    template: commentLikedNotification,
    subject: '[PLACEHOLDER] just liked your comment',
    args: {
      content: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia, arcu at mattis ultrices, diam mi ultrices tellus, sit amet auctor massa nunc sed turpis. Cras porttitor, libero vel consequat mattis, nibh risus pretium mauris, et tristique tellus ipsum id ligula. Maecenas tempor, metus luctus placerat consectetur, nulla nunc ornare dolor, at interdum sapien metus a nulla. Etiam rutrum mauris ac sem maximus viverra. Suspendisse maximus, tortor eu tempor ultricies, justo est bibendum nibh, sed laoreet augue turpis nec turpis. Donec tristique, diam sit amet porta ullamcorper, purus sapien lobortis libero, vel fermentum ex lectus eu neque. Mauris eu eros nibh. Nam nibh odio, porttitor quis faucibus vitae, porta et enim. Nulla non viverra arcu.
      `,
      user: {
        _id: '555555555555555555555552',
        name: 'PLACEHOLDER USER',
        imgLink:
          'https://innential-production.s3.eu-central-1.amazonaws.com/email/nobody.jpg'
      },
      appLink,
      name: '[NAME]',
      isReply: false,
      pathId: '555555555555555555555252'
    }
  }
}

const getOrganizationName = async organizationId => {
  const organization = await Organization.findById(organizationId)
    .select({ organizationName: 1 })
    .lean()
  return organization.organizationName
}

const getOrganizationUsers = async organizationId => {
  return getUsersForNotification({ organizationId })
}

const getOrganizationUsersExceptUser = async user => {
  const users = await getOrganizationUsers(user.organizationId)
  return users.filter(u => String(u._id) !== String(user._id))
}

const getPendingInvitationForUser = async user => {
  if (user.status !== 'invited') {
    throwError(400, 'User is already active')
  }

  if (user.invitation) {
    const pending = user.invitation.pendingInvitation

    if (pending && pending.length > 0) {
      return pending
    } else {
      throwError(500, 'Something went wrong')
    }
  } else {
    throwError(500, 'Something went wrong')
  }
}

const fetchTemplateDataForType = async (type, user, mock) => {
  // if email data type contains MOCK/REAL properties, then use them.
  // otherwise, use regular (mock) object as fallback
  const emailData = emailDataByType[type]
  const { args: rawArgs, template, subject } = emailData['MOCK']
    ? mock
      ? emailData['MOCK']
      : emailData['REAL']
    : emailData

  let args = {}

  await Promise.all(
    Object.entries(rawArgs).map(async ([key, value]) => {
      if (typeof value === 'function') {
        args[key] = await value(user)
      } else args[key] = value
    })
  )

  return {
    args,
    template,
    subject
  }
}

const throwError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  throw error
}

export default async ({ email, type, mock }) => {
  if (email.length === 0) throwError(400, 'Email not provided')
  if (type === null) throwError(400, 'Notification type not provided')

  const user = await User.findOne({
    email,
    status: { $in: ['active', 'invited', 'not-onboarded'] }
  })
    .select({
      _id: 1,
      firstName: 1,
      organizationId: 1,
      invitation: 1,
      status: 1
    })
    .lean()

  if (!mock && !user) {
    throwError(404, 'User not found')
  }

  const { subject, args, template } = await fetchTemplateDataForType(
    type,
    user,
    mock
  )

  try {
    await sendEmail(email, subject, template({ ...args }))
  } catch (e) {
    throwError(500, e.message)
  }
}
