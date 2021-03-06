const Jimp = require('jimp')
const fs = require('fs')
const fsPromises = fs.promises

const WATERMARK_DIR         = 'watermarks'
const ORIGINAL_PHOTOS_DIR   = 'photos'
const RESULT_PHOTOS_DIR     = 'results'

async function watermarkImage(
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
        return `${WATERMARK_DIR}/9-16.png`
    } else if (ratio < 0.95) {
        return `${WATERMARK_DIR}/3-4.png`
    } else if (ratio < 1.3) {
        return `${WATERMARK_DIR}/1-1.png`
    } else if (ratio < 1.7) {
        return `${WATERMARK_DIR}/4-3.png`
    } else {
        return `${WATERMARK_DIR}/19-6.png`
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
        await watermarkImage(originalPath, resultPath)
    }
}

run()
