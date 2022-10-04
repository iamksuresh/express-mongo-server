# Express-Excel Upload Service
## Rest API using express to upload and save excel file

#### readme - https://github.com/iamksuresh/express-mongo-server#readme

#### screenshots
-   Folder structure - https://github.com/iamksuresh/express-mongo-server/blob/main/screenshots/folder_structure.png


## Features
- Express based Rest API service written in Typescript
- Upload single excel file (.xls, .xlsx) and save data in mongo DB
- 3 layered architecture with clear separation of business and Repository logics
- IOC containers for module injection
- Using simple pre-defined annotations to register controllers
- 
## Good to know - for Assigment purpose only
-   Only single excel file is allowed to upload (.xls, .xlsx)
-   Same Mongo db instance is used for running test cases.
-   No schema validation is implemented except all fields are mandatory
-   mongo cloud is used to connect. Any mongo db uri can be used. To be passed in env variable - `MONGO_DB_URI`
    -- For the purpose of this assignment, I have added it to .env file
-   For Post API call , form-data value for upload excel API should be `file`
    -   Refer screenshot here - https://github.com/iamksuresh/express-mongo-server/blob/main/screenshots/postman.png
    


## Technology stack
-   Express js , Typescript, Mongo DB, Mongoose, Inversify (IOC)
-   Reflect-metadata : JS metadata / proxies

## Testing
-   Super test for API integration test
-   mongo db instance is used for integration

## Installation
-  Pre-requisite - [Node.js](https://nodejs.org/) latest. 
-  git clone https://github.com/iamksuresh/express-mongo-server.git
-  Tested in node 16.15.0 , npm 8.9.0 , chrome browser

```sh
cd <root-folder>
npm i
npm start
```
- Server will start at port 8080
- NOTE : add mongodb uri to `MONGO_DB_URI` variable in .env file. 
- Any mongoDB quering tool like - mongoDB compass , Studio 3T can be used to view tables.

## Testing
```sh
cd <root-folder>
npm i (if not already done)
npm test
```
## Postman collection
- Access Postman collection here - https://github.com/iamksuresh/express-mongo-server/tree/main/postman-collection

- Sample excel files for Postman tests can be uploaded from here - https://github.com/iamksuresh/express-mongo-server/tree/main/postman-collection/sample-excel-files
