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
    const ratioWidth = imageWidth / 1080
    const ratioHeight = imageHeight / 1080
    
    const logo = await Jimp.read(LOGO_PATH)
    const resizeWidth = 360 * ratioWidth
    logo.resize(resizeWidth, Jimp.AUTO)

    const marginTop = ratioHeight * 40
    const marginRight = ratioWidth * 40
    const positionX = imageWidth - marginRight - resizeWidth
    const positionY = marginTop
    originalImg.composite(logo, positionX, positionY)
}

async function watermarkEllipse(originalImg, imageWidth, imageHeight) {
    const ratioWidth = imageWidth / 1080

    const logo = await Jimp.read(ELLIPSE_PATH)
    const resizeWidth = ratioWidth * 640
    logo.resize(resizeWidth, Jimp.AUTO)

    const positionX = imageWidth - resizeWidth + 40
    const positionY = -50
    originalImg.composite(logo, positionX, positionY)
}

async function watermarkGradient(originalImg, imageWidth, imageHeight) {
    const ratioHeight = imageHeight / 1080

    const logo = await Jimp.read(GRADIENT_PATH)
    const resizeWidth = imageWidth
    const resizeHeight = 160 * ratioHeight
    logo.resize(resizeWidth, resizeHeight)

    const positionX = 0
    const positionY = imageHeight - resizeHeight
    originalImg.composite(logo, positionX, positionY)
}

async function watermarkSlogans(originalImg, imageWidth, imageHeight) {
    const ratioWidth = imageWidth / 1080
    const ratioHeight = imageHeight / 1080

    // core value at bottom left
    const coreValue = await Jimp.read(CORE_VALUE_PATH)
    coreValue.resize(Jimp.AUTO, 53)
    const resizeHeight = coreValue.bitmap.height
    const marginLeft = ratioWidth * 20
    const marginBottom = ratioHeight * 24
    const positionX = marginLeft
    const positionY = imageHeight - marginBottom - resizeHeight / 2
    originalImg.composite(coreValue, positionX, positionY)

    // slogan above core value
    const slogan = await Jimp.read(SLOGAN_PATH)
    slogan.resize(Jimp.AUTO, 70)
    const sResizeHeight = slogan.bitmap.height
    const sMarginLeft = ratioWidth * 20
    const sMarginBottom = ratioHeight * 8
    const sPositionX = sMarginLeft
    const sPositionY = imageHeight - (resizeHeight + marginBottom) - (sResizeHeight / 2 + sMarginBottom)
    originalImg.composite(slogan, sPositionX, sPositionY)
}

async function watermarkPhoneNumber(originalImg, imageWidth, imageHeight) {
    const ratioWidth = imageWidth / 1080
    const ratioHeight = imageHeight / 1080

    // Phone Number
    const phoneNumber = await Jimp.read(PHONE_NUMBER_PATH)
    phoneNumber.resize(Jimp.AUTO, 40)
    const resizeWidth = phoneNumber.bitmap.width
    const resizeHeight = phoneNumber.bitmap.height
    const marginLeft = ratioWidth * 20
    const marginBottom = ratioHeight * 28
    const positionX = imageWidth - marginLeft - resizeWidth 
    const positionY = imageHeight - marginBottom - resizeHeight / 2
    originalImg.composite(phoneNumber, positionX, positionY)

    // Phone Number Text
    const phoneNumberText = await Jimp.read(PHONE_NUMBER_TEXT_PATH)
    phoneNumberText.resize(Jimp.AUTO, 55)
    const tResizeWidth = phoneNumberText.bitmap.width
    const tResizeHeight = phoneNumberText.bitmap.height
    const tMarginLeft = ratioWidth * 20
    const tMarginBottom = ratioHeight * 15
    const tPositionX = imageWidth - tMarginLeft - tResizeWidth
    const tPositionY = imageHeight - (resizeHeight + marginBottom) - (tResizeHeight / 2 + tMarginBottom)
    originalImg.composite(phoneNumberText, tPositionX, tPositionY)

    // Phone Icon
    const phoneIcon = await Jimp.read(PHONE_ICON_PATH)
    const pResizeWidth = 40 * ratioWidth
    phoneIcon.resize(pResizeWidth, Jimp.AUTO)
    const pResizeHeight = phoneIcon.bitmap.height
    const pMarginBottom = ratioHeight * 18
    const paddingLeft = ratioWidth * 15
    const pPositionX = imageWidth - (marginLeft + tResizeWidth) - (pResizeWidth + paddingLeft)
    const pPositionY = imageHeight - (resizeHeight + marginBottom) - (pResizeHeight / 2 + pMarginBottom)
    originalImg.composite(phoneIcon, pPositionX, pPositionY)
}

module.exports = {
    watermarkImage,
    watermarkLocalImages
}