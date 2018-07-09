import mongoose from 'mongoose'

var interviewerSchema = mongoose.Schema({
  name: String,
  availability : [Date],
})

module.exports = mongoose.model('Interviewer', interviewerSchema)
