# eduQ

NTNU Bachelor's degree Project

Estimated time of development completion: Late May 2016

## Features

1. Node.js
2. Express
3. Angular 2
4. MongoDB
5. Mongoose
6. REST API

## To-Do

1. Improve visuals
2. Implement dataexport
3. Init-script (Setup admin user in database)


## Dependencies

The project is depending on `node-gyp`

**Windows**
  * python (`v2.7` recommended, `v3.x.x` is __*not*__ supported)
  * Add `PYTHON` as an Environment Variable
  * Visual Studio with C++ Tools
  * For more information: [nodejs/node-gyp](https://github.com/nodejs/node-gyp#installation)


**OS X**
  * python (`v2.7` recommended, `v3.x.x` is __*not*__ supported)(already installed on Mac OS X)
  * `Command Line Tools` via Xcode (`gcc` and `make`)

**Unix**
  * python (`v2.7` recommended, `v3.x.x` is __*not*__ supported)
  * `make`
  * A proper C/C++ compiler toolchain, like [GCC](https://gcc.gnu.org)


## Installation

1. Clone the repository from github using `git`:

  ``` bash
git clone https://github.com/Angularne/eduQ.git
cd eduQ
  ```

2. Install dependencies whith `npm`, this will also build the project
  ``` bash
npm install
  ```

3. To run the server, start the server.js file with node
  ``` bash
npm start
  ```
4. Use your favorite browser to access your new website at [localhost:3000](http://localhost:3000)

## Configuration
  To configurate the project with MongoDB and SMTP, locate the config file at `server/config.json`, and set the addresses and authentication. The structure should be self-explanatory.
  ``` json
  {
    "port": 3000,
    "mongodb": {
      "host": "localhost",
      "port": "27017",
      "path": "queue",
      "user": "username",
      "pass": "password"
    },
    "smtp": {
      "name": "Company Name",
      "host": "smtp.example.com",
      "port": 465,
      "secure": true,
      "auth": {
        "user": "email@example.com",
        "pass": "password"
      }
    }
  }

  ```
