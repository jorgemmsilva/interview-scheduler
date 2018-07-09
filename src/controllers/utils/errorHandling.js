import HttpStatus from 'http-status-codes'
import { validationResult } from 'express-validator/check'

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()
  res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() })
}

export const handleServerError = (err, res) => {
  console.log(err) //eslint-disable-line no-console
  res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
}
