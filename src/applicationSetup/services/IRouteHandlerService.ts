import { Request, Response, NextFunction, Application } from "express";

export interface IRouteHandlerService {
  handle(
    controller: any,
    handler: (
      request: Request,
      response: Response,
      nextFunction: NextFunction
    ) => any
  ): any;
  configureControllers(app: Application, controllers: any[]): void;
}
