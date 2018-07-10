import mongoose from 'mongoose'

var candidateSchema = mongoose.Schema({
  name: String,
  availability : [{ start: Date, end: Date }],
})

export default mongoose.model('Candidate', candidateSchema)
