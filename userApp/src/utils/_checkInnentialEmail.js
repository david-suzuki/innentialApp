import { captureFilteredError } from '../components/general'

export const isNotInnentialEmail = email => {
  // CHECKS IF THE EMAIL IS @innential.com or @waat.eu
  if (!email) {
    captureFilteredError(`Email is not provided`)
    return true
  }

  const [_, domain] = email.split('@')

  return domain !== 'innential.com' && domain !== 'waat.eu'
}
