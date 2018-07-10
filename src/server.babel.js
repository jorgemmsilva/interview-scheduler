import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dbconfig from './config/database'
import candidate from './controllers/candidate'
import interviewer from './controllers/interviewer'

const DEFAULT_PORT = 3000

mongoose.Promise = global.Promise
mongoose.connect(dbconfig.url, { useNewUrlParser:true })

const app = express()

//Logger Middleware
app.use(morgan('dev'));

//Gzip compression
app.use(compression())

//BodyParser Middleware
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

//setup endpoints
app.use('/candidate', candidate)
app.use('/interviewer', interviewer)

//Start server
app.listen(process.env.PORT || DEFAULT_PORT, () => {
  console.log('>>> Server Started on PORT: ' + (process.env.PORT || DEFAULT_PORT)) //eslint-disable-line no-console
})

export default app
