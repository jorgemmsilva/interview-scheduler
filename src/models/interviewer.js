import mongoose from 'mongoose'

var interviewerSchema = mongoose.Schema({
  name: String,
  availability : [Date],
})

export default mongoose.model('Interviewer', interviewerSchema)
