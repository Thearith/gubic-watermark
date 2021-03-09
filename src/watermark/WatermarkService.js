const express = require('express')
const Multer = require('multer')
const watermark = require('./watermark')
const asyncWrap = require('../error/AsyncMiddleware')
const HttpCodes = require('../HttpCodes')

const multer = Multer({
    storage: Multer.MemoryStorage
})

const router = express.Router()

router.post(
    "/images",
    multer.array('images'),
    asyncWrap(async (req, res) => {
        for(index in req.files) {
            const image = req.files[index]
            const watermarkImage = await watermark.watermarkImage(image)
            const file = await uploadFileToGCS(watermarkImage, directoryName)
            res.status(HttpCodes.OK).send({
                fileName: image.originalname,
                gcsUrl: file.gcsUrl
            })
        }

        res.end()
	})
)

module.exports = router