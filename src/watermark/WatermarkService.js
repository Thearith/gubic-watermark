const express = require('express')
const Multer = require('multer')
const watermark = require('./watermark')
const asyncWrap = require('../error/AsyncMiddleware')
const HttpCodes = require('../HttpCodes')
const upload = require('./uploads/upload')

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
            const file = await upload.uploadFileToGCS(watermarkImage)
            
            res.status(HttpCodes.OK).json({
                fileName: file.originalname,
                gcsUrl: file.gcsUrl
            })
            res.sendStatus(200)
        }

        // res.end()
	})
)

module.exports = router