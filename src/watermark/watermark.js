const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')

const fsPromises = fs.promises

const WATERMARK_DIR         = path.resolve('./watermarks')
const RATIO_1_1_FILE        = '1-1.png'
const RATIO_3_4_FILE        = '3-4.png'
const RATIO_4_3_FILE        = '4-3.png'
const RATIO_9_16_FILE       = '9-16.png'
const RATIO_16_9_FILE       = '16-9.png'

const ORIGINAL_PHOTOS_DIR   = path.resolve('./photos')
const RESULT_PHOTOS_DIR     = path.resolve('./results')

async function watermarkImage(original) {
    const originalImg = await Jimp.read(Buffer.from(original.buffer, 'base64'))
    const dimension = sizeOf(original.buffer)

    // Get correct watermark
    const originalWidth = dimension.width
    const originalHeight = dimension.height
    const watermarkPath = getWatermark(originalWidth, originalHeight)
    console.log(watermarkPath + "\n")
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

function getWatermark(imageWidth, imageHeight) {
    const ratio = imageWidth / imageHeight
    
    if (ratio < 0.7) {
        return `${WATERMARK_DIR}/${RATIO_9_16_FILE}`
    } else if (ratio < 0.95) {
        return `${WATERMARK_DIR}/${RATIO_3_4_FILE}`
    } else if (ratio < 1.3) {
        return `${WATERMARK_DIR}/${RATIO_1_1_FILE}`
    } else if (ratio < 1.7) {
        return `${WATERMARK_DIR}/${RATIO_4_3_FILE}`
    } else {
        return `${WATERMARK_DIR}/${RATIO_16_9_FILE}`
    }

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
