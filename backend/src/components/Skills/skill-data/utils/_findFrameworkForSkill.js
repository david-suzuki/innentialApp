import { SkillsFramework /*, Organization */ } from '~/models'

export const findFrameworkForSkill = async (
  skillId,
  categoryId,
  organizationId
) => {
  const orgSkillFramework = await SkillsFramework.findOne({
    connectedTo: skillId,
    organizationId
  }).select({ _id: 1 })
  if (orgSkillFramework) {
    return orgSkillFramework._id
  }
  const orgCategoryFramework = await SkillsFramework.findOne({
    connectedTo: categoryId,
    organizationId
  }).select({ _id: 1 })
  if (orgCategoryFramework) {
    return orgCategoryFramework._id
  }
  const skillFramework = await SkillsFramework.findOne({
    connectedTo: skillId,
    organizationId: null
  }).select({ _id: 1 })
  if (skillFramework) {
    return skillFramework._id
  }
  const categoryFramework = await SkillsFramework.findOne({
    connectedTo: categoryId,
    organizationId: null
  }).select({ _id: 1 })
  if (categoryFramework) {
    return categoryFramework._id
  }
  return null
}
