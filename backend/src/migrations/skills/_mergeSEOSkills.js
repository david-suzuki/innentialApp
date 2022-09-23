import { Skills, LearningContent } from '~/models'
;(async () => {
  let updatedCounter = 0

  const skillseo = await Skills.findOne({
    name: 'SEO'
  }).lean()

  const skillverbose = await Skills.findOne({
    name: 'Search Engine Optimization'
  }).lean()

  // UPDATE ONLY VERBOSE CONTENT
  const result1 = await LearningContent.updateMany(
    {
      $and: [
        { 'relatedPrimarySkills._id': skillverbose._id },
        { 'relatedPrimarySkills._id': { $ne: skillseo._id } }
      ]
    },
    {
      $set: {
        'relatedPrimarySkills.$._id': skillseo._id,
        'relatedPrimarySkills.$.name': skillseo.name
      }
    }
  )

  console.log(result1)

  // UPDATE CONTENT WHERE BOTH ARE PRESENT
  const contentboth = await LearningContent.find({
    $and: [
      { 'relatedPrimarySkills._id': skillverbose._id },
      { 'relatedPrimarySkills._id': skillseo._id }
    ]
  })

  if (updatedCounter) console.log(`Updated ${updatedCounter} skills`)
})()
