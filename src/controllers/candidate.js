import express from 'express'
import HttpStatus from 'http-status-codes'
import { check } from 'express-validator/check'
import Candidate from '../models/candidate'
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
  Candidate.findOneAndUpdate(
    { name },
    { name, availability },
    { upsert: true },
    (err) =>{
      if(err) return handleServerError(err, res)
      res.sendStatus(HttpStatus.OK)
    })
})

router.get('/:candidate/schedule', (req, res) =>{
  res.send('hello')
})

module.exports = router
