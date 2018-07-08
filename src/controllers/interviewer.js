import express from 'express'
import HttpStatus from 'http-status-codes'
import { check } from 'express-validator/check'
import Interviewer from '../models/interviewer'
import { handleValidationErrors, handleServerError } from './utils/errorHandling'

const router = express.Router()

router.post('/set-availability', [
  check('name').isAlpha(),
  check('availability.*.start').isISO8601(),
  check('availability.*.end').isISO8601(),
],
handleValidationErrors,
(req, res) =>{
  const { name, availability } = req.body
  Interviewer.findOneAndUpdate(
    { name },
    { name, availability },
    { upsert: true },
    (err) =>{
      if(err) return handleServerError(err, res)
      res.sendStatus(HttpStatus.OK)
    })
})

module.exports = router
