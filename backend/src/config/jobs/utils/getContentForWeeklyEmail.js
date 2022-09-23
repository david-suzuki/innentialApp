import { LearningContent, ContentSources } from '~/models'
import { sentryCaptureException } from '~/utils'

export const getContentForWeeklyEmail = async (skillIds, organizationId) => {
  const now = new Date()

  const newRelevantArticles = await LearningContent.find({
    'relatedPrimarySkills._id': { $in: skillIds },
    publishedDate: { $gte: now.setDate(now.getDate() - 7) },
    type: 'ARTICLE',
    $or: [
      {
        organizationSpecific: organizationId
      },
      {
        organizationSpecific: null
      }
    ]
  }).lean()

  const newRelevantELearnings = await LearningContent.find({
    'relatedPrimarySkills._id': { $in: skillIds },
    'price.value': { $gt: 0 },
    type: 'E-LEARNING',
    $or: [
      {
        organizationSpecific: organizationId
      },
      {
        organizationSpecific: null
      }
    ]
  }).lean()

  const usedArticles = []

  const articlesPerSkill = skillIds.map(id => {
    return newRelevantArticles.reduce((acc, curr) => {
      if (
        !usedArticles.some(
          used => used._id.toString() === curr._id.toString()
        ) &&
        curr.relatedPrimarySkills.some(
          related => related._id.toString() === id.toString()
        )
      ) {
        usedArticles.push(curr)
        return [...acc, curr]
      } else return acc
    }, [])
  })

  const usedELearnings = []

  const eLearningsPerSkill = skillIds.map(id => {
    return newRelevantELearnings.reduce((acc, curr) => {
      if (
        !usedELearnings.some(
          used => used._id.toString() === curr._id.toString()
        ) &&
        curr.relatedPrimarySkills.some(
          related => related._id.toString() === id.toString()
        )
      ) {
        usedELearnings.push(curr)
        return [...acc, curr]
      } else return acc
    }, [])
  })

  const totalRelevantArticles = articlesPerSkill.reduce(
    (acc, curr) => acc + curr.length,
    0
  )
  const totalRelevantELearnings = eLearningsPerSkill.reduce(
    (acc, curr) => acc + curr.length,
    0
  )

  // THE ACTUAL CONDITIONS FOR NOT SENDING THE EMAIL MAY CHANGE

  if (totalRelevantArticles + totalRelevantELearnings < 3) {
    return null
  }

  let articlesLeft = 3
  if (totalRelevantArticles < 3) {
    articlesLeft = totalRelevantArticles
  }
  let eLearningsLeft = 2
  if (totalRelevantELearnings < 2) {
    eLearningsLeft = totalRelevantELearnings
  }

  // REDUCE SKILLS WITH NO CONTENT

  const reducedArticlesPerSkill = articlesPerSkill.reduce((acc, curr) => {
    if (curr.length > 0) {
      return [...acc, curr]
    } else return acc
  }, [])

  const reducedELearningsPerSkill = eLearningsPerSkill.reduce((acc, curr) => {
    if (curr.length > 0) {
      return [...acc, curr]
    } else return acc
  }, [])

  if (reducedArticlesPerSkill.length === 0) {
    return null
  }

  const articlesToSend = []
  const eLearningsToSend = []

  if (reducedArticlesPerSkill.length === 3) {
    reducedArticlesPerSkill.forEach(articleList => {
      const articleToSend = articleList.shift()
      articlesToSend.push(articleToSend)
    })
  } else {
    while (articlesLeft > 0) {
      for (const list in reducedArticlesPerSkill) {
        const articleList = reducedArticlesPerSkill[list]
        if (articlesLeft && articleList.length > 0) {
          const articleToSend = articleList.shift()
          articlesToSend.push(articleToSend)
          articlesLeft--
        }
      }
    }
  }

  if (reducedELearningsPerSkill.length !== 0) {
    if (reducedELearningsPerSkill.length === 2) {
      reducedELearningsPerSkill.forEach(eLearningList => {
        const eLearningToSend = eLearningList.shift()
        eLearningsToSend.push(eLearningToSend)
      })
    } else {
      while (eLearningsLeft > 0) {
        for (const list in reducedELearningsPerSkill) {
          const eLearningList = reducedELearningsPerSkill[list]
          if (eLearningsLeft && eLearningList.length > 0) {
            const eLearningToSend = eLearningList.shift()
            eLearningsToSend.push(eLearningToSend)
            eLearningsLeft--
          }
        }
      }
    }
  }

  const skillLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

  const topWeeklyContent = await Promise.all(
    articlesToSend.map(async article => {
      const {
        _id,
        title,
        url,
        source,
        type,
        relatedPrimarySkills,
        price
      } = article
      let highestSkillLevel = 0
      const remappedSkills = relatedPrimarySkills.map(skill => {
        const { skillLevel, name } = skill
        if (skillLevel > highestSkillLevel) {
          highestSkillLevel = skillLevel
        }
        return name
      })
      const paid = price.value > 0

      const normalisedSource = await ContentSources.findById(source)
      if (normalisedSource) {
        return {
          _id,
          title,
          paid,
          type,
          link: url,
          source: normalisedSource.name,
          level: skillLevels[highestSkillLevel],
          skills: remappedSkills
        }
      } else {
        sentryCaptureException(`Source for content ${_id} not found`)
        return {
          _id,
          title,
          paid,
          type,
          link: url,
          source: '',
          level: skillLevels[highestSkillLevel],
          skills: remappedSkills
        }
      }
    })
  )

  const topPaidContent = await Promise.all(
    eLearningsToSend.map(async eLearning => {
      const {
        _id,
        title,
        url,
        source,
        type,
        relatedPrimarySkills,
        price
      } = eLearning
      let highestSkillLevel = 0
      const remappedSkills = relatedPrimarySkills.map(skill => {
        const { skillLevel, name } = skill
        if (skillLevel > highestSkillLevel) {
          highestSkillLevel = skillLevel
        }
        return name
      })
      const paid = price.value > 0

      const normalisedSource = await ContentSources.findById(source)
      let sourceName = ''
      if (!normalisedSource) {
        sentryCaptureException(`Source for content ${_id} not found`)
      } else {
        sourceName = normalisedSource.name
      }

      return {
        _id,
        title,
        paid,
        type,
        link: url,
        source: sourceName,
        level: skillLevels[highestSkillLevel],
        skills: remappedSkills
      }
    })
  )

  return {
    topWeeklyContent,
    topPaidContent
  }
}
