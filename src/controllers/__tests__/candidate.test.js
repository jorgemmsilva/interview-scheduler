import express from 'express'
import request from 'supertest'
import bodyParser from 'body-parser'
import HttpStatus from 'http-status-codes'
import mockingoose from 'mockingoose'
import flatten from 'lodash/flatten'
import candidatesController from '../candidate'
import { getBlocksFromTimeInterval } from '../utils/dateUtils'

const app = express()
app.use(bodyParser.json())
app.use('/', candidatesController)


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

    expect(response.status).toEqual(HttpStatus.OK)
  })

})

describe('/:candidate/schedule', () => {

  const sampleCandidate = {
    'name':'Carl',
    'availability':[
      { 'start': '2018-07-16T09:00:00.000Z', 'end': '2018-07-16T10:00:00.000Z' },
      { 'start': '2018-07-17T09:00:00.000Z', 'end': '2018-07-17T10:00:00.000Z' },
      { 'start': '2018-07-18T10:00:00.000Z', 'end': '2018-07-18T12:00:00.000Z' },
      { 'start': '2018-07-19T09:00:00.000Z', 'end': '2018-07-19T10:00:00.000Z' },
      { 'start': '2018-07-20T09:00:00.000Z', 'end': '2018-07-20T10:00:00.000Z' },
    ],
  }

  const sampleInterviewers = [
    {
      'name':'Ines',
      'availability':flatten([
        { 'start': '2018-07-16T09:00:00.000Z', 'end': '2018-07-16T16:00:00.000Z' },
        { 'start': '2018-07-17T09:00:00.000Z', 'end': '2018-07-17T16:00:00.000Z' },
        { 'start': '2018-07-18T09:00:00.000Z', 'end': '2018-07-18T16:00:00.000Z' },
        { 'start': '2018-07-19T09:00:00.000Z', 'end': '2018-07-19T16:00:00.000Z' },
        { 'start': '2018-07-20T09:00:00.000Z', 'end': '2018-07-20T16:00:00.000Z' },
      ].map(getBlocksFromTimeInterval)),
    },
    {
      'name':'Ingrid',
      'availability':flatten([
        { 'start': '2018-07-16T12:00:00.000Z', 'end': '2018-07-16T18:00:00.000Z' },
        { 'start': '2018-07-17T09:00:00.000Z', 'end': '2018-07-17T12:00:00.000Z' },
        { 'start': '2018-07-18T12:00:00.000Z', 'end': '2018-07-18T18:00:00.000Z' },
        { 'start': '2018-07-19T09:00:00.000Z', 'end': '2018-07-19T12:00:00.000Z' },
      ].map(getBlocksFromTimeInterval)),
    },
  ]

  const doRequest = () => (
    request(app)
      .get('/Carl/schedule?interviewer=Ines&interviewer=Ingrid')
      .set('Accept', 'application/json')
  )

  test('happy path', async () => {
    const expectedReponse = [
      {
        'availableBlocks': [
          '2018-07-16T09:00:00.000Z',
          '2018-07-17T09:00:00.000Z',
          '2018-07-18T10:00:00.000Z',
          '2018-07-18T11:00:00.000Z',
          '2018-07-19T09:00:00.000Z',
          '2018-07-20T09:00:00.000Z',
        ],
        'interviewer': 'Ines',
      },
      {
        'availableBlocks': [
          '2018-07-17T09:00:00.000Z',
          '2018-07-19T09:00:00.000Z',
        ],
        'interviewer': 'Ingrid',
      },
    ]
    mockingoose.Candidate.toReturn(sampleCandidate, 'findOne')
    mockingoose.Interviewer.toReturn(sampleInterviewers, 'find')
    const response = await doRequest()
    expect(response.status).toEqual(HttpStatus.OK)
    expect(response.body).toEqual(expectedReponse)
  })

})
