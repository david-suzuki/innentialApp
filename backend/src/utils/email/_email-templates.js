import { sendEmail } from './'
import {
  mapContentToRegularTemplate,
  mapDigestItem,
  mapRowGreyText,
  mapRowBlackText,
  mapButton,
  mapUnscheduledUsers,
  // mapRowNeutral,
  mapUserGoals,
  mapUserItem,
  mapActivePath,
  mapUserSkills,
  mapInvitationMessage,
  mapFeedback,
  mapUserRequestItem,
  mapInvitationUsers,
  mapDivider,
  mapNoteParagraph
} from './templates'
// import { OrganizationSettings } from '../../models'

/* THESE FUNCTIONS RETURN THE RAW FORM OF THE STRING TO BE SENT BY SENDGRID */
/* IN THIS FILE, YOU CAN CHANGE THE EMAIL COPY OR ADD ADDITIONAL TEMPLATES  */
/* TO CHANGE THE ACTUAL HTML OF THE EMAIL, GO TO  _mapContentToTemplate.js  */

const ctaByType = {
  ARTICLE: 'Read article',
  VIDEO: 'Watch video',
  BOOK: 'Start reading',
  'E-LEARNING': 'Go to course',
  PODCAST: 'Start listening',
  default: 'Begin'
}

const capitalize = str => {
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export const questionAskedNotification = ({
  pathId,
  questionId,
  pathname,
  abstract,
  content,
  user,
  appLink,
  name
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Question in Learning Path',
    header: `Hello ${name}!`,
    content: `
      ${mapRowBlackText(user.name, '24px')}
      ${mapRowGreyText('just asked a question in the path: ')}
      ${mapRowBlackText(pathname, '24px')}
      ${mapRowBlackText(abstract, '18px', undefined, 'left')}
      ${mapNoteParagraph({ content })}
      ${mapButton({
        text: 'Answer question',
        link: `${appLink}/learning-path/${pathId}?q=${questionId}`
      })}
    `
  })

export const questionReplyNotification = ({
  content,
  user,
  appLink,
  name,
  replyId
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Reply to Question',
    header: `Hello ${name}!`,
    content: `
        ${mapRowBlackText(user.name, '24px')}
        ${mapRowGreyText('just replied to your question: ')}
        ${mapNoteParagraph({ content })}
        ${mapButton({
          text: 'Reply or Like',
          link: `${appLink}/learning-paths/discussions?r=${replyId}`
        })}
      `
  })

export const commentLikedNotification = ({
  content,
  user,
  appLink,
  name,
  isReply,
  pathId,
  commentId
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Comment Liked',
    header: `Hello ${name}!`,
    content: `
        ${mapRowGreyText(`Good job!`)}
        ${mapRowBlackText(user.name, '24px')}
        ${mapRowGreyText(`just liked your ${isReply ? 'reply' : 'question'}: `)}
        ${mapNoteParagraph({ content })}
        ${mapButton({
          text: 'See on path',
          link: `${appLink}/learning-path/${pathId}?${
            isReply ? 'r' : 'q'
          }=${commentId}`
        })}
      `
  })

export const deliveryFulfilledNotification = ({ item, appLink, name }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Learning Item Delivery',
    header: `Hello ${name}`,
    content: `
      ${mapRowGreyText(`
        The ${
          item.type ? item.type.toLowerCase() : 'learning'
        } you requested was delivered:
      `)}
      ${mapDigestItem({
        appLink,
        lastChild: true,
        ...item
      })}
      ${mapRowBlackText(`Here's how to access it: `)}
      ${mapRowGreyText(`
        <ol style="text-align: left;">
          <li>Go to your Active Paths in Innential</li>
          <li>Find the requested content in your learning path</li>
          <li>Click on <strong>"${ctaByType[item.type] ||
            ctaByType.default}"</strong></li>
          <li>Follow the provided instructions</li>
        </ol>
        <br/>
      `)}
      ${mapButton({
        text: 'Go to Active Paths',
        link: appLink
      })}
    `
  })

export const deliveryRequestedNotification = ({
  firstName,
  lastName,
  email,
  title,
  link
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Delivery Requested',
    header: 'New fulfillment request',
    content: `
      ${mapRowBlackText(`${firstName} ${lastName} (${email})`)}
      ${mapRowGreyText(`
        has just requested an item:
      `)}
      ${mapRowBlackText(title)}
      ${mapRowGreyText(`
        It can be viewed in the admin dashboard:
      `)}
      ${mapButton({
        text: 'See request',
        link
      })}
    `
  })

export const adminApprovalsReminder = ({
  name,
  users,
  // usersAndGoalsInReview,
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Leader Goal Approval',
    // title: 'Your teammates have pending goals',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`
        Some of your teammates requested content purchase.
      `)}
      ${
        users.length > 0
          ? `
        ${mapRowBlackText(`
          Click on a user to go to their approval page:
        `)}
        ${users
          .map(
            (user, i, array) => `
              ${mapUserRequestItem({
                appLink,
                lastChild: i + 1 === array.length,
                ...user
              })}
            `
          )
          .join(' ')}
      `
          : ''
      }
      ${mapButton({
        text: 'Go to Innential',
        link: `${appLink}`
      })}
    `
  })

export const userLearningApprovalNotification = ({
  name,
  content,
  delivery,
  appLink
}) => {
  const approvedContent = content.filter(content => content.approved)
  const contentToDeliver = approvedContent.filter(content => content.paid)

  return mapContentToRegularTemplate({
    metaEmailTitle: 'Goals Approval',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('Your learning item requests have been reviewed')}
      ${
        approvedContent.length > 0
          ? mapRowBlackText(
              delivery && contentToDeliver.length > 0
                ? `The Innential team will soon buy and deliver the ${
                    contentToDeliver.length > 1
                      ? 'content'
                      : capitalize(contentToDeliver[0].type)
                  } to you!`
                : 'You can now start working on your development plan!'
            )
          : ''
      }
      ${content
        .map((item, i, array) =>
          mapDigestItem({
            appLink,
            lastChild: i + 1 === array.length,
            ...item
          })
        )
        .join('')}
      ${mapButton({
        text: 'Go to Innential',
        link: appLink
      })}
    `
  })
}

export const newBootcampUserTemplate = ({
  email,
  nBootcamps,
  name,
  background,
  education,
  contact,
  bootcamps, // [{ bootcamp, source, startsAt }]
  criteria /* {
    isGermanResident
    isAgenturSigned
    startsAt
    language
    format
    location
    remote
  } */,
  codingExperience,
  feedback,
  changeProfession
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New User Captured',
    header: 'New capture',
    content: `
      ${mapRowBlackText(`
        A user just registered their email:
      `)}
      ${mapRowBlackText(`${name} (${email})`)}
      ${mapRowBlackText(
        nBootcamps > 0
          ? `They matched with ${nBootcamps} bootcamp${
              nBootcamps > 1 ? 's' : ''
            }: `
          : `They did not match with any bootcamps!`
      )}
      ${
        nBootcamps > 0
          ? mapRowGreyText(`
          <ul>
            ${bootcamps
              .map(
                ({ bootcamp, source, startsAt }) =>
                  `<li>${source} ${bootcamp}, starting ${new Date(
                    startsAt
                  ).toDateString()}</li>`
              )
              .join('')}
          </ul>
        `)
          : ''
      }
      ${
        nBootcamps > 0 && contact
          ? mapRowBlackText(
              `And asked to be put in contact with the admissions manager`
            )
          : ''
      }
      ${mapRowGreyText(`
        User requested a bootcamp for the following criteria:<br/>
        <ul>
          <li>Starting not before ${new Date(
            criteria.startsAt
          ).toDateString()}</li>
          <li>Location: ${criteria.location}</li>
          <li>Languages: ${criteria.language.join(', ')}</li>
          <li>Format: ${criteria.format}</li>
          <li>Remote preference: ${criteria.remote}</li>
          <li>User is ${
            !criteria.isGermanResident ? '<strong>not </strong>' : ''
          }a German resident, and is ${
        !criteria.isAgenturSigned ? '<strong>not </strong>' : ''
      }registered with Agentur fur Arbeit</li>
        </ul>
      `)}
      ${mapRowGreyText(
        `User background: ${background}; User education level: ${education}`
      )}
      ${
        codingExperience
          ? mapRowGreyText(`User coding experience: ${codingExperience}`)
          : ''
      }
      ${
        changeProfession
          ? mapRowGreyText(`User plans for his career: ${changeProfession}`)
          : ''
      }
      ${feedback ? mapRowGreyText(`Additional feedback: ${feedback}`) : ''}
    `
  })

export const emailConfirmationBootcampTemplate = ({
  key,
  resultId,
  micrositeLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Email Results',
    header: "You're almost there!",
    content: `
      ${mapRowGreyText(`
        Use the button below to view your matched bootcamps:
      `)}
      ${mapButton({
        link: `${micrositeLink}/result/${resultId}?verify=${key}`,
        text: 'See your results'
      })}
      ${mapRowGreyText(`
        Or copy-paste this link into your browser:
      `)}
      ${mapRowGreyText(`${micrositeLink}/result/${resultId}?verify=${key}`)}
    `,
    compassBranding: true
  })

export const organizationRegisteredNotification = ({
  organizationName,
  firstName,
  lastName,
  slug,
  organizationId,
  adminAppLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Organization Registered',
    header: 'New user',
    content: `
      ${mapRowBlackText(`${firstName} ${lastName}`)}
      ${mapRowGreyText(`
        has just registered
      `)}
      ${mapRowBlackText(organizationName)}
      ${mapRowGreyText(`
        To Innential
      `)}
      ${mapButton({
        text: `See the organization's page`,
        link: `${adminAppLink}/organizations/${slug}/${organizationId}`
      })}
    `
  })

export const registrationTemplate = ({ invitation, appLink }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Registration Completion',
    header: 'Welcome to Innential',
    content: `
      ${mapRowGreyText(`
        You've successfully signed up to Innential.<br/>
        To get started, <strong>set up your profile!</strong>
      `)}
      ${mapButton({
        text: 'Set up your profile',
        link: `${appLink}/acceptinvitation/${invitation}`
      })}
      ${mapRowBlackText(`
        <br/>Or you can book a quick introduction call with us and learn more how Innential can help your teams!
      `)}
      ${mapButton({
        text: 'Book a call',
        link: 'https://calendly.com/innential/30min'
      })}
      ${mapRowGreyText(`
        <br/>All the best,
      `)}
      ${mapRowBlackText(`
        Innential Team
      `)}
    `
  })

export const feedbackRequestNotification = ({
  name,
  from: { firstName, lastName },
  appLink,
  teamName,
  feedbackShareKey
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Feedback Request Notification',
    // title: "You don't have a dev plan yet",
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowBlackText(`${firstName} ${lastName}`, '18px')}
      ${
        teamName
          ? `
        ${mapRowGreyText('just requested feedback for their team:')}
        ${mapRowBlackText(teamName, '18px')}
        `
          : mapRowGreyText(`
          just requested personal feedback from you!
        `)
      }
      <br/>
      ${mapRowGreyText(`
        Follow the link and take a few minutes<br/>
        to give your feedback to ${teamName ? 'the team' : firstName}
      `)}
      <br/>
      ${mapButton({
        text: 'Go to Innential',
        link: `${appLink}/feedback/${feedbackShareKey}`
      })}
    `
  })

export const learningPathRequestedNotification = ({
  name,
  from: { firstName, lastName },
  pathName,
  userId,
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Learning Path Request Notification',
    // title: "You don't have a dev plan yet",
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowBlackText(`${firstName} ${lastName}`, '18px')}
      ${mapRowGreyText(`
        requested to start a learning path:
      `)}
      ${mapRowBlackText(pathName, '22px')}
      ${mapRowGreyText(`
        Take a minute to review the material and<br/>
        give your approval
      `)}
      ${mapButton({
        text: 'Go to Innential',
        link: `${appLink}/goals/approve/${userId}?firstName=${firstName}`
      })}
    `
  })

export const learningPathAssignedNotification = ({
  name,
  from,
  pathName,
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Learning Path Assignment Notification',
    // title: "You don't have a dev plan yet",
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowBlackText(from, '18px')}
      ${mapRowGreyText(`
        assigned a learning path to you:
      `)}
      ${mapRowBlackText(pathName, '22px')}
      ${mapRowGreyText(`
        You can begin working on the learning path from your Active Paths page!
      `)}
      ${mapButton({
        text: 'Go to Innential',
        link: `${appLink}/?product_tour_id=197146`
      })}
    `
  })

export const feedbackNotification = ({ name, from, appLink, feedback }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Feedback Notification',
    // title: "You don't have a dev plan yet",
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`
        You just received feedback${from ? ' from' : ''}
      `)}
      ${from ? mapRowBlackText(from, '18px') : ''}
      ${feedback ? mapFeedback(feedback) : ''}
      ${mapRowGreyText(`
        For more details, check out your feedback page<br/>
        at Innential:
      `)}
      ${mapButton({
        text: 'Go to Innential',
        link: `${appLink}/feedback-page`
      })}
    `
  })

export const teamRequiredSkillsNotification = ({ name, teamName, appLink }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Team Required Skills Changed',
    // title: "You don't have a dev plan yet",
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`
        There's been a change of required skills in your team:
      `)}
      ${mapRowBlackText(teamName, '18px')}
      ${mapRowGreyText(`
        Please take a minute to check your profile<br/>
        for any new skills to self-evaluate.
      `)}
      ${mapButton({
        text: 'Go to Innential',
        link: `${appLink}/profile`
      })}
    `
  })

export const teamFeedbackNotification = ({
  name,
  teamName,
  teamId,
  from,
  appLink,
  feedback
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Team Feedback Notification',
    // title: "You don't have a dev plan yet",
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`
        Your team:
      `)}
      ${mapRowBlackText(teamName, '18px')}
      ${mapRowGreyText(`
        just received feedback${from ? ' from' : ''}
      `)}
      ${from ? mapRowBlackText(from, '18px') : ''}
      ${feedback ? mapFeedback(feedback) : ''}
      ${mapRowGreyText(`
        For more details, check out your team's feedback page<br/>
        at Innential:
      `)}
      ${mapButton({
        text: 'Go to Innential',
        link: `${appLink}/team/${teamId}?tab=feedback`
      })}
    `
  })

export const userGoalsApprovedNotification = ({
  name,
  reviewer,
  goalsApproved,
  goalsDisapproved,
  deadline,
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Goals Approval',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('Your goals have been reviewed by')}
      ${mapRowBlackText(reviewer, '24px')}
      ${
        goalsApproved.length > 0
          ? mapRowBlackText(
              'These goals have been accepted. You can now start working on your development plan!'
            )
          : ''
      }
      ${
        deadline
          ? `
          ${mapRowGreyText(
            `Deadline for completing ${goalsApproved.length} goals: `
          )}
          ${mapRowBlackText(`${new Date(deadline).toDateString()}`, '18px')}
        `
          : ''
      }
      ${goalsApproved.map(goal =>
        mapUserGoals({ goals: [goal], lastChild: true, noMargin: true })
      )}
      ${mapButton({
        text: 'Go to Innential',
        link: appLink
      })}
      ${
        goalsDisapproved.length > 0
          ? mapRowBlackText(
              'These goals have not been approved, and have been reverted to draft status: '
            )
          : ''
      }
      ${goalsDisapproved.map(goal =>
        mapUserGoals({ goals: [goal], lastChild: true, noMargin: true })
      )}
      ${
        goalsDisapproved.length > 0
          ? mapButton({
              text: 'Go to your goals page',
              link: `${appLink}/goals`
            })
          : ''
      }
    `
  })

export const leaderTeamProgressNotification = ({ teams, appLink }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Your Weekly Team Progress',
    header: `Check your ${teams.length > 1 ? "teams'" : "team's"} progress`,
    content: `
      ${teams
        .map(
          ({ _id: teamId, teamName, users }, i, array) => `
          ${
            array.length > 1
              ? mapRowBlackText(teamName, '15px', 'bold', 'left')
              : ''
          }
          ${users
            .map(
              ({ activeGoal, goals, ...user }, j, userArray) => `
            ${mapUserItem({ ...user, appLink, activeGoals: goals })}
            ${mapActivePath({
              label: 'Currently working on: ',
              lastChild: j + 1 === userArray.length,
              appLink,
              ...activeGoal
            })}
          `
            )
            .join(' ')}
          ${mapButton({
            text: 'Go to team',
            link: `${appLink}/team/${teamId}`
          })}
        `
        )
        .join(' ')}
    `
  })

export const learningPathNotification = ({
  nextResource,
  activePath,
  goals = [],
  status,
  appLink
}) => {
  const headers = {
    'NOT STARTED': 'Your new Learning Path!',
    'IN PROGRESS': 'Check your Learning Path progress',
    COMPLETED: 'Your next steps in the Learning Path'
  }

  const cta = {
    'NOT STARTED': 'Start learning',
    'IN PROGRESS': 'Continue learning',
    COMPLETED: 'Continue learning'
  }

  const text = cta[status]

  const header = headers[status]

  const pathId = activePath.pathId ? activePath.pathId : ''

  return mapContentToRegularTemplate({
    metaEmailTitle: 'Your Weekly Path Progress',
    header,
    content: `
      ${mapActivePath({
        label: `Your ${
          status === 'NOT STARTED' ? 'new' : 'current'
        } learning path: `,
        lastChild: true,
        appLink,
        goals,
        ...activePath
      })}
      <br/>
      ${mapRowBlackText(
        `Your ${status === 'IN PROGRESS' ? 'current' : 'next'} resource`,
        '14px',
        'bold',
        'left'
      )}
      ${mapDigestItem({
        appLink,
        lastChild: true,
        ...nextResource
      })}
      ${mapButton({
        text,
        link: `${appLink}?learner=true&path=${pathId}`
      })}
    `
  })
}
export const recommendedContentNotification = ({
  content,
  appLink,
  name,
  recommendedBy
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Your Recommended Learning',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`There is new recommended learning from: `)}
      ${mapRowBlackText(recommendedBy, '18px')}
      ${mapRowBlackText('Take a look at the list below: ')}
      ${content
        .map(
          (item, i, array) => `
        ${mapDigestItem({
          appLink,
          lastChild: i + 1 === array.length,
          ...item
        })}
      `
        )
        .join(' ')}
      ${mapButton({
        text: 'See more learning at Innential',
        link: `${appLink}/quick-search`
      })}
    `
  })

export const sharedContentNotification = ({
  name,
  topSharedContent = [],
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Your Weekly Shared Learning',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('There is new learning being shared in your teams.')}
      ${mapRowBlackText('Take a look at the list below: ')}
      ${topSharedContent
        .map(
          ({ name, content }) => `
        ${mapRowBlackText(name, '18px', 'bold', 'left')}
        ${content
          .map(
            (item, i, array) => `
          ${mapDigestItem({
            appLink,
            lastChild: i + 1 === array.length,
            showLike: true,
            ...item
          })}
        `
          )
          .join(' ')}
      `
        )
        .join(' ')}
      ${mapButton({
        text: 'See more learning at Innential',
        link: `${appLink}/quick-search`
      })}
    `
  })

export const weeklyContentNotification = ({
  name,
  usersSkills,
  topWeeklyContent = [],
  topPaidContent = [],
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Your Weekly Learning',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('Your weekly personalised learning update is ready!')}
      ${mapRowBlackText(`
        See the list below and don't hesitate<br/>
        to like or add to your development plan!
      `)}
      ${mapRowBlackText('Your learning preferences')}
      ${mapUserSkills({ skills: usersSkills })}
      ${
        topWeeklyContent.length > 0
          ? mapRowBlackText('Newest weekly', '18px', 'bold', 'left')
          : ''
      }
      ${topWeeklyContent
        .map(
          (item, i, array) => `
        ${mapDigestItem({
          appLink,
          lastChild: i + 1 === array.length,
          showLike: true,
          ...item
        })}
      `
        )
        .join(' ')}
      ${
        topPaidContent.length > 0
          ? mapRowBlackText('Best paid weekly', '18px', 'bold', 'left')
          : ''
      }
      ${topPaidContent
        .map(
          (item, i, array) => `
        ${mapDigestItem({
          appLink,
          lastChild: i + 1 === array.length,
          showLike: true,
          ...item
        })}
      `
        )
        .join(' ')}
      ${mapButton({
        text: 'See more learning at Innential',
        link: `${appLink}/quick-search`
      })}
    `
  })

export const leaderApproveGoalsNotification = ({
  name,
  usersAndGoals,
  // usersAndGoalsInReview,
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Leader Goal Approval',
    // title: 'Your teammates have pending goals',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`
        Some of your teammates have goals that are waiting to be approved.
      `)}
      ${
        usersAndGoals.length > 0
          ? `
        ${mapRowBlackText(`
          Please take a minute to review their goals:
        `)}
        ${usersAndGoals
          .map(
            ({ goals, ...user }, i, array) => `
              ${mapUserItem({
                appLink,
                ...user
              })}
              ${mapUserGoals({ goals, lastChild: i + 1 === array.length })}
            `
          )
          .join(' ')}
      `
          : ''
      }
      ${mapButton({
        text: 'Go to Innential',
        link: `${appLink}/goals/approval`
      })}
    `
  })

export const setUpDevPlanReminder = ({ name, content, appLink }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Dev Plan Set-up Reminder',
    // title: "You don't have a dev plan yet",
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`
        Your goals in the platform are set up,<br/>
        but you haven’t chosen any learning for your development plan yet.
      `)}
      ${mapRowBlackText(`
        Take a few minutes to find the right items for you,<br/>
        so you can start accomplishing your goals!
      `)}
      ${mapButton({
        text: 'Go to Innential',
        link: appLink
      })}
      ${
        content.length > 0
          ? mapRowBlackText(`
        Here's a few pieces of learning we picked for you:
      `)
          : ''
      }
      ${content
        .map((digestItem, i, array) =>
          mapDigestItem({
            appLink,
            lastChild: i + 1 === array.length,
            ...digestItem
          })
        )
        .join('')}
    `
  })

export const firstInvitationTemplate = ({
  invitingPerson,
  organizationName,
  appUrl,
  invitation,
  totalCount,
  users = []
  // customInvitationMessage
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: `Innential Invitation Email`,
    // title: 'Welcome to Innential!',
    header: `${
      invitingPerson
        ? `${invitingPerson.name} <span style="font-weight: normal !important; color: #3B4B66 !important;">invited you to join Innential</span>`
        : '<span style="font-weight: normal !important; color: #3B4B66 !important;">You have been invited to join Innential</span>'
    }
    `,
    content: `
      ${mapInvitationMessage({
        invitingPerson,
        organizationName
      })}
      ${users.length > 0 ? mapInvitationUsers({ users, totalCount }) : ''}
      ${mapDivider()}
      ${mapButton({
        text: 'Set up your profile',
        link: `${appUrl}/accept-invitation/${invitation}`
      })}
    `
  })

// FOR REMOVAL?

export const progressCheckTemplate = ({ name, goals, appUrl }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Review Progress Check Email',
    title: 'Goals progress check-In!',
    header: `Hi ${name ? ' ' + name : ''},`,
    content: `
    It is time to check the progress on your goals!
    Go to your goals listing and click on any of the goals to update their status.
    <ul>
      ${goals.map(g => `<li><a href="${appUrl}/goals">${g}</a></li>`).join(' ')}
    </ul>
    `
  })

export const onboardingReminderTemplate = ({ pendingInvitation, appLink }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Onboarding Reminder',
    // title: 'Set up your profile at Innential',
    header: `Hello!`,
    content: `
    ${mapRowBlackText(
      `
      It's been two days since your invitation to the <br/>
      Innential platform, and you haven't yet onboarded.
    `,
      undefined,
      'bold'
    )}
    ${mapButton({
      text: 'Set up your profile',
      link: `${appLink}/accept-invitation/${pendingInvitation}`
    })}
    `
  })

export const activateGoalsReminder = ({ name, nOfDrafts, goalsSet, appLink }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Goal Activation Reminder',
    // title: 'Your goals are not yet active',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`
        ${
          goalsSet
            ? `You have ${nOfDrafts} goals that are still drafts,<br/> which means you cannot start your development plan for them yet.`
            : 'We have generated some goal drafts for you on the<br/> Innential platform based on the information<br/> you provided during onboarding.'
        }
      `)}
      ${mapRowBlackText(`
        Take a few minutes to mark the goals as ready for review to get them approved <br/>
        or set them as active to make them private just for you.
      `)}
      ${mapButton({
        text: 'Go to Innential',
        link: `${goalsSet ? `${appLink}/goals` : `${appLink}`}`
      })}
    `
  })

export const reviewPreparationReminder = ({
  name,
  reviewStartsOn,
  reviewer,
  hasPreviousGoals,
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Review Preparation Reminder',
    // title: `Prepare for your review`,
    header: `Hello ${name || 'there'}!`,
    content: `
    ${mapRowGreyText(
      `A new review${
        reviewer
          ? ' with'
          : `begins on ${new Date(reviewStartsOn).toDateString()}`
      }`
    )}
    ${reviewer ? mapRowBlackText(`${reviewer}`, '16px') : ''}
    ${
      reviewer
        ? mapRowGreyText(`
      begins on ${new Date(reviewStartsOn).toDateString()}
    `)
        : ''
    }
    ${mapRowBlackText(`
      Take a few minutes to create your new learning goal drafts<br/>
      and start preparing a development plan.
    `)}
    ${
      hasPreviousGoals
        ? mapRowBlackText(`
          You also have some active goals from the last review<br/>
          Take a few minutes to update their progress.
        `)
        : ''
    }
    ${mapButton({
      text: 'See your goals',
      link: `${appLink}/goals/${hasPreviousGoals ? 'active' : 'draft'}`
    })}
    ${mapRowBlackText(`
      If you'd like to receive feedback from your peers before the review<br/>
      visit your feedback request page:
    `)}
    ${mapButton({
      text: 'Go to feedback',
      link: `${appLink}/feedback-page/requests`
    })}
    `
  })

export const reviewSchedulingReminder = ({
  name,
  reviewName,
  reviewId,
  reviewStartsOn,
  users,
  appLink
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Review Scheduling Reminder',
    // title: `Send out invites to your reviewees`,
    header: `Hello ${name || 'there'}!`,
    content: `
    ${mapRowGreyText('Your')}
    ${mapRowBlackText(`${reviewName}`, '24px')}
    ${mapRowGreyText(`
      starts on ${new Date(
        reviewStartsOn
      ).toDateString()}, and there are still users<br/>
      who don’t have review meetings scheduled:
    `)}
    ${mapUnscheduledUsers({ users })}
    ${mapButton({
      text: 'Set up meetings',
      link: `${appLink}/create/reviews/events/${reviewId}`
    })}
    `
  })

export const reviewClosingReminder = ({ name, reviewName, appLink }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Review Closing Reminder',
    // title: `Your review hasn't been closed yet`,
    header: `Hello ${name || 'there'}!`,
    content: `
    ${mapRowGreyText('Your')}
    ${mapRowBlackText(`${reviewName}`, '24px')}
    ${mapRowGreyText('has still not been closed yet.')}<br/>
    ${mapRowGreyText(`
      If you are done reviewing, please take<br/>
      a few minutes to mark the review closed on the platform.
    `)}
    ${mapButton({
      text: 'Go to Innential',
      link: `${appLink}/reviews`
    })}
    ${mapRowGreyText(
      'If you are still in the reviewing process, please disregard this message'
    )}
    `
  })

// POSSIBLY FOR REMOVAL?

export const newTeamLeaderInvitationTemplate = ({
  name,
  teamName,
  // organizationName,
  // admin,
  invitation,
  appUrl,
  users = []
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New team leader invited',
    // title: 'You are invited to join Innential',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('You have been invited to')}
      ${mapRowBlackText(
        `${
          teamName.toLowerCase().includes('team')
            ? teamName
            : `Team ${teamName}`
        }`,
        '24px'
      )}
      ${mapRowGreyText('at Innential')}
      ${mapButton({
        text: 'Set up your profile',
        link: `${appUrl}/accept-invitation/${invitation}`
      })}
      ${mapInvitationMessage()}
      ${mapButton({
        text: 'Set up your profile',
        link: `${appUrl}/accept-invitation/${invitation}`
      })}
  `
  })

// ${
//   users.length > 0
//     ? `
//   <br/>
//   ${mapRowGreyText('Join others from your company at Innential: ')}
//   <br/>
//   ${mapUnscheduledUsers({ users })}
// `
//     : ''
// }

export const newTeamMemberInvitationTemplate = ({
  name,
  teamName,
  // organizationName,
  // leader,
  invitation,
  appUrl,
  users = []
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New team member invited',
    // title: 'You are invited to join Innential',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('You have been invited to')}
      ${mapRowBlackText(
        `${
          teamName.toLowerCase().includes('team')
            ? teamName
            : `Team ${teamName}`
        }`,
        '24px'
      )}
      ${mapRowGreyText('at Innential')}
      ${mapButton({
        text: 'Set up your profile',
        link: `${appUrl}/accept-invitation/${invitation}`
      })}
      ${mapInvitationMessage()}
      ${mapButton({
        text: 'Set up your profile',
        link: `${appUrl}/accept-invitation/${invitation}`
      })}
  `
  })

// ${
//   users.length > 0
//     ? `
//   <br/>
//   ${mapRowGreyText('Join others from your company at Innential: ')}
//   <br/>
//   ${mapUnscheduledUsers({ users })}
// `
//     : ''
// }

// POSSIBLY FOR REMOVAL?

export const existingTeamMemberInvitationTemplate = ({
  name,
  teamName,
  // organizationName,
  // leader,
  appUrl
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New team member added',
    // title: 'You have been added as a member',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('You have been invited to')}
      ${mapRowBlackText(
        `${
          teamName.toLowerCase().includes('team')
            ? teamName
            : `Team ${teamName}`
        }`,
        '24px'
      )}
      ${mapRowGreyText('at Innential')}
      ${mapButton({
        text: 'Go to your teams page',
        link: appUrl
      })}
    `
  })

export const userAppInvitationTemplate = ({ invitation, appUrl }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Invitation URL',
    header: 'Your Innential invitation',
    content: `
      ${mapRowGreyText(
        'Use the link below to accept your invitation to the Innential platform'
      )}
      ${mapButton({
        text: 'Accept invitation',
        link: `${appUrl}/accept-invitation/${invitation}`
      })}
  `
  })

export const userAppPasswordResetTemplate = ({ resetId, appUrl }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Password reset',
    header: 'Your password reset link',
    content: `
      ${mapRowGreyText(
        'Use the link below to reset your password on the Innential platform'
      )}
      ${mapButton({
        text: 'Reset password',
        link: `${appUrl}/reset-password/${resetId}`
      })}
      ${mapRowGreyText(
        'If you did not ask for a password reset, please contact us at contact@innential.com.'
      )}
  `
  })

export const addTeamMemberTemplate = ({
  name,
  leader,
  teamName,
  // organizationName,
  appUrl
  // adminName
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New team member added',
    // title: 'You have been added as a member',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('You have been added by')}
      ${mapRowBlackText(`${leader}`, '24px')}
      ${mapRowGreyText('to')}
      ${mapRowBlackText(
        `${
          teamName.toLowerCase().includes('team')
            ? teamName
            : `Team ${teamName}`
        }`,
        '24px'
      )}
      ${mapButton({
        text: 'Go to your Teams page',
        link: `${appUrl}`
      })}
  `
  })

export const changeTeamLeaderTemplate = ({
  name,
  admin,
  teamName,
  organizationName,
  appUrl
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New team leader appointed',
    // title: 'You have been appointed as a leader',
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText('You have appointed by')}
      ${mapRowBlackText(`${admin}`, '24px')}
      ${mapRowGreyText('as a leader of')}
      ${mapRowBlackText(
        `${
          teamName.toLowerCase().includes('team')
            ? teamName
            : `Team ${teamName}`
        }`,
        '24px'
      )}
      ${mapButton({
        text: 'Go to your Teams page',
        link: appUrl
      })}
  `
  })

export const sendTeamInvitesToMembers = async (
  members, // type User, Bool
  leader, // type User
  organization, // type Organization
  team, // type Team
  appLink, // string
  invitingPerson,
  usersForEmail = []
) => {
  // const organizationSettings = await OrganizationSettings.findOne({
  //   organizationId: organization._id
  // })
  await Promise.all(
    members.map(async member => {
      const { user, isNewUser } = member
      if (isNewUser) {
        appLink &&
          (await sendEmail(
            user.email,
            `${invitingPerson.name} invited you to join Innential`,
            firstInvitationTemplate({
              invitingPerson,
              organizationName: organization.organizationName,
              invitation: user.invitation.pendingInvitation,
              appUrl: appLink,
              customInvitationMessage: false,
              corporate: organization.corporate,
              users: usersForEmail
              // organizationSettings &&
              // organizationSettings.customInvitationEnabled
              //   ? organizationSettings.customInvitationMessage
              //   : false
            })
          ))
      } else {
        appLink &&
          (await sendEmail(
            user.email,
            `You have been added to a new team at ${organization.organizationName}`,
            existingTeamMemberInvitationTemplate({
              name: user.firstName,
              teamName: team.teamName,
              organizationName: organization.organizationName,
              leader: leader,
              appUrl: `${appLink}/teams`
            })
          ))
      }
    })
  )
}

// ADMINAPP

export const adminInvitationTemplate = ({
  organizationName,
  invitationLink,
  users = []
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New admin invited',
    header: 'Hello there!',
    content: `
      ${mapRowGreyText('You are invited to join organization')}
      ${mapRowBlackText(`${organizationName}`, '24px')}
      ${mapRowGreyText('at Innential as an admin')}
      ${mapButton({
        text: 'Set up your profile',
        link: invitationLink
      })}
      `
  })

// ${
//   users.length > 0
//     ? `
//   <br/>
//   ${mapRowGreyText('Join others from your company at Innential: ')}
//   <br/>
//   ${mapUnscheduledUsers({ users })}
// `
//     : ''
// }

export const adminAssignmentOnboardedTemplate = ({
  organizationName,
  appUrl
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New admin added',
    header: 'You have been assigned as an admin',
    content: `
    ${mapRowGreyText('You have been assigned as an admin of')}
    ${mapRowBlackText(`${organizationName}`, '24px')}
    ${mapRowGreyText('at Innential')}
    ${mapButton({
      text: 'Go to Innential',
      link: appUrl
    })}
  `
  })

export const employeeInvitationTemplate = ({
  organizationName,
  invitationLink,
  users = []
}) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New employee invited',
    header: 'Hello there!',
    content: `
    ${mapRowGreyText("You've been invited to join")}
    ${mapRowBlackText(`${organizationName}`, '24px')}
    ${mapRowGreyText('as an employee')}
    ${mapButton({
      text: 'Set up your profile',
      link: invitationLink
    })}
  `
  })

// ${
//   users.length > 0
//     ? `
//   <br/>
//   ${mapRowGreyText('Join others from your company at Innential: ')}
//   <br/>
//   ${mapUnscheduledUsers({ users })}
// `
//     : ''
// }

export const employeeAddTemplate = ({ organizationName, appLink }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'New employee added',
    header: 'You have been added as an employee',
    content: `
      ${mapRowGreyText('You have been added to the organization')}
      ${mapRowBlackText(`${organizationName}`, '24px')}
      ${mapRowGreyText('at Innential')}
      ${mapButton({
        text: 'Go to innential',
        link: `${appLink}`
      })}
    `
  })

/***********************/
/* OLD TEMPLATES BELOW */
/***********************/

// DEPRECATED: SEE REVIEW SCHEDULING TEMPLATE

// export const reviewStartTemplate = ({ name, reviewId, reviewName, appUrl }) =>
//   mapContentToRegularTemplate({
//     metaEmailTitle: 'Review Start Email',
//     title: `It is time for the next ${reviewName}`,
//     header: `Hi ${name ? ' ' + name : ''},`,
//     content: `
//     It is time to start the review process and set goals!
//     <div class="box-center">
//       <a
//         href="${appUrl}/reviews/${reviewId}"
//         class="box-button button button__cta"
//         >Start Now!</a
//       >
//     </div>

//     In case of any questions regarding the process or the Innential tool,
//     feel free to contact one of our specialist kris@innential.com
//     `
//   })

// export const recommendedContentTemplate = ({ name, recommendedBy, appUrl }) =>
//   mapContentToRegularTemplate({
//     metaEmailTitle: 'Learning Recommendation Notifier',
//     title: 'You have new learning recommendations!',
//     header: `Hi ${name ? ' ' + name : ''},`,
//     content: `
//     You have new learning item recommendations from ${recommendedBy || 'your team lead'}.
//     `
//   })

// export const reviewOpensIn3DaysTemplate = ({ name, reviewName, appUrl }) =>
//   mapContentToRegularTemplate({
//     metaEmailTitle: 'Review Opens In 3 Days',
//     title: `Upcoming ${reviewName}`,
//     header: `Hi ${name ? ' ' + name : ''},`,
//     content: `
//     The ${reviewName} will begin in 3 days!<br></br>
//     Start by checking your goals and your team goals!
//     <br></br><br></br>

//     <div class="box-center">
//     <a
//       href="${appUrl}/goals"
//       class="box-button button button__cta"
//       >Go to goals page</a
//     >
//   </div>
//     `
//   })

// export const reviewClosesIn1WeekTemplate = ({
//   name,
//   reviewName,
//   appUrl,
//   reviewId
// }) =>
//   mapContentToRegularTemplate({
//     metaEmailTitle: 'Review Closes In 1 Week',
//     title: `${reviewName} will end in a week!`,
//     header: `Hi ${name ? ' ' + name : ''},`,
//     content: `
//     The ${reviewName} will end in a week!<br></br>
//     Check the list of your team members who have not been reviewed yet!
//     <br></br>
//     <div class="box-center">
//       <a
//         href="${appUrl}/reviews/${reviewId}"
//         class="box-button button button__cta"
//         >Go to review page</a
//       >
//     </div>
//     `
//   })

// export const teamLeaderNewAssessmentTemplate = ({ name, appUrl }) => `
//   Hi${name ? ' ' + name : ''},
//   <br></br><br></br>
//   A new Team Potential assessment has started!<br></br>
//   The results will allow you to see how your team has improved over time.
//   <br></br><br></br>
//   Ready to start?<br></br>
//   Go to <a href="${appUrl}">your Dashboard</a>
//   <br></br><br></br>
//   If you want to know more about Innential’s approach and the science behind, please check our article: <a href="http://magazine.innential.com/how-to-build-effective-teams/"> How to build effective teams</a>`

// export const teamMemberNewAssessmentTemplate = ({ name, leader, appUrl }) => `
//   Hi${name ? ' ' + name : ''},
//   <br></br><br></br>
//   ${leader} has started a new Team Potential Assessment to see how your team has improved over time.<br></br>
//   The assessment takes only 7 minutes!
//   <br></br><br></br>
//   Ready to start?<br></br>
//   Go to <a href="${appUrl}">your Dashboard</a>
//   <br></br><br></br>
//   If you want to know more about Innential’s approach and the science behind, please check our article: <a href="http://magazine.innential.com/how-to-build-effective-teams/"> How to build effective teams</a>`

// export const adminAssignmentNotOnboardedTemplate = ({
//   organizationName,
//   appUrl
// }) =>
//   mapContentToRegularTemplate({
//     metaEmailTitle: 'New admin added',
//     title: 'You have been assigned as an admin',
//     content: `
//       You have been assigned as the admin of organization <strong>${organizationName}</strong>at Innential.<br><br>
//       You can provide details about the organization by visiting your <a href="${appUrl}">Dashboard</a>.<br><br>
//       Best,<br>
//       <i>Innential Team</i>
//   `
//   })

// export const reminderEmail = ({
//   reminder,
//   name,
//   teamName,
//   organizationName,
//   appUrl
// }) => `
//   Hi${name ? ' ' + name : ''},
//   <br></br><br></br>
//   Your ${
//   teamName.includes('Team') ? teamName : 'team ' + teamName
//   } at ${organizationName} is ${
//   reminder === 2 ? 'still ' : ''
//   }waiting for your response to the Team Potential assessment.<br></br>
//   To complete the 7 minutes assessment, go to <a href="${appUrl}">your Dashboard</a>
//   <br></br><br></br>
//   Best,<br></br>
//   <i>Innential Team</i>
// `

// export const lastReminderEmail = ({ name, teamName, appUrl }) => `
//   Hi${name ? ' ' + name : ''},
//   <br></br><br></br>
//   The Team Potential assessment for ${
//   teamName.includes('Team') ? teamName : 'team ' + teamName
//   } will be automatically closed in 2 business days.<br></br>
//   Go to <a href="${appUrl}">your Dashboard</a> to complete the assessment.
//   <br></br><br></br>
//   Best,<br></br>
//   <i>Innential Team</i>
// `

// export const leaderReminderEmail = ({
//   reminder,
//   name,
//   notSubmitted,
//   appUrl
// }) => `
//   Hi${name ? ' ' + name : ''},
//   <br></br><br></br>
//   We are still awaiting for responses from ${
//   notSubmitted.length
//   } of your team members (${notSubmitted}).<br></br>
//   The assessment will automatically close for them in ${
//   reminder === 3 ? '2' : '3'
//   } business days.<br></br>
//   You can see more details about your open assessments <a href="${appUrl}">here</a>.
//   <br></br><br></br>
//   Best,<br></br>
//   <i>Innential Team</i>
// `

export const inviteEventNotification = ({ name, from, appLink, eventId }) =>
  mapContentToRegularTemplate({
    metaEmailTitle: 'Feedback Notification',
    // title: "You don't have a dev plan yet",
    header: `Hello ${name || 'there'}!`,
    content: `
      ${mapRowGreyText(`
        You just received event invitation${from ? ' from' : ''}
      `)}
      ${from ? mapRowBlackText(from, '18px') : ''}
      ${mapRowGreyText(`
        You can accept or decline current event<br/>
        via below buttons:
      `)}
      ${mapButton({
        text: 'Accept',
        link: `${appLink}/event/${eventId}?mailbtn=accept`
      })}
      ${mapButton({
        text: 'Decline',
        link: `${appLink}/event/${eventId}?mailbtn=decline`
      })}
    `
  })
