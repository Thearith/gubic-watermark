const { Storage } = require('@google-cloud/storage')
const path = require('path')
const dotenv = require('dotenv')
const moment = require('moment')

dotenv.config()

const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID
const GOOGLE_CLOUD_KEYFILE = path.join(__dirname, './google-storage-key.json')

const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
})

function getFileName(originalName) {
    const dateTime = moment().format('YYYY-MM-DD HH:mm a')
    return `${dateTime}-${originalName}`
}

function getPublicUrl(bucketName, fileName) {
    return `https://storage.googleapis.com/${bucketName}/${fileName}`
}

module.exports = {
    getPublicUrl,
    getFileName,
    storage
}