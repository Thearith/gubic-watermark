const express = require('express')
const asyncWrap = require('../../AsyncMiddleware')
const Multer = require('multer')

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
            
            // await uploadFileToGCS(file, directoryName)
        }
	})
)

module.exports = router