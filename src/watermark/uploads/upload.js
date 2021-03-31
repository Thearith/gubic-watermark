const gcsHelpers = require('./GCSStorage')
const dotenv = require('dotenv')
const storage = gcsHelpers.storage

dotenv.config()
const DEFAULT_BUCKET_NAME 				= process.env.DEFAULT_BUCKET_NAME
const WATERMARK_RESULT_DIRECTORY_NAME	= process.env.WATERMARK_RESULT_DIRECTORY_NAME

async function uploadFileToGCS(file) {
	const bucketName = DEFAULT_BUCKET_NAME
    const bucket = storage.bucket(bucketName)
	const directoryName = WATERMARK_RESULT_DIRECTORY_NAME
	const fileName = gcsHelpers.getFileName(file.originalname)
	const gcsFileName = `${directoryName}/${fileName}`
	const gcsFile = bucket.file(gcsFileName)

	await gcsFile.save(file.buffer, {
		metadata: {
			contentType: file.mimetype,
		}
	})
	
	await gcsFile.makePublic()
	file.gcsUrl = gcsHelpers.getPublicUrl(bucketName, gcsFileName)

	return file
}

module.exports = {
	uploadFileToGCS
}