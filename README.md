# Interview Scheduler

Simple, PoC express backend application with best practices in mind

## Setup

### Installing Software and Node modules Dependencies:

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

Generated using [ApiDoc](http://apidocjs.com/)
schedule will match against all interviewers if none is passed as param
TODO (mencionar a validação e o truncate das horas)



## Building a deployable file

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
