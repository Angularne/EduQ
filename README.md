# Køsystem

NTNU Bachelor's degree Project

Estimated time of development completion: Late May 2016

## Features

1. Mongoose
2. Node.js
3. Express
4. Basic Angular 2 "infrastructure"
5. MongoDB database
6. REST api

## To-Do

1. Improve visuals
2. Implement dataexport

## Dependencies

Windows have problem building node-gyp. To handle that issue, make sure you have the following dependencies. Linux and OSX should not have any problems.

1. Python 2.7.X (x86)
2. Node (x86)
3. Add python as an Environment Variable
4. Visual Studio 2013 with C++ Tools

## Setup

1. Clone the repository from github:

  ```
git clone https://github.com/Angularne/kosystem.git
cd kosystem
  ```

2. Once you have the repository, download all the required modules from npm with
  ```
npm install
  ```

3. Run the Typescript transpiler to build the project
  ```
npm run build
  ```

4. To run the server, start the server.js file with node
  ```
npm start
  ```
5. Use your favorite browser to access your new website at [localhost:3000](http://localhost:3000)
