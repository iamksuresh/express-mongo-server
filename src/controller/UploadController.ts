import { Request, Response } from "express";
import { inject, injectable } from "inversify";
// import  readXlsxFile  from "read-excel-file/node";

import {
  commonServiceTypes,
  Controller,
  ControllerAction,
  HttpMethodEnum,
  ExpressMiddleware,
  // IConfigService,
  ILogService,
  Name,
  ValidateRequestParams,
  // IConfigService,
} from "../applicationSetup";
import { CommonEnum } from "../enum/CommonEnum";
import { MessageEnum } from "../enum/MessageEnum";
import UploadMiddleware from "../middleware/UploadMiddleware";
import { IUploadService } from "../services/IUploadService";
import { types as appServiceTypes } from '../services/types'
import { BaseController } from "./BaseController";
import { UploadExcelVM } from "./viewModel/uploadExcelVM";

@injectable()
@ExpressMiddleware(UploadMiddleware.single("file"))
@Controller("/upload")
export class UploadController extends BaseController {
  @inject(commonServiceTypes.ILogService)
  private readonly _logservice: ILogService;

  @inject(appServiceTypes.IUploadService)
  private readonly _uploadService : IUploadService

  @ControllerAction({ method: HttpMethodEnum.Post, path: "/excel" })
  @Name("excel")
  @ValidateRequestParams(UploadExcelVM)
  async excelController(req: Request, res: Response) {
    const params = this.params(req);
    this._logservice.info('excelController');

      if (params?.originalname == undefined) {
        this.throwError({reason : MessageEnum.NO_FILE})
      }

      let path = CommonEnum.EXCEL_FILE_PATH + params.originalname;
      return this._uploadService.uploadExcel(path);
  }
}
