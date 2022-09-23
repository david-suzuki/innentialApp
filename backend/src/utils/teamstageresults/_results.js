import { typeform } from './_typeform'

const { formDefinition } = typeform

const teamStageResults = responses => {
  // Changed the way that this fn works. Instead of entire forms in json form it only takes an array of answer objects,
  // each with the question ID and answer value, be it text or number. Then it runs a check on the answer array and compares
  // it to the typeform definition. Each question in the definition has a key that determines the performance area.
  const nOfResponses = responses.length

  const { questions } = formDefinition

  const engArray = []
  const gManArray = []
  const indArray = []
  const rClArray = []
  const leadArray = []
  const cAFArray = []
  const pADMArray = []
  const fUArray = []
  const aANArray = []
  const strArray = []
  const coopArray = []
  const textArray = []

  // The end result is the same, but it employs a bit more validation,
  // is less reliant on the order of the questions, and overall takes a bit less
  // to do all the calculations
  responses.forEach(response => {
    response.forEach(answer => {
      const ix = questions.findIndex(q => q.id === answer.id)
      const a = answer.value
      switch (questions[ix].key) {
        case 'engagement':
          engArray.push(a)
          break
        case 'goalsManagement':
          gManArray.push(a)
          break
        case 'independence':
          indArray.push(a)
          break
        case 'rolesClarity':
          rClArray.push(a)
          break
        case 'leadership':
          leadArray.push(a)
          break
        case 'comsAndFeedback':
          cAFArray.push(a)
          break
        case 'planningAndDecisionMaking':
          pADMArray.push(a)
          break
        case 'followUps':
          fUArray.push(a)
          break
        case 'acceptanceAndNorms':
          aANArray.push(a)
          break
        case 'structure':
          strArray.push(a)
          break
        case 'cooperation':
          coopArray.push(a)
          break
        case 'text':
          textArray.push(answer.title)
          textArray.push(a)
          break
        default:
          break
      }
    })
  })

  const engagement = engArray.reduce((acc, curr) => acc + curr) / nOfResponses

  // Calculating performance in the 10 Key Areas
  const goalsManagement =
    (gManArray.reduce((acc, curr) => acc + curr) / (2 * nOfResponses)) * 2.5
  const independence =
    (indArray.reduce((acc, curr) => acc + curr) / nOfResponses) * 2.5
  const rolesClarity =
    (rClArray.reduce((acc, curr) => acc + curr) / (2 * nOfResponses)) * 2.5
  const structure =
    (strArray.reduce((acc, curr) => acc + curr) / (4 * nOfResponses)) * 2.5
  const leadership =
    (leadArray.reduce((acc, curr) => acc + curr) / nOfResponses) * 2.5
  const comsAndFeedback =
    (cAFArray.reduce((acc, curr) => acc + curr) / (4 * nOfResponses)) * 2.5
  const planningAndDecisionMaking =
    (pADMArray.reduce((acc, curr) => acc + curr) / (4 * nOfResponses)) * 2.5
  const followUps =
    (fUArray.reduce((acc, curr) => acc + curr) / nOfResponses) * 2.5
  const acceptanceAndNorms =
    (aANArray.reduce((acc, curr) => acc + curr) / (3 * nOfResponses)) * 2.5
  const cooperation =
    (coopArray.reduce((acc, curr) => acc + curr) / (3 * nOfResponses)) * 2.5

  const keyPerformance = {
    goalsManagement,
    independence,
    rolesClarity,
    structure,
    leadership,
    comsAndFeedback,
    planningAndDecisionMaking,
    followUps,
    acceptanceAndNorms,
    cooperation
  }

  const comments = textArray

  // Stage, based on the overall score of the 10 key performance areas
  const stageScore =
    goalsManagement +
    independence +
    rolesClarity +
    structure +
    leadership +
    comsAndFeedback +
    planningAndDecisionMaking +
    followUps +
    acceptanceAndNorms +
    cooperation

  // One major difference in the end result is that stage is now a string and not a number
  const stage = ['Stage']

  if (stageScore >= 85) {
    stage.push('4')
  } else if (stageScore >= 70) {
    stage.push('3')
  } else stage.push('1/2')

  // End result
  const stageResult = {
    engagement,
    stage: stage.join(' '),
    keyPerformance,
    comments
  }

  return stageResult
}

export default teamStageResults
