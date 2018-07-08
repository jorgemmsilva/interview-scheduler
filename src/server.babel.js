import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'

const DEFAULT_PORT = 3000

//init app
const app = express()

//Gzip compression
app.use(compression())

//BodyParser Middleware
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

app.listen(process.env.PORT || DEFAULT_PORT, () => {
  console.log('>>> Server Started on PORT: ' + (process.env.PORT || DEFAULT_PORT)) //eslint-disable-line no-console
})

module.exports = app
