import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";
import { Container } from "inversify";
// import dotenv from 'dotenv';
// import { TextEncoder } from 'util'

// global.TextEncoder = TextEncoder
//global.TextDecoder = TextDecoder

import { App } from "../../src/app";

// dotenv.config();

let app: any;
export async function startTestService(iocContainer: Container) {
  if (app === undefined) {
    // jest.mock("sequelize-typescript", () => {
    //   return {
    //     Sequelize: class extends require("sequelize-mock") {
    //       addModels() {
    //         //
    //       }

    //       sync() {
    //         //
    //       }
    //     },
    //   };
    // });
    app = express();
    app.use(bodyParser.json({ limit: "200mb" }));
    app.use(
      bodyParser.urlencoded({
        limit: "200mb",
        extended: true,
        parameterLimit: 1000000,
      }),
    );
    const appInstance = new App(app, iocContainer);
    await appInstance.initExternal();
    await appInstance.run(app);
  }
  return app;
}
