/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Container } from "inversify";
import { Application } from "express";
import { ConnectOptions } from "mongoose";

import { iocContainer } from "./iocContainer";
import { IConfigService } from "./services/IConfigService";
import { types as commonServiceTypes } from "./services/types";
import { configureCommonServices } from "./services/ioc";
import { MetaDataEnum } from "./enum/MetaDataEnum";
import { ILogService } from "./services/ILogService";
import { IRouteHandlerService } from "./services/IRouteHandlerService";
import { IErrorHandlerService } from "./services/IErrorHandlerService";

// Export Enum
export { HttpMethodEnum } from "./enum/HttpMethodEnum";
export { ConfigKeyEnum } from "./enum/ConfigKeyEnum";
export { LogLevelEnum } from "./enum/LogLevelEnum";
export { MetaDataEnum } from "./enum/MetaDataEnum";

// Export Dto
export { BaseDto } from "./services/dto/BaseDto";
export { ModuleDto } from "./services/dto/ModuleDto";

// Export Annotations
export { ActionMethodInfo } from "./annotation/ActionMethodInfo";
export { ControllerAction } from "./annotation/ControllerAction";
export { Controller } from "./annotation/Controller";
export { ExpressMiddleware } from "./annotation/ExpressMiddleware";
export { Name } from "./annotation/Name";
export { Public } from "./annotation/Public";
export { ValidateRequestParams } from "./annotation/ValidateRequestParams";

// Export Services
export { types as commonServiceTypes } from "./services/types";
export { IConfigService } from "./services/IConfigService";
export { IUtilService } from "./services/IUtilService";
export { IRouteHandlerService } from "./services/IRouteHandlerService";
export { ILogService } from "./services/ILogService";
export { IReflectionService } from "./services/IReflectionService";
export { BaseService } from "./services/implementation/BaseService";

let _container: Container = iocContainer;
export const configureCommon = async (
  appContainer?: Container
): Promise<Container> => {
  _container = appContainer || iocContainer;

  // Register common services to container
  configureCommonServices(_container);

  // load environment variables
  const configService = _container.get<IConfigService>(
    commonServiceTypes.IConfigService
  );
  await configService.init();

  // load common repo class
  // configureCommonRepositories(_container);

  return _container;
};

export function registerController(...controllerClasses: any[]) {
  /**
   * Register Endpoints to Container
   */
  controllerClasses.forEach((controller: any) => {
    _container.bind<any>(MetaDataEnum.Controller).to(controller);
  });
}

export function registerMongoDB(uri: string) {
  const configService = _container.get<IConfigService>(
    commonServiceTypes.IConfigService
  );
  const dbService = _container.get<any>(commonServiceTypes.DbConnection);

  let dbUri = configService.getByKey(uri);
  console.log("=== DB to connect ==  ", dbUri);
  try {
    dbService
      .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
      } as ConnectOptions)
      .then(() => {
        console.log("=== Database connected! === ");

        // bind mongoose connection to container
        //  _container.bind<mongoose.Connection>(commonServiceTypes.DbConnection).toConstantValue(mongoose.connection);
      })
      .catch((err: any) => console.log(err));
  } catch (error) {
    throw "DB connection failed";
  }
}

export async function initAsync(app: Application, container?: Container) {
  /**
   * Register DB listeners
   * initialize messaging queues - RabbitMQ
   * Register Express Route
   */
  let routeHandlerService: IRouteHandlerService;
  let controllers: any[];
  let logService: ILogService;
  const instanceContainer = container || iocContainer;

  try {
    // init express
    routeHandlerService = instanceContainer.get<IRouteHandlerService>(
      commonServiceTypes.IRouteHandlerService
    );
    logService = instanceContainer.get<ILogService>(
      commonServiceTypes.ILogService
    );
    controllers = instanceContainer.getAll(MetaDataEnum.Controller);
  } catch (err) {
    controllers = [];
    console.log("Error in App initialization ", err);
    logService!.error(err);
  }

  if (controllers.length > 0) {
    const plainControllers: any[] = [];
    controllers.forEach((controller: any) => {
      plainControllers.push(controller);
    });
    routeHandlerService!.configureControllers(app, plainControllers);
  }
}

let _isErrorHandlerInitialized = false;
export function registerErrorHandler(app: Application, container?: Container) {
  const instanceContainer = container || iocContainer;
  if (_isErrorHandlerInitialized === false) {
    const errorHandler: IErrorHandlerService =
      instanceContainer.get<IErrorHandlerService>(
        commonServiceTypes.IErrorHandlerService
      );
    app.use(errorHandler.handle.bind(errorHandler));
    _isErrorHandlerInitialized = true;
  }
}
