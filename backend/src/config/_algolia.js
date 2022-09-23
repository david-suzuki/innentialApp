import algolia from 'algoliasearch'
import { LearningContent, ContentSources } from '../models'
import { ENVIRONMENT } from '../environment'

const indexName = `learning_content`

const client = algolia('UDQJP7AELY', '68d45ad2cfd0637e6cd90e216a3760a9')

const index = client.initIndex(indexName)

if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
  client
    .listIndices()
    .then(({ items }) => {
      const learningIndex = items.find(({ name }) => name === indexName)
      if (!learningIndex || learningIndex.entries === 0) {
        ContentSources.find({ enabled: false })
          .select({ _id: 1 })
          .lean()
          .then((sources, err) => {
            LearningContent.find({
              inactive: { $ne: true },
              source: { $nin: sources.map(({ _id: sourceId }) => sourceId) }
            })
              .limit(50000)
              .lean()
              .then((docs, err) => {
                if (err) {
                  console.error(err)
                } else {
                  const mappedObjects = docs.map(
                    ({ title, author, relatedPrimarySkills: skills, _id }) => ({
                      objectID: String(_id),
                      title,
                      author,
                      relatedPrimarySkills: skills.map(skill => skill.name)
                    })
                  )
                  index
                    .saveObjects(mappedObjects)
                    .then(() => console.log('Uploaded items to algolia'))
                    .catch(e => console.error(e))
                }
              })
              .catch(err => console.error(err))
          })
          .catch(err => console.error(err))
      }
    })
    .catch(err => console.error(`Could not connect to algolia:${err}`))
}

export default index
