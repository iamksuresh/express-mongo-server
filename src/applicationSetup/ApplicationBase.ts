import "reflect-metadata";
import express from "express";
import { Container } from "inversify";

import { iocContainer } from "./iocContainer";
import { MetaDataEnum } from "./enum/MetaDataEnum";
import { ILogService } from "./services/ILogService";
import { types as commonServiceTypes } from "./services/types";
import { IConfigService } from "./services/IConfigService";

import {
  configureCommon,
  initAsync as initCommon,
  registerErrorHandler,
} from ".";

export abstract class ApplicationBase {
  protected readonly _container: Container;
  protected readonly _expressApp: express.Application;

  private _controllerClasses: any[] = [];

  constructor(app?: express.Application, container?: Container) {
    this._expressApp = app || express();
    this._container = container || iocContainer;
  }

  abstract setupIoC(
    expressApp: express.Application
  ): Promise<express.Application>;

  async initExternal(): Promise<express.Application> {
    /**
     *  set up Express App
     *  register external services to Container like -
     *    LogService
     *    Redis
     *    DB
     *
     */
    const app = this._expressApp;
    await configureCommon(this._container);
    await this._loadApplicationContainers(app);

    return app;
  }

  private async _loadApplicationContainers(
    app: express.Application
  ): Promise<void> {
    /**
     * register Application controllers to IOC
     * Register DB listeners
     * Register messaging clients - RabbitMQ
     * check for DB connections
     */

    await this.setupIoC(app);
  }

  protected _registerController(...controllerClasses: any[]): void {
    this._controllerClasses = this._controllerClasses.concat(controllerClasses);
  }

  async run(expressApp: express.Application): Promise<express.Application> {
    const container = this._container || iocContainer;

    // load the classes required, test
    if (this._controllerClasses && this._controllerClasses.length > 0) {
      this._controllerClasses.forEach((controller: any) => {
        container.bind<any>(MetaDataEnum.Controller).to(controller);
      });
    }

    await initCommon(expressApp, container);

    const configService = this._container.get<IConfigService>(
      commonServiceTypes.IConfigService
    );

    const logService: ILogService = container.get<ILogService>(
      commonServiceTypes.ILogService
    );
    return new Promise((resolve: any) => {
      (function _init() {
        try {
          const moduleName = configService.getModuleName();

          registerErrorHandler(expressApp, container);

          // note: use console log so that it will output the ready status irregardless of the log settings

          // eslint-disable-next-line no-console
          console.log(`${moduleName} - ready`);
          resolve(expressApp);
        } catch (err) {
          // note: use console log so that it will output the ready status irregardless of the log settings
          // tslint:disable-next-line:no-console
          logService.error(err);
          // retry in 5s
          setTimeout(() => {
            _init();
          }, 5000);
        }
      })();
    });
  }
}
