import mongoose from 'mongoose'

var interviewerSchema = mongoose.Schema({
  name: String,
  availability : [{ start: Date, end: Date }],
})

module.exports = mongoose.model('Interviewer', interviewerSchema)
