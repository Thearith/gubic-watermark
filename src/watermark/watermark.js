const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')

const fsPromises = fs.promises

const WATERMARK_DIR         = path.resolve('./watermarks')
const JUST_LOGO_FILE        = 'Logo.png'

const ORIGINAL_PHOTOS_DIR   = path.resolve('./photos')
const RESULT_PHOTOS_DIR     = path.resolve('./results')

async function watermarkImage(original) {
    const originalImg = await Jimp.read(Buffer.from(original.buffer, 'base64'))
    const dimension = sizeOf(original.buffer)

    // Get correct watermark
    const originalWidth = dimension.width
    const originalHeight = dimension.height
    const watermarkPath = `${WATERMARK_DIR}/${JUST_LOGO_FILE}`
    const watermarkImg = await Jimp.read(watermarkPath)

    // Resize watermark to original image size
    watermarkImg.resize(originalWidth, originalHeight)

    // Overlay watermark on top of image
    originalImg.composite(watermarkImg, 0, 0)

    return originalImg
}

async function watermarkLocalImages(
    originalPath,
    resultPath
) {
    const originalImg = await Jimp.read(originalPath)

    // Get correct watermark
    const originalWidth = originalImg.bitmap.width
    const originalHeight = originalImg.bitmap.height
    const watermarkPath = getWatermark(originalWidth, originalHeight)
    console.log(watermarkPath + "\n")
    const watermarkImg = await Jimp.read(watermarkPath)

    // Resize watermark to original image size
    watermarkImg.resize(originalWidth, originalHeight)

    // Overlay watermark on top of image
    originalImg.composite(watermarkImg, 0, 0)

    await originalImg.writeAsync(resultPath)
}

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
        await watermarkLocalImages(originalPath, resultPath)
    }
}

module.exports = {
    watermarkImage,
    run
}

require('make-runnable')
