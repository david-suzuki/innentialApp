// TO BE REVIEWED, IS THIS NEEDED ANYMORE?

// import { User, Team, Review, Goal } from '~/models'
// import {
//   sendEmail,
//   appUrls,
//   sentryCaptureException,
//   progressCheckTemplate
// } from '~/utils'
// import { addDateInterval } from '~/components/Reviews/review-data/utils'

// const appLink = `${appUrls['user']}`

// const jobName = 'reviewProgressChecks'

// const callback = async (job, done) => {
//   try {
//     const upcomingReviews = await Review.find({ status: 'UPCOMING' }).lean()
//     const now = new Date()
//     const [day, month, year] = [
//       now.getDate(),
//       now.getMonth(),
//       now.getFullYear()
//     ]

//     await Promise.all(
//       upcomingReviews.map(async review => {
//         // No progress checks
//         if (review.progressCheckFrequency.repeatCount === 0) return
//         const { progressCheckFrequency } = review
//         // add or remove couple of days to fit the day of the week
//         let calculatedDate = new Date(
//           new Date(
//             review.createdAt.getTime() +
//               (progressCheckFrequency.day - review.createdAt.getDay()) * 8.64e7
//           ).setUTCHours(0, 0, 1, 0)
//         )
//         // we will keep adding the interval untill it's more than today
//         while (calculatedDate <= now) {
//           if (
//             calculatedDate.getDate() === day &&
//             calculatedDate.getMonth() === month &&
//             calculatedDate.getFullYear() === year
//           ) {
//             console.log(' THIS IS TODAY !!!', now, '\n\n')
//             console.log(review.name)
//             // TODO: DO AND SEND CHECKS
//             await Promise.all(
//               review.reviewScope.map(async ({ teamId }) => {
//                 const team = await Team.findById(teamId)
//                 if (team) {
//                   await Promise.all(
//                     team.members.map(async memberId => {
//                       const user = await User.findById(memberId)
//                       if (user && user.status === 'active') {
//                         const usersGoals = await Goal.find({
//                           reviewId: review._id,
//                           user: memberId
//                         })
//                         if (usersGoals.length > 0) {
//                           console.log(
//                             ` USER: ${user.email} has goals!!\n sending email\n\n`
//                           )
//                           sendEmail(
//                             user.email,
//                             'Goals progress check-in!',
//                             progressCheckTemplate({
//                               name: user.firstName,
//                               appUrl: appLink,
//                               goals: usersGoals.map(({ goalName }) => goalName)
//                             })
//                           )
//                         }
//                       }
//                     })
//                   )
//                 } else {
//                   console.log(`INACTIVE TEAM : ${teamId}`)
//                 }
//               })
//             )
//           }
//           calculatedDate = addDateInterval(
//             'WEEK',
//             review.progressCheckFrequency.repeatCount,
//             calculatedDate
//           )
//         }
//       })
//     )
//   } catch (e) {
//     sentryCaptureException(e)
//     job.fail(e)
//     await job.save()
//   } finally {
//     done()
//   }
// }

// export default {
//   jobName,
//   callback,
//   interval: '1 day',
//   options: { timezone: 'Europe/Berlin' },
//   type: 'single'
// }
