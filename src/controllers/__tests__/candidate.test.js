import express from 'express'
import request from 'supertest'
import bodyParser from 'body-parser'
import HttpStatus from 'http-status-codes'
import mockingoose from 'mockingoose'
import candidatesController from '../candidate'

const app = express()
app.use(bodyParser.json())
app.use(candidatesController)


describe('/set-availability', () => {

  const validPayload = {
    'name':'test',
    'availability':[
      { 'start': '2019-01-01T12:00:00.000Z', 'end': '2019-01-01T13:00:00.000Z' },
      { 'start': '2019-01-02T14:00:00.000Z', 'end': '2019-01-02T18:00:00.000Z' },
    ],
  }

  const doRequest = payload => (
    request(app).post('/set-availability')
      .type('form')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(payload)
  )

  test('fails with 422 status on an invalid request', async () => {
    const response = await doRequest({})
    expect(response.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY)
  })

  test('accepts a valid request, and replies with 200 OK', async () => {
    const response = await doRequest(validPayload)
    mockingoose.Candidate.toReturn({}, 'findOneAndUpdate')
    expect(response.status).toEqual(HttpStatus.OK)
  })

})

describe('/:candidate/schedule', () => {

  const sampleCandidate = {

  }

  const sampleInterviewers = [
    {},
  ]

  const doRequest = payload => (
    request(app).post(`/Carl/schedule?
      interviewer=Ines&interviewer=Ingrid`)
      .type('form')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(payload)
  )

  test('happy path', async () => {
    const expectedReponse = {

    }
    const response = await doRequest()
    mockingoose.Candidate.toReturn(sampleCandidate, 'findOne')
    mockingoose.Interviewer.toReturn(sampleInterviewers, 'find')
    expect(response.body).toEqual(expectedReponse)
  })

})
