import { Skills } from '~/models'

const getSkillList = async platformOnly => {
  const allSkills = await Skills.find({
    enabled: true,
    ...(platformOnly && { organizationSpecific: null })
  })
    .sort({ createdAt: -1 })
    .select({ _id: 0, name: 1, slug: 1 })
    .lean()
  return allSkills.reduce((acc, { name, slug }) => {
    return {
      ...acc,
      [name]: slug
    }
  }, {})
}

export default getSkillList
