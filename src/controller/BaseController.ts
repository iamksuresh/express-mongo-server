import { injectable, inject } from "inversify";
import { Request } from "express";

import { ILogService, IUtilService, commonServiceTypes } from "../applicationSetup";

@injectable()
export abstract class BaseController {
  @inject(commonServiceTypes.ILogService)
  protected _logService: ILogService;

  @inject(commonServiceTypes.IUtilService)
  protected _utilService: IUtilService;

  /**
   * Returns list of params for Http requests
   */
  params(request: Request): any {
    return this._utilService.getRequestParams(request);
  }

  throwError(errObj:any): any {
    throw errObj;
  }
}
