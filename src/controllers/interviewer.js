import express from 'express'
import HttpStatus from 'http-status-codes'
import { check } from 'express-validator/check'
import { sanitize, sanitizeBody } from 'express-validator/filter'
import Interviewer from '../models/interviewer'
import { handleValidationErrors, handleServerError } from './utils/errorHandling'
import { truncateDateToHour } from './utils/dateUtils'

const router = express.Router()

router.post('/set-availability', [
  check('name').isString(),
  check('availability.*').isISO8601(),
],
handleValidationErrors,
sanitizeBody('availability.*').customSanitizer(truncateDateToHour),
(req, res) => {
  const { name, availability } = req.body
  Interviewer.findOneAndUpdate(
    { name },
    { name, availability },
    { upsert: true },
    (err) => {
      if(err) return handleServerError(err, res)
      res.sendStatus(HttpStatus.OK)
    })
})

module.exports = router
