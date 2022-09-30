import { inject, injectable } from "inversify";
import readXlsxFile, { Row } from "read-excel-file/node";
import { BaseService, commonServiceTypes, ILogService } from "../../applicationSetup";
import { userDto } from "../dto/userDto";
import { IUploadService } from "../IUploadService";
import { types as repoTypes } from "../../repositories/types";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUser } from "../../repositories/models/user.model";
import { excelResponseDto } from "../dto/excelResponseDto";
import { MessageEnum } from "../../enum/MessageEnum";
import path from "path";
import * as fsExtra from "fs-extra";
import { CommonEnum } from "../../enum/CommonEnum";

@injectable()
export class UploadService extends BaseService implements IUploadService {
  @inject(commonServiceTypes.ILogService)
  private readonly _logservice: ILogService;

  @inject(repoTypes.IUserRepository)
  private readonly _userRepository: IUserRepository;

  getDtoClass() {
    return userDto;
  }

  uploadExcel = async (filePath: string): Promise<excelResponseDto> => {
    this._logservice.info("Calling upload Excel service");
    let { validItems, invalidItems } = await this._readXlsFile(filePath);
    await this._userRepository.addUser(validItems as IUser[]);
    this._deleteExcelFile();
    return this._uploadServiceResponse(invalidItems);
  };

  private _deleteExcelFile = (): void => {
    // Delete uploaded excel file
    fsExtra.emptyDirSync(path.resolve(CommonEnum.EXCEL_FILE_PATH));
  };

  private _uploadServiceResponse = (invalidItems: userDto[]): Promise<excelResponseDto> => {
    if (invalidItems.length > 0) {
      return Promise.resolve({ reason: MessageEnum.MISSING_VALUES, payload: invalidItems });
    } else return Promise.resolve({ reason: MessageEnum.ITEMS_UPLOADED_SUCESS, payload: [] });
  };

  private _readXlsFile = async (filePath: string): Promise<{ validItems: userDto[]; invalidItems: userDto[] }> => {
    let validItems: userDto[] = [];
    let invalidItems: userDto[] = [];

    await readXlsxFile(filePath).then((rows) => {
      // skip header
      rows.shift();

      rows.forEach((row) => {
        // trim, remove null,undefined and empty row to check for valid items
        const trimmedArr = row.filter((a) => a?.toString().trim());
        if (trimmedArr.length > 0) {
          if (trimmedArr.length < 3) {
            invalidItems.push(this._createDtoObj(row));
          } else {
            validItems.push(this._createDtoObj(row));
          }
        }
      });
    });

    return { validItems, invalidItems };
  };

  private _createDtoObj = (row: Row) => {
    let payload: userDto = {};

    if (row[0]) payload.username = row[0].toString().trim();
    if (row[1]) payload.university = row[1].toString().trim();
    if (row[2]) payload.email = row[2].toString().trim();

    return payload;
  };
}
