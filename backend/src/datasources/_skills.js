import MongoDataSourceClass from './_mongo-datasource-class'
import {
  Skills,
  UserProfile,
  UserEvaluation,
  Team,
  RoleRequirements,
  Goal,
  GoalTemplate,
  LearningPathTemplate
} from '~/models'
import { sentryCaptureException } from '~/utils'

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }

  // writes

  async mergeDuplicates(duplicateIds, skillId) {
    if (!Array.isArray(duplicateIds) || !skillId) {
      sentryCaptureException(`Insufficient arguments`)
      return
    }

    if (duplicateIds.length === 0) return

    await UserProfile.updateMany(
      {
        'selectedWorkSkills._id': { $in: duplicateIds }
      },
      {
        $set: {
          'selectedWorkSkills.$._id': skillId
        }
      }
    )
    await UserProfile.updateMany(
      {
        'neededWorkSkills._id': { $in: duplicateIds }
      },
      {
        $set: {
          'neededWorkSkills.$._id': skillId
        }
      }
    )
    await UserEvaluation.updateMany(
      {
        'skillsFeedback.skillId': { $in: duplicateIds }
      },
      {
        $set: {
          'skillsFeedback.$.skillId': skillId
        }
      }
    )
    await Team.updateMany(
      {
        'requiredSkills.skillId': { $in: duplicateIds }
      },
      {
        $set: {
          'requiredSkills.$.skillId': skillId
        }
      }
    )
    await RoleRequirements.updateMany(
      {
        'coreSkills.skillId': { $in: duplicateIds }
      },
      {
        $set: {
          'coreSkills.$.skillId': skillId
        }
      }
    )
    await RoleRequirements.updateMany(
      {
        'secondarySkills.skillId': { $in: duplicateIds }
      },
      {
        $set: {
          'secondarySkills.$.skillId': skillId
        }
      }
    )
    await Goal.updateMany(
      {
        relatedSkills: { $in: duplicateIds }
      },
      {
        $set: {
          'relatedSkills.$': skillId
        }
      }
    )
    await Goal.updateMany(
      {
        'skills.skillId': { $in: duplicateIds }
      },
      {
        $set: {
          'skills.$.skillId': skillId
        }
      }
    )
    await GoalTemplate.updateMany(
      {
        relatedSkills: { $in: duplicateIds }
      },
      {
        $set: {
          'relatedSkills.$': skillId
        }
      }
    )
    await LearningPathTemplate.updateMany(
      {
        skills: { $in: duplicateIds }
      },
      {
        $set: {
          'skills.$': skillId
        }
      }
    )
  }
})(Skills)
