import { BootcampResult } from '../../models'
import md5 from 'md5'
import bootcampData from './constants/_bootcamps.js'

// RESULT PREPARATION ALGORITHM

const formatLookup = {
  'Full-time (8 hours/day)': ['full-time', 'part-time'],
  'Part-time (4 hours/day)': ['part-time'],
  'Less than 4 hours/day': ['part-time']
}

const remoteLookup = {
  Onsite: false,
  Remote: true,
  'No Preference': false
}

// const sortBootcampsByBest = (bootcamps, criteria) => {
//   return bootcamps
//     .map(camp => {
//       let rating = 0

//       if(camp.locations.split(', ').includes(criteria.location))
//         rating += 2

//       const availableFinancing = camp.financing
//         .split(", ")
//         .filter(option => !criteria.unavailableFinancing.includes(option))

//       rating += availableFinancing.length

//       rating += (camp.commission * 10)

//       return {
//         ...camp,
//         rating
//       }
//     })
//     .sort((a, b) => b.rating - a.rating)
//     .slice(0, 3)
//     .map(({ rating, ...item }) => item)
// }

const sortBootcampsByBest = (bootcamps, criteria) => {
  return (
    bootcamps
      .map(camp => {
        let rating = 0

        if (new Date(camp.startsAt) > criteria.startsAt) rating += 1

        // if (
        //   camp.languages
        //     .split(', ')
        //     .some(language => criteria.language.includes(language))
        // )
        //   rating++

        // if(criteria.type && criteria.type.includes(camp.type))
        //   rating += 3

        if (
          camp.format
            .split(', ')
            .some(format => criteria.format.includes(format))
        )
          rating++

        if (camp.locations.split(', ').includes(criteria.location)) rating += 2

        // if (
        //   camp.requiredCodingExperience &&
        //   criteria.codingExperience !== 'More than a year of experience'
        // )
        //   rating -= 10

        // const availableFinancing = camp.financing
        //   .split(", ")
        //   .filter(option => !criteria.unavailableFinancing.includes(option))

        // rating += availableFinancing.length

        rating += camp.commission * 30

        return {
          rating: Math.max(rating, 0),
          ...camp
        }
      })
      .filter(
        ({ requiredCodingExperience }) =>
          !requiredCodingExperience ||
          criteria.codingExperience === 'More than a year of experience'
      )
      .sort((a, b) => b.rating - a.rating)
      // .slice(0, 3) // REMOVED LIMIT ON COURSES AS OF 13.11.20
      .map(({ rating, ...item }) => item)
  )
}

// const filterBootcampsForResult = async criteria => {
//   return bootcampData.filter(({
//     startsAt,
//     format,
//     remote,
//     locations,
//     languages,
//     type
//   }) => {
//     const dateCheck = new Date(startsAt) > criteria.startsAt
//     const formatCheck = format.split(', ').some(format => criteria.format.includes(format))
//     const languageCheck = (!languages || languages.split(', ').some(language => criteria.language.includes(language)))
//     const locationCheck = (locations.split(', ').includes(criteria.location) || Boolean(remote))
//     // const remoteCheck = (!criteria.remote || Boolean(remote))

//     return dateCheck && formatCheck && languageCheck && locationCheck /*&& remoteCheck*/ && type === 'webdev'
//   })
// }

const prepareBootcamps = async form => {
  const {
    answers,
    hidden: { resultid: resultId }
  } = form

  const existingResult = await BootcampResult.findOne({ resultId })

  if (!existingResult)
    throw new Error(`Previous result not found for ID:${resultId}`)

  if (!Array.isArray(answers)) throw new Error(`answers is not valid`)

  const { codingExperience } = existingResult

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

  const criteria = {
    // THIS FORMAT WILL BE SAVED TO THE BOOTCAMP RESULT
    isGermanResident: getAnswerFromForm('financing-resident'),
    isAgenturSigned: getAnswerFromForm('financing-aa') || false,
    startsAt: new Date(getAnswerFromForm('startsAt')),
    language: getAnswerFromForm('language') ? ['en', 'de'] : ['de'],
    format: getAnswerFromForm('format'),
    location:
      getAnswerFromForm('location-germany') ||
      getAnswerFromForm('location-other'),
    remote: getAnswerFromForm('remote'),
    codingExperience
  }

  const cleanedCriteria = {
    // THIS WILL BE PASSED TO THE FILTERING ALGORITHM
    ...criteria,
    remote: remoteLookup[criteria.remote] || false,
    format: criteria.format ? formatLookup[criteria.format] : [],
    unavailableFinancing: [
      ...(!criteria.isGermanResident && ['Income share']),
      ...(!criteria.isAgenturSigned && ['Bildungsgutschein'])
    ]
  }

  // const bootcamps = await filterBootcampsForResult(cleanedCriteria)

  const bootcamps = sortBootcampsByBest(bootcampData, cleanedCriteria)

  await BootcampResult.findOneAndUpdate(
    { resultId },
    {
      $set: {
        confirmation: {
          key: md5(resultId)
        },
        bootcampsMatched: bootcamps.map(bc => bc.url),
        criteria,
        name: getAnswerFromForm('name'),
        ...(getAnswerFromForm('feedback') && {
          feedback: getAnswerFromForm('feedback')
        })
      }
    }
  )
}

export default prepareBootcamps
