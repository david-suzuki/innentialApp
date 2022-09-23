import { BootcampResult } from '../../models'

const prepareCareer = async form => {
  const {
    answers,
    hidden: { resultid: resultId }
  } = form

  const existingResult = await BootcampResult.findOne({ resultId })

  if (existingResult) throw new Error(`resultId already in use`)

  if (!Array.isArray(answers)) throw new Error(`answers is not valid`)

  const getAnswerFromForm = key => {
    const answer = answers.find(({ field }) => field.ref === key)

    if (!answer) return null

    switch (answer.type) {
      case 'choice':
        return answer.choice.label
      case 'choices':
        return answer.choices.labels
      case 'date':
        return new Date(answer.date)
      default:
        return answer[answer.type]
    }
  }

  await BootcampResult.create({
    resultId,
    background: getAnswerFromForm('background'),
    education: getAnswerFromForm('education'),
    jobCharacteristics: getAnswerFromForm('job-chars'),
    changeProfession: getAnswerFromForm('changeProfession'),
    codingExperience: getAnswerFromForm('codingExperience')
  })
}

export default prepareCareer
