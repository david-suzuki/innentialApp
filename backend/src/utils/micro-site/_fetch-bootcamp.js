import { BootcampResult } from '../../models'
import bootcampData from './constants/_bootcamps.js'
import { mapBootcamps, verifyBootcampResult } from './'

const fetchResult = async (resultId, key) => {
  if (key) {
    await verifyBootcampResult(key)
  }

  const result = await BootcampResult.findOne({ resultId })

  if (!result) throw new Error(`Not found`)

  const verified = !!result.confirmation.verifiedAt

  const bootcamps = result.bootcampsMatched
    .map(url => bootcampData.find(bootcamp => bootcamp.url === url))
    .map(camp => {
      if (!camp) return

      const unavailableFinancing = [
        ...(!result.criteria.isGermanResident && ['Income share']),
        ...(!result.criteria.isAgenturSigned && ['Bildungsgutschein'])
      ]

      const financing = camp.financing
        .split(', ')
        .filter(option => !unavailableFinancing.includes(option))
        .join(', ')

      return {
        ...camp,
        financing
      }
    })
    .filter(item => !!item)

  return {
    verified,
    nBootcamps: bootcamps.length,
    nOptions: bootcamps.reduce((acc, curr) => {
      const array = acc

      const options = curr.financing.split(', ')
      options.forEach(option => {
        if (!array.includes(option)) {
          array.push(option)
        }
      })

      return array
    }, []).length,
    location: result.criteria.location,
    remote: result.criteria.remote,
    bootcampData: verified ? mapBootcamps(bootcamps) : [],
    email: result.email
  }
}

export default fetchResult
