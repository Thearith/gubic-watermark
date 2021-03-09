const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const watermarkService = require('./watermark/WatermarkService')

const app = express()
app.use(bodyParser.json())
app.use(watermarkService)

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("API server is listening on port " + port)
})