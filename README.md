# Interview Scheduler

Simple, PoC express backend application with best practices in mind

## Setup -  Installing Software and Node modules Dependencies:

Requirements:
- MongoDB (>= v3.6.5)
- NodeJS (>= v8.4.0)
- Npm (>= v6.1.0) (or Yarn)

Run on cli (command line interface):
```bash
npm install
```

## Configuration

You can costumize the path for your MongoDB instance by editing the following file: `src/config/database.js`

## Starting the app (development)

Ensure MongoDB is running, then execute on cli:
```bash
npm run start
```

When developing, it's handy to have the server reloading whenever files change. To archieve that, run:
```bash
npm run watch
```

## Usage

To set the availability of a participant (either a candidate or an interviewer), you have to send a `POST` message to the following endpoint:
```
http://localhost:3000/candidate/set-availability
```
or
```
http://localhost:3000/interviewer/set-availability
```

With the following payload:
```json
{
	"name":"test-user",
	"availability":[
      { "start": "2018-07-16T09:00:00.000Z", "end": "2018-07-16T10:00:00.000Z" },
      { "start": "2018-07-17T09:00:00.000Z", "end": "2018-07-17T10:00:00.000Z" },
      { "start": "2018-07-18T10:00:00.000Z", "end": "2018-07-18T12:00:00.000Z" },
      { "start": "2018-07-19T09:00:00.000Z", "end": "2018-07-19T10:00:00.000Z" },
      { "start": "2018-07-20T09:00:00.000Z", "end": "2018-07-20T10:00:00.000Z" }
	]
}
```
NOTE: dates must be on ISO8601 format, and will be truncated to the hour ( sending `2018-07-16T09:11:22.333Z`, is the same as sending `2018-07-16T09:00:00.000Z`)


To get the available blocks for a given candidate and a set of interviewers, just `GET` the following endpoint:
```
http://localhost:3000/candidate/test-user/schedule?interviewer=one-dude&interviewer=other-dude
```
NOTE: if no interviewer is specified, the candidate availability will be checked against all the registered interviewers

## Unit Tests

To run the unit tests:
```bash
npm run test
```

For development, similar to `npm run watch` to rebuild the server, its handy to have hotreload for test files. In order to setup this, as well as a coverage report, run:
```bash
npm run test:watch
```

## Endpoints Documentation

Generated using [ApiDoc](http://apidocjs.com/), the application documentation is available on `documentation/index.html`

To re-generate documentation, run:
```bash
npm run generate-documentation
```

## Building a deployable package

For production environment, it's a good idea to not have babel transformations running at runtime. Also, the ability to deploy a single minified file with all the dependencies included is nice to have. We can do this using webpack, by running:
```bash
npm run build
```

This will generate a file located on `dist/server.js`, that can be deployed and run directly with:
```bash
node /path_to/server.js
```
NOTES:
 - obviously, there must be a MongoDB instance for the app to connect to
 - if need be, we can debug the deployed application using generated sourcemaps (`dist/server.min.js.map`)
