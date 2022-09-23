import MongoDataSourceClass from './_mongo-datasource-class'
import {
  UserProfile,
  RoleRequirements,
  Skills,
  Organization,
  Team
} from '~/models'
// import slug from 'slug'
import GokuArray from 'goku-array'

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getOne(query, selector, lean) {
    let queryObject = this.model.findOne(query)

    if (selector) queryObject = queryObject.select(selector)
    if (lean) queryObject = queryObject.lean()

    return queryObject
  }

  async getResolver(id) {
    return this.loadOneById(id)
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }

  async getRoleGapInfo({ user, roleId }) {
    const role = await RoleRequirements.findById(roleId)
      .select({ coreSkills: 1 })
      .lean()

    if (!role) return null

    const profile = await this.getOne({ user })

    if (!profile) throw new Error(`User:${user} profile not found`)

    const { selectedWorkSkills } = profile
    const evaluatedSkills = await profile.getEvaluatedSkills()
    const { coreSkills } = role

    // GET SKILLGAPS
    const skillGap = await Promise.all(
      coreSkills.map(async ({ _id, skillId, level: skillNeeded, slug }) => {
        let skillAvailable = 0
        const skill = await Skills.findById(skillId)
          .select({ name: 1 })
          .lean()
        const evaluatedSkill = evaluatedSkills.find(
          ({ _id: evaluatedId }) => String(evaluatedId) === String(skillId)
        )
        if (evaluatedSkill && evaluatedSkill.level !== 0) {
          skillAvailable = evaluatedSkill.level
        } else {
          const selectedSkill = selectedWorkSkills.find(
            ({ _id: selectedId }) => String(selectedId) === String(skillId)
          )
          if (selectedSkill) {
            skillAvailable = selectedSkill.level
          }
        }
        return {
          _id,
          name: skill ? skill.name : slug,
          skillAvailable,
          skillNeeded
        }
      })
    )

    // SORT BY SKILL GAP SIZE
    skillGap.sort(
      (
        { skillAvailable: a1, skillNeeded: a2 },
        { skillAvailable: b1, skillNeeded: b2 }
      ) => {
        return b2 - b1 - (a2 - a1)
      }
    )

    return skillGap
  }

  // writes

  async createOne({ user, organizationId, selectedWorkSkills = [], ...rest }) {
    if (!user || !organizationId) throw new Error(`Insufficient arguments`)

    const organization = await Organization.findById(organizationId)
      .select({ mandatorySkills: 1, corporate: 1 })
      .lean()

    if (!organization) throw new Error(`Organization not found`)

    if (!organization.corporate) {
      return UserProfile.create({
        ...rest,
        organizationId,
        user,
        selectedWorkSkills
      })
    } else {
      const teams = await Team.find({
        $or: [{ leader: user }, { members: user }],
        active: true
      })
        .select({ requiredSkills: 1 })
        .lean()

      const teamRequiredSkills = new GokuArray(
        teams.reduce(
          (acc, curr) => [...acc, ...(curr.requiredSkills || [])],
          []
        )
      )
        .unique(({ skillId }) => String(skillId))
        .map(({ skillId: _id }) => ({ _id }))

      const mandatorySkills =
        (organization && organization.mandatorySkills) || []

      const allSkills = new GokuArray([
        ...mandatorySkills,
        ...teamRequiredSkills,
        ...selectedWorkSkills
      ])
        .unique(({ _id }) => String(_id))
        .toArray()

      const mappedSkills = (
        await Promise.all(
          allSkills.map(async ({ _id }) => {
            const skill = await Skills.findById(_id)
              .select({ slug: 1 })
              .lean()
            if (!skill) return null
            return {
              _id,
              slug: skill.slug,
              level: 0
            }
          })
        )
      ).filter(item => !!item)

      return UserProfile.create({
        ...rest,
        organizationId,
        user,
        selectedWorkSkills: [...mappedSkills]
      })
    }
  }
})(UserProfile)
