import express from 'express'
import HttpStatus from 'http-status-codes'
import { check } from 'express-validator/check'
import { sanitizeBody } from 'express-validator/filter'
import Candidate from '../models/candidate'
import Interviewer from '../models/interviewer'
import { handleValidationErrors, handleServerError } from './utils/errorHandling'
import { truncateDateToHour, getAvailableBlocks } from './utils/dateUtils'

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
  Candidate.findOneAndUpdate(
    { name },
    { name, availability },
    { upsert: true },
    (err) => {
      if(err) return handleServerError(err, res)
      res.sendStatus(HttpStatus.OK)
    })
})

router.get('/:candidate/schedule', (req, res) => {
  const candidateName = req.params.candidate
  const interviewers = req.query.interviewer
  Candidate.findOne({ name: candidateName }, (err, candidate) => {
    if(err) return handleServerError(err, res)
    if(!candidate) return res.sendStatus(HttpStatus.NOT_FOUND)
    const interviewersQuery = getInterviewersQuery(interviewers)
    Interviewer.find(interviewersQuery, (err, interviewers) => {
      if(err) return handleServerError(err, res)
      res.json(getAvailableBlocks(candidate, interviewers))
    })
  })
})

const getInterviewersQuery = (interviewers) => {
  if(!interviewers) return {}
  if(Array.isArray(interviewers)){
    return { name: {$in: interviewers} }
  }
  return { name: interviewers }
}

export default router
