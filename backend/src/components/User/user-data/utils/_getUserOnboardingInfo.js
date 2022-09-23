import {
  User,
  Organization,
  UserProfile,
  RoleRequirements,
  Skills,
  JourneyNextSteps
} from '~/models'
import dataSources from '../../../../datasources'

const { LearningPath } = dataSources()

const getUserOnboardingInfo = async _id => {
  const user = await User.findOne({ _id })

  if (!user) throw new Error(`User ${_id} not found`)

  if (user.inbound && user.inbound.engagedOn) {
    if (user.password) {
      return {
        onboarded: true
      }
    } else {
      return {
        onboarded: false,
        shortOnboarding: true,
        userDetailsProvided: true
      }
    }
  }

  const hasNextSteps = await JourneyNextSteps.findOne({ user: _id })
    .select({ _id: 1 })
    .lean()

  if (hasNextSteps) {
    return {
      onboarded: true
    }
  }

  const hasAssignedPath = !!(await LearningPath.getAssignedPathsForUser({
    user: _id
  }))

  const organization = await Organization.findById(user.organizationId)
    .select({ premium: 1, size: 1, technicians: 1 })
    .lean()

  const technicianOnboarding = !!organization.technicians

  const firstAdmin = user.roles.includes('ADMIN') && !organization.size

  const profile = await UserProfile.findOne({ user: _id })
    .select({
      neededWorkSkills: 1,
      roleAtWork: 1,
      selectedWorkSkills: 1,
      roleId: 1
    })
    .lean()

  if (!profile) {
    return {
      onboarded: false,
      technicianOnboarding,
      firstAdmin,
      hasAssignedPath
    }
  }

  const isPremium = organization.premium

  const role = await RoleRequirements.findOne({ _id: profile.roleId })
    .select({ coreSkills: 1 })
    .lean()

  const userDetailsProvided = Boolean(
    user.firstName && user.lastName && profile.roleAtWork
  )
  const neededSkillsProvided = Boolean(profile.neededWorkSkills.length > 0)
  const selectedSkillsEvaluated = Boolean(profile.selectedWorkSkills.length > 0)

  const shouldEvaluateSkills =
    isPremium && role && role.coreSkills.length > 0 && !selectedSkillsEvaluated

  return {
    onboarded: userDetailsProvided && (neededSkillsProvided || user.technician),
    hasAssignedPath,
    firstAdmin,
    userDetailsProvided,
    technicianOnboarding,
    skillsToEvaluate: shouldEvaluateSkills
      ? await Skills.find({
          _id: { $in: role.coreSkills.map(({ skillId }) => skillId) }
        })
      : []
  }
}

export default getUserOnboardingInfo
