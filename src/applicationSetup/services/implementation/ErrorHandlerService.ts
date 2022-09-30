/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Handle custom error
 */
import { injectable, inject } from "inversify";
import { NextFunction, Request, Response } from "express";

import { IErrorHandlerService } from "../IErrorHandlerService";
// import { IReflectionService } from "../IReflectionService";
import { ILogService } from "../ILogService";
import { types as commonServiceTypes } from "../types";
// import { HttpException } from "../../../exception/HttpException";

@injectable()
export class ErrorHandlerService implements IErrorHandlerService {
  @inject(commonServiceTypes.ILogService)
  private _logService: ILogService;

  // @inject(commonServiceTypes.IReflectionService)
  // private _reflectionService: IReflectionService;

  handle(error: any, req: Request, res: Response, next: NextFunction) {
    let status = error?.status || 500;
    let payload: any = {};
    // console.log("errorHandler ", error, typeof error);

    // Set generic message
    if (typeof error === "string") {
      payload = error;
    } else {
      payload = payload || {};
      payload.reason = error?.reason || "Server encountered error";
      payload.payload = error?.payload || {};
    }

    // if (error instanceof HttpException) {
    //   status = (error as HttpException).getStatus();
    // } else if (error.status) {
    //   if (!this._reflectionService.isNumber(error.status)) {
    //     status = parseInt(error.status, 10);
    //   } else {
    //     status = error.status;
    //   }
    //   const { errorPayload = {} } = error;
    //   payload = errorPayload;
    // }
    // if (typeof payload === "object") {
    //   payload = {
    //     message: error.message,
    //     ...payload,
    //   };
    // }

    this._logService.error(error);
    res.status(status);
    res.send(payload);
  }
}
