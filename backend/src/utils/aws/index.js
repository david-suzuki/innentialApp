import aws from 'aws-sdk'
import { sentryCaptureException } from '../_sentryCaptureException'

export const S3 = {
  BUCKET: process.env.S3_BUCKET,
  CREDENTIALS: {
    signatureVersion: 'v4',
    region: 'eu-central-1',
    accessKeyId: process.env.X_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.X_AWS_SECRET_ACCESS_KEY
  }
}

export const s3 = new aws.S3(S3.CREDENTIALS)

export const downloadPdf = ({ organizationName, teamName, stageResultID }) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${organizationName}/teams/${teamName}/reports/${stageResultID}.pdf`,
    Expires: 30 * 60
  }

  return s3.getSignedUrl('getObject', params)
}

// users/profileImgs, 500 * 60

// export const getUploadLink = ({ userId, contentType }) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `users/profileImgs/${userId}`,
//     Expires: 30 * 60,
//     ContentType: contentType
//   }

//   return s3.getSignedUrl('putObject', params)
// }

// export const getDownloadLink = async ({ userId }) => {
//   const checkParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `users/profileImgs/${userId}`
//   }

//   const getParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `users/profileImgs/${userId}`,
//     Expires: 500 * 60
//   }

//   try {
//     const headInfo = await s3.headObject(checkParams).promise()
//     if (headInfo) return s3.getSignedUrl('getObject', getParams)
//   } catch (e) {
//     return null
//   }
// }

// user-content, 500 * 60

// export const getUploadLink = ({ contentId, contentType }) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `user-content/${contentId}`,
//     Expires: 30 * 60,
//     ContentType: contentType
//   }

//   return s3.getSignedUrl('putObject', params)
// }

// export const getDownloadLink = async ({ contentId }) => {
//   const checkParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `user-content/${contentId}`
//   }

//   const getParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `user-content/${contentId}`,
//     Expires: 500 * 60
//   }

//   try {
//     const headInfo = await s3.headObject(checkParams).promise()
//     if (headInfo) return s3.getSignedUrl('getObject', getParams)
//   } catch (e) {
//     return null
//   }
// }

export const deleteAWSContent = async ({ awsId, key }) => {
  if (key) {
    const checkParams = {
      Bucket: process.env.S3_BUCKET,
      Key: `${key}/${awsId}`
    }
    const deleted = await s3.deleteObject(checkParams).promise()
  } else {
    const checkParams = {
      Bucket: process.env.S3_BUCKET,
      Key: `user-content/${awsId}`
    }

    const deleted = await s3.deleteObject(checkParams).promise() // eslint-disable-line
  }
  // console.log('AWS DELETE PDF RESP', deleted)
}

export const userCanUploadFile = async contentIds => {
  const maxLimit = 5e7 // 50MB
  let fileSum = 0

  await Promise.all(
    contentIds.map(async contentId => {
      const checkParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `user-content/${contentId}`
      }
      try {
        const headInfo = await s3.headObject(checkParams).promise()
        fileSum += headInfo.ContentLength
        return headInfo
      } catch (e) {
        // TODO: WHAT TODO WITH missing files?

        return 'error'
      }
    })
  )

  // console.log({ allFiles })

  // console.log({ fileSum })

  return {
    canUpload: maxLimit > fileSum,
    usersTotal: fileSum
  }
}

// sources/icons, 500 * 60

// export const getUploadLink = ({ sourceId, contentType }) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `sources/icons/${sourceId}`,
//     Expires: 30 * 60,
//     ContentType: contentType
//   }

//   return s3.getSignedUrl('putObject', params)
// }

// export const getDownloadLink = async ({ sourceId }) => {
//   const checkParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `sources/icons/${sourceId}`
//   }

//   const getParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `sources/icons/${sourceId}`,
//     Expires: 500 * 60
//   }

//   try {
//     const headInfo = await s3.headObject(checkParams).promise()
//     if (headInfo) return s3.getSignedUrl('getObject', getParams)
//   } catch (e) {
//     return null
//   }
// }

// learning-paths/banners

// export const getUploadBannerLink = ({ pathId, contentType }) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-paths/banners/${pathId}`,
//     Expires: 30 * 60,
//     ContentType: contentType
//   }

//   return s3.getSignedUrl('putObject', params)
// }

// export const getDownloadBannerLink = async ({ pathId }) => {
//   const checkParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-paths/banners/${pathId}`
//   }

//   const getParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-paths/banners/${pathId}`
//   }

//   try {
//     const headInfo = await s3.headObject(checkParams).promise()
//     if (headInfo) return s3.getSignedUrl('getObject', getParams)
//   } catch (e) {
//     return null
//   }
// }

// learning-content/thumbnails

// export const getUploadLink = ({ contentId, contentType }) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-content/thumbnails/${contentId}`,
//     Expires: 30 * 60,
//     ContentType: contentType
//   }

//   return s3.getSignedUrl('putObject', params)
// }

// export const getDownloadLink = async ({ contentId }) => {
//   const checkParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-content/thumbnails/${contentId}`
//   }

//   const getParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-content/thumbnails/${contentId}`
//   }

//   try {
//     const headInfo = await s3.headObject(checkParams).promise()
//     if (headInfo) return s3.getSignedUrl('getObject', getParams)
//   } catch (e) {
//     return null
//   }
// }

// learning-paths/authors

// export const getUploadAuthorImgLink = ({ pathId, contentType }) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-paths/authors/${pathId}`,
//     Expires: 30 * 60,
//     ContentType: contentType
//   }

//   return s3.getSignedUrl('putObject', params)
// }

// export const getDownloadAuthorImgLink = async ({ pathId }) => {
//   const checkParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-paths/authors/${pathId}`
//   }

//   const getParams = {
//     Bucket: process.env.S3_BUCKET,
//     Key: `learning-paths/authors/${pathId}`
//   }

//   try {
//     const headInfo = await s3.headObject(checkParams).promise()
//     if (headInfo) return s3.getSignedUrl('getObject', getParams)
//   } catch (e) {
//     return null
//   }
// }

export const getUploadLink = async ({ key, _id, contentType }) => {
  if (!key || !_id) {
    throw new Error(`Valid arguments not provided`)
  }
  if (String(key).startsWith('/') || String(key).endsWith('/')) {
    throw new Error(`Invalid key structure`)
  }

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${key}/${_id}`,
    Expires: 30 * 60,
    ContentType: contentType
  }

  return s3.getSignedUrl('putObject', params)
}

export const duplicateImage = async ({ oldPathId, newPathId, key }) => {
  await s3.copyObject(
    {
      Bucket: process.env.S3_BUCKET,
      CopySource: `${process.env.S3_BUCKET}/${key}/${oldPathId}`,
      Key: `${key}/${newPathId}`
    },
    (err, data) => {
      if (err) {
        sentryCaptureException(err)
      }
      return data
    }
  )
}

export const getDownloadLink = async ({ key, _id, expires }) => {
  if (!key || !_id) return null

  if (String(key).startsWith('/') || String(key).endsWith('/')) {
    throw new Error(`Invalid key structure`)
  }

  const checkParams = {
    Bucket: process.env.S3_BUCKET,
    Key: `${key}/${_id}`
  }

  const getParams = {
    Bucket: process.env.S3_BUCKET,
    Key: `${key}/${_id}`,
    ...(expires && { Expires: expires })
  }

  try {
    const headInfo = await s3.headObject(checkParams).promise()
    if (headInfo) return s3.getSignedUrl('getObject', getParams)
  } catch (e) {
    return null
  }
}
