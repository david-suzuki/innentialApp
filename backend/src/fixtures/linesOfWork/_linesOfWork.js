import { LinesOfWork } from '~/models'
import slug from 'slug'
import { linesOfWorkData } from './_linesOfWorkData.js'

export default async () => {
  const linesOfWork = await LinesOfWork.find()
  if (linesOfWork.length === 0) {
    const updatedLinesOfWork = linesOfWorkData.map(lineOfWork => ({
      name: lineOfWork.name,
      // TODO: update slug using the .pre middleware by Mongoose
      slug: slug(lineOfWork.name, {
        replacement: '_',
        lower: true
      })
    }))
    await LinesOfWork.insertMany(updatedLinesOfWork, (error, docs) => {
      if (error) {
        throw new Error(error)
      } else {
        console.log('Lines Of Work added sucessfully')
      }
    })
  }
}
