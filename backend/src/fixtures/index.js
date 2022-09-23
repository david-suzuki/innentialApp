import users from './_users'
import categoriesAndSkills from './skills/_skills'
import interests from './interests/_interests'
import industries from './industries/_industries'
import linesOfWork from './linesOfWork/_linesOfWork'
import contentSources from './contentSources/_contentSources'
import cypressTest from './cypress/_cypress'
import quickStart from './quickStart/_quickStart'
;(async () => {
  await users()
  await categoriesAndSkills()
  await interests()
  await industries()
  await linesOfWork()
  await contentSources()
  await cypressTest()
  await quickStart()
})()

export { skillsData, categoriesData } from './skills'
