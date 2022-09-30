// const express = require('express')
import express from "express";
import "reflect-metadata";
import * as bodyParser from "body-parser";

import { iocContainer } from "./applicationSetup/iocContainer";
import { App } from "./app";
import { registerMongoDB } from "./applicationSetup";

const app = express();
const MONGO_DB = 'MONGO_DB_URI';

const initServer = async () => {
  app.use(bodyParser.json({ limit: "200mb" }));
  // app.use(express.urlencoded({ extended: true }));
  app.use(
    bodyParser.urlencoded({
      limit: "200mb",
      extended: true,
      parameterLimit: 1000000,
    })
  );
};

const setUpIoc = () => new App(app, iocContainer);

(async () => {
  try {
    // init express server
    await initServer();
    const appInstance = setUpIoc();

    // init external services , initialise IOC's
    appInstance
      .initExternal()
      .then(async (expressApp: any) => {
        return appInstance.run(expressApp);
      })
      .then(() => {
        // db init
        registerMongoDB(MONGO_DB);
      })
      .then(() => {
        const port = process.env.NODE_PORT || 8080;
        console.log("port ", port);
        app.listen(port);
        return app;
      });
  } catch (e) {
    console.log("error in Server setup ", e);
  }
})();
