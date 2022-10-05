import { Container } from "inversify";
import * as config from "config";
import * as _ from "lodash";
import dotenv from "dotenv";

import { types as commonServiceTypes } from "./types";
import { ConfigService } from "./implementation/ConfigService";
import { IConfigService } from "./IConfigService";
import { LogService } from "./implementation/LogService";
import { ILogService } from "./ILogService";
import { IUtilService } from "./IUtilService";
import { UtilService } from "./implementation/UtilService";
import { IReflectionService } from "./IReflectionService";
import { ReflectionService } from "./implementation/ReflectionService";
import { ErrorHandlerService } from "./implementation/ErrorHandlerService";
import { IErrorHandlerService } from "./IErrorHandlerService";
import { RouteHandlerService } from "./implementation/RouteHandlerService";
import { IRouteHandlerService } from "./IRouteHandlerService";
import mongoose from "mongoose";

export function configureCommonServices(container: Container): Container {
  dotenv.config();
  container
    .bind<any>(commonServiceTypes.EnvironmentVariables)
    .toConstantValue(process.env);

  container
    .bind<any>(commonServiceTypes.DbConnection)
    .toConstantValue(mongoose);

  container.bind<any>(commonServiceTypes.ConfigLib).toConstantValue(config);

  container.bind<any>(commonServiceTypes.Lodash).toConstantValue(_);

  container
    .bind<IConfigService>(commonServiceTypes.IConfigService)
    .to(ConfigService);

  container.bind<ILogService>(commonServiceTypes.ILogService).to(LogService);

  container.bind<IUtilService>(commonServiceTypes.IUtilService).to(UtilService);

  container
    .bind<IReflectionService>(commonServiceTypes.IReflectionService)
    .to(ReflectionService);

  container
    .bind<IErrorHandlerService>(commonServiceTypes.IErrorHandlerService)
    .to(ErrorHandlerService);

  container
    .bind<IRouteHandlerService>(commonServiceTypes.IRouteHandlerService)
    .to(RouteHandlerService);

  return container;
}
