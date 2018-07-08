import mongoose from 'mongoose'

var candidateSchema = mongoose.Schema({
  name: String,
  availability : [{ start: Date, end: Date }],
})

module.exports = mongoose.model('Candidate', candidateSchema)
