import express from 'express'
import HttpStatus from 'http-status-codes'
import { check } from 'express-validator/check'
import { sanitizeBody } from 'express-validator/filter'
import Candidate from '../models/candidate'
import Interviewer from '../models/interviewer'
import { handleValidationErrors, handleServerError } from './utils/errorHandling'
import { truncateDateToHour, getAvailableBlocks } from './utils/dateUtils'
import { getInterviewersQuery } from './utils/queries'

const router = express.Router()

/**
 * @api {post} /candidate/set-availability
 * @apiName SetCandidateAvailability
 * @apiGroup Candidate
 *
 * @apiParam (Request body) {String} name candidate name
 * @apiParam (Request body) {Array} availability array with the availability of the candidate
 * @apiParam (Request body) {Date} availability.start availability start date (ISO8601 format)
 * @apiParam (Request body) {Date} availability.end availability end date (ISO8601 format)
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
 *   http://localhost:3000/candidate/set-availability
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *
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
  Candidate.findOneAndUpdate(
    { name },
    { name, availability },
    { upsert: true },
    err => {
      if (err) return handleServerError(err, res)
      res.sendStatus(HttpStatus.OK)
    })
})


/**
 * @api {post} /:candidate/schedule?interviewer=:interviewer
 * @apiName getCandidateSchedule
 * @apiGroup Candidate
 *
 *
 *
 * @apiParam {String} candidate candidate name
 * @apiParam {String} interviewer interviewer name (can be multiple)
 *
 * @apiExample {curl} Example usage:
 * http://localhost:3000/candidate/test-user/schedule
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */
router.get('/:candidate/schedule', (req, res) => {
  const candidateName = req.params.candidate
  const interviewers = req.query.interviewer
  Candidate.findOne({ name: candidateName }, (err, candidate) => {
    if (err) return handleServerError(err, res)
    if (!candidate) return res.sendStatus(HttpStatus.NOT_FOUND)
    const interviewersQuery = getInterviewersQuery(interviewers)
    Interviewer.find(interviewersQuery, (err, interviewers) => {
      if (err) return handleServerError(err, res)
      res.json(getAvailableBlocks(candidate, interviewers))
    })
  })
})

export default router
