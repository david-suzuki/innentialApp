import { MicroSiteResult, Skills, RoleRequirements } from '../../models'
// import fs from 'fs'

// MOCK DATA

// RESULT PREPARATION ALGORITHM

const prepareResult = async form => {
  const {
    answers,
    hidden: { resultid: resultId }
  } = form

  if (!Array.isArray(answers)) throw new Error(`answers is not valid`)

  console.time('Result finished in')
  const title = answers.find(answer => answer.field.ref === 'role').choice.label

  const role = await RoleRequirements.findOne({ title })
    .select({ _id: 1, coreSkills: 1 })
    .lean()

  if (!role) throw new Error(`Role not found: ${title}`)

  const { coreSkills } = role

  // PROCESS SKILL RATINGS FROM USER; COMPARE TO ROLE REQUIREMENTS; PREPARE SKILL GAP FOR ALGORITHM AND CHART

  const skillAnswers = answers.filter(answer => answer.field.type === 'rating')

  const mappedSkills = await Promise.all(
    coreSkills.map(async ({ slug, level }) => {
      const skill = await Skills.findOne({ slug, organizationSpecific: null })
        .select({ _id: 1, name: 1 })
        .lean()
      return {
        _id: skill ? skill._id : 'not_found',
        name: skill ? skill.name : slug,
        slug,
        level
      }
    })
  )

  const withSkillGap = mappedSkills.map(skill => {
    const { _id, name, slug, level } = skill
    const availableSkill = skillAnswers.find(
      answer => answer.field.ref.split('69')[0] === slug // DUMB TYPEFORM SHENANIGANS BECAUSE ALL QUESTION REFS MUST BE UNIQUE
    )
    const available = availableSkill ? availableSkill.number : 0

    return {
      _id,
      name,
      level,
      available,
      skillGapSize: level - available
    }
  })

  withSkillGap.sort((a, b) => b.skillGapSize - a.skillGapSize)

  const neededSkills = withSkillGap
    .filter(({ skillGapSize }) => skillGapSize > 0)
    .map(({ _id, name }) => ({ _id: String(_id), name }))

  const selectedSkills = withSkillGap
    .filter(({ available }) => available > 0)
    .map(({ _id, name, available: level }) => ({
      _id: String(_id),
      name,
      level
    }))

  // console.time('Write file in')
  // fs.writeFile('content.json', JSON.stringify({ mostRelevantCourses, mostRelevantBites, freeCourses }), () => {})
  // console.timeEnd('Write file in')

  const chartData = withSkillGap.reduce(
    ({ labels, skillsNeeded, skillsAvailable }, { name, level, available }) => {
      return {
        labels: [...labels, name],
        skillsNeeded: [...skillsNeeded, level],
        skillsAvailable: [...skillsAvailable, available]
      }
    },
    { labels: [], skillsNeeded: [], skillsAvailable: [] }
  )

  const { email } = answers.find(answer => answer.type === 'email')

  const { number: hours } = answers.find(answer => answer.field.ref === 'hours')

  const {
    choice: { label: situation }
  } = answers.find(answer => answer.field.ref === 'situation')

  const result = {
    resultId,
    chartData,
    neededSkills,
    selectedSkills,
    hours,
    situation,
    roleChosen: role._id,
    submittedAt: new Date()
  }

  const existing = await MicroSiteResult.findOne({ email })
    .select({ _id: 1 })
    .lean()

  if (existing) {
    const { _id } = existing
    await MicroSiteResult.findOneAndUpdate(
      { _id, 'results.resultId': { $ne: resultId } },
      {
        $push: {
          results: result
        }
      }
    )
  } else {
    const { text: name } = answers.find(answer => answer.type === 'text')
    await MicroSiteResult.create({
      name,
      email,
      results: [result]
    })
  }
  console.timeEnd('Result finished in')
}

export default prepareResult
