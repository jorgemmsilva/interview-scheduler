import express from 'express'
import HttpStatus from 'http-status-codes'
import { check } from 'express-validator/check'
import { sanitizeBody } from 'express-validator/filter'
import flatten from 'lodash/flatten'
import Interviewer from '../models/interviewer'
import { handleValidationErrors, handleServerError } from './utils/errorHandling'
import { truncateDateToHour, getBlocksFromTimeInterval } from './utils/dateUtils'

const router = express.Router()

router.post('/set-availability', [
  check('name').isString(),
  check('availability.*.start').isISO8601(),
  check('availability.*.end').isISO8601(),
],
handleValidationErrors,
sanitizeBody('availability.*.*').customSanitizer(truncateDateToHour),
(req, res) => {
  const { name, availability } = req.body
  Interviewer.findOneAndUpdate(
    { name },
    { name, availability: flatten(availability.map(getBlocksFromTimeInterval)) },
    { upsert: true },
    err => {
      if (err) return handleServerError(err, res)
      res.sendStatus(HttpStatus.OK)
    })
})

export default router
