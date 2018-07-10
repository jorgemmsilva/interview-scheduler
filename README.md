# Interview Scheduler

TODO add description
TODO add documentation

## Setup

### Install Software Dependencies:

- MongoDB (>= v3.6.5)
- NodeJS (>= v8.4.0)
- Npm (>= v6.1.0) (or yarn)

### Install node modules dependencies

Run on cli (command line interface):

```bash
npm install
```

## Configuration

You can costumize the path for your MongoDB instance by editing the following file: `src/config/database.js`

## Start the app (development)

Ensure MongoDB is running, then execute on cli:

```bash
npm run start
```

When developing, it's handy to start the server with the watch option instead, so that it reloads whenever files change:

```bash
npm run watch
```

## Run Tests
TODO

## Build deployable file

For production environment, it's a good idea to not have babel transformations running at runtime, also the ability to deploy a single minified file with all the dependencies included is very nice to have. For this you can use webpack to build such a file, by running:
```bash
npm run build
```
This will generate a file located on `dist/server.js`, that can be deployed and run direcly with:
```bash
node my-custom-path/server.js
```
NOTES:
 - obviously, there must be a MongoDB instance for the app to connect to
 - if need be, we can debug the deployed application using generated sourcemaps (`dist/server.min.js.map`)

## Building Documentation

TODO
