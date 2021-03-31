const fs = require('fs')
const path = require('path')
const watermarkProcessor = require('./watermark')
const fsPromises = fs.promises

const ORIGINAL_PHOTOS_DIR   = path.resolve('./photos')
const RESULT_PHOTOS_DIR     = path.resolve('./results')

async function getAllImages(dir) {
    const files = await fsPromises.readdir(dir)
    const imageFiles = files.filter((file) => file.charAt(0) != '.')
    return imageFiles
}

async function run() {
    const imageFiles = await getAllImages(ORIGINAL_PHOTOS_DIR)
    for (let i=0; i<imageFiles.length; i++) {
        const fileName = imageFiles[i]
        const originalPath = `${ORIGINAL_PHOTOS_DIR}/${fileName}`
        const resultPath = `${RESULT_PHOTOS_DIR}/${fileName}`

        console.log(`Watermarking ${fileName} ...`)
        await watermarkProcessor.watermarkLocalImages(originalPath, resultPath)
    }
}

module.exports = {
    run
}

require('make-runnable')
