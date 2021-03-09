const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("API server is listening on port " + port)
})