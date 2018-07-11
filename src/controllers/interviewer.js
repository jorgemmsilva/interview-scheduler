import express from 'express'
import HttpStatus from 'http-status-codes'
import { check } from 'express-validator/check'
import { sanitizeBody } from 'express-validator/filter'
import flatten from 'lodash/flatten'
import Interviewer from '../models/interviewer'
import { handleValidationErrors, handleServerError } from './utils/errorHandling'
import { truncateDateToHour, getBlocksFromTimeInterval } from './utils/dateUtils'

const router = express.Router()

/**
 * @api {post} /interviewer/set-availability
 * @apiName SetInterviewerAvailability
 * @apiGroup Interviewer
 *
 * @apiParam (Request body) {String} name interviewer name
 * @apiParam (Request body) {Object[]} availability array with the availability of the interviewer
 * @apiParam (Request body) {Date} availability.start availability start date (ISO8601 format)
 * @apiParam (Request body) {Date} availability.end availability end date (ISO8601 format)
 *
 *
 * @apiExample {curl} Example usage:
 * curl --header "Content-Type: application/json" \
 *   --request POST \
 *   --data '{
 *   "name":"test-user",
 *   "availability":[
 *       { "start": "2018-07-16T09:00:00.000Z", "end": "2018-07-16T10:00:00.000Z" },
 *       { "start": "2018-07-17T09:00:00.000Z", "end": "2018-07-17T10:00:00.000Z" },
 *       { "start": "2018-07-18T10:00:00.000Z", "end": "2018-07-18T12:00:00.000Z" },
 *       { "start": "2018-07-19T09:00:00.000Z", "end": "2018-07-19T10:00:00.000Z" },
 *       { "start": "2018-07-20T09:00:00.000Z", "end": "2018-07-20T10:00:00.000Z" }
 *   ]
 *   }' \
 *   http://localhost:3000/interviewer/set-availability
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *     	"errors": [
 *     		{
 *     			"location": "body",
 *     			"param": "name",
 *     			"msg": "Invalid value"
 *     		}
 *     	]
 *     }
 */

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
