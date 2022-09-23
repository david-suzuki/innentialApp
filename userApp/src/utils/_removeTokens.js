import { JWT } from '../environment'

export const removeTokens = () => {
  window.localStorage.removeItem(JWT.LOCAL_STORAGE.TOKEN.NAME)
  window.localStorage.removeItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME)
}
