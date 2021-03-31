const Jimp = require('jimp')
const path = require('path')
const sizeOf = require('image-size')

const WATERMARK_DIR             = path.resolve('./watermarks-logo')
const LOGO_PATH                 = WATERMARK_DIR + '/Logo.png'
const ELLIPSE_PATH              = WATERMARK_DIR + '/Ellipse.png'
const GRADIENT_PATH             = WATERMARK_DIR + '/Bottom Gradient.png'
const SLOGAN_PATH               = WATERMARK_DIR + '/Slogan.png'
const CORE_VALUE_PATH           = WATERMARK_DIR + '/Core value.png'
const PHONE_NUMBER_TEXT_PATH    = WATERMARK_DIR + '/Phone Number Text.png'
const PHONE_NUMBER_PATH         = WATERMARK_DIR + '/Phone Number.png'
const PHONE_ICON_PATH           = WATERMARK_DIR + '/Phone Icon.png'     

async function watermarkImage(original) {
    const originalImg = await Jimp.read(Buffer.from(original.buffer, 'base64'))
    const dimension = sizeOf(original.buffer)
    const originalWidth = dimension.width
    const originalHeight = dimension.height

    // Watermarking process
    await watermarkEllipse(originalImg, originalWidth, originalHeight)
    await watermarkLogo(originalImg, originalWidth, originalHeight)
    await watermarkGradient(originalImg, originalWidth, originalHeight)
    await watermarkSlogans(originalImg, originalWidth, originalHeight)
    await watermarkPhoneNumber(originalImg, originalWidth, originalHeight)

    return originalImg
}

async function watermarkLocalImages(originalPath, resultPath) {
    const originalImg = await Jimp.read(originalPath)
    const originalWidth = originalImg.bitmap.width
    const originalHeight = originalImg.bitmap.height
    
    // Watermarking process
    await watermarkEllipse(originalImg, originalWidth, originalHeight)
    await watermarkLogo(originalImg, originalWidth, originalHeight)
    await watermarkGradient(originalImg, originalWidth, originalHeight)
    await watermarkSlogans(originalImg, originalWidth, originalHeight)
    await watermarkPhoneNumber(originalImg, originalWidth, originalHeight)

    await originalImg.writeAsync(resultPath)
}

async function watermarkLogo(originalImg, imageWidth, imageHeight) {
    const ratio = getRatio(imageWidth, imageHeight)
    
    const logo = await Jimp.read(LOGO_PATH)
    const resizeWidth = 360 * ratio
    logo.resize(resizeWidth, Jimp.AUTO)

    const marginTop = ratio * 40
    const marginRight = ratio * 40
    const positionX = imageWidth - marginRight - resizeWidth
    const positionY = marginTop
    originalImg.composite(logo, positionX, positionY)
}

async function watermarkEllipse(originalImg, imageWidth, imageHeight) {
    const ratio = getRatio(imageWidth, imageHeight)

    const logo = await Jimp.read(ELLIPSE_PATH)
    const resizeWidth = ratio * 640
    logo.resize(resizeWidth, Jimp.AUTO)
    const resizeHeight = logo.bitmap.height
    const positionX = imageWidth - resizeWidth * 6 / 7
    const positionY = - resizeHeight / 12
    originalImg.composite(logo, positionX, positionY)
}

async function watermarkGradient(originalImg, imageWidth, imageHeight) {
    const ratio = getRatio(imageWidth, imageHeight)

    const logo = await Jimp.read(GRADIENT_PATH)
    const resizeWidth = imageWidth
    const resizeHeight = 180 * ratio
    logo.resize(resizeWidth, resizeHeight)

    const positionX = 0
    const positionY = imageHeight - resizeHeight
    originalImg.composite(logo, positionX, positionY)
}

async function watermarkSlogans(originalImg, imageWidth, imageHeight) {
    const ratio = getRatio(imageWidth, imageHeight)

    // core value at bottom left
    const coreValue = await Jimp.read(CORE_VALUE_PATH)
    const resizeHeight = 58 * ratio
    coreValue.resize(Jimp.AUTO, resizeHeight)
    const marginLeft = ratio * 20
    const marginBottom = ratio * 26
    const positionX = marginLeft
    const positionY = imageHeight - marginBottom - resizeHeight / 2
    originalImg.composite(coreValue, positionX, positionY)

    // slogan above core value
    const slogan = await Jimp.read(SLOGAN_PATH)
    const sResizeHeight = 72 * ratio
    slogan.resize(Jimp.AUTO, sResizeHeight)
    const sMarginLeft = ratio * 20
    const sMarginBottom = ratio * 8
    const sPositionX = sMarginLeft
    const sPositionY = imageHeight - (resizeHeight + marginBottom) - (sResizeHeight / 2 + sMarginBottom)
    originalImg.composite(slogan, sPositionX, sPositionY)
}

async function watermarkPhoneNumber(originalImg, imageWidth, imageHeight) {
    const ratio = getRatio(imageWidth, imageHeight)

    // Phone Number
    const phoneNumber = await Jimp.read(PHONE_NUMBER_PATH)
    const resizeHeight = 44 * ratio
    phoneNumber.resize(Jimp.AUTO, resizeHeight)
    const resizeWidth = phoneNumber.bitmap.width
    const marginLeft = ratio * 20
    const marginBottom = ratio * 30
    const positionX = imageWidth - marginLeft - resizeWidth 
    const positionY = imageHeight - marginBottom - resizeHeight / 2
    originalImg.composite(phoneNumber, positionX, positionY)

    // Phone Number Text
    const phoneNumberText = await Jimp.read(PHONE_NUMBER_TEXT_PATH)
    const tResizeHeight = 60 * ratio
    phoneNumberText.resize(Jimp.AUTO, tResizeHeight)
    const tResizeWidth = phoneNumberText.bitmap.width
    const tMarginLeft = ratio * 20
    const tMarginBottom = ratio * 15
    const tPositionX = imageWidth - tMarginLeft - tResizeWidth
    const tPositionY = imageHeight - (resizeHeight + marginBottom) - (tResizeHeight / 2 + tMarginBottom)
    originalImg.composite(phoneNumberText, tPositionX, tPositionY)

    // Phone Icon
    const phoneIcon = await Jimp.read(PHONE_ICON_PATH)
    const pResizeWidth = 40 * ratio
    phoneIcon.resize(pResizeWidth, Jimp.AUTO)
    const pResizeHeight = phoneIcon.bitmap.height
    const pMarginBottom = ratio * 18
    const paddingLeft = ratio * 10
    const pPositionX = imageWidth - (marginLeft + tResizeWidth) - (pResizeWidth + paddingLeft)
    const pPositionY = imageHeight - (resizeHeight + marginBottom) - (pResizeHeight / 2 + pMarginBottom)
    originalImg.composite(phoneIcon, pPositionX, pPositionY)
}

function getRatio(originalWidth, originalHeight) {
    const min = Math.min(originalWidth, originalHeight)
    return min / 1080
}

module.exports = {
    watermarkImage,
    watermarkLocalImages
}