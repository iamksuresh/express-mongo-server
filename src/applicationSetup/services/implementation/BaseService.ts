import { inject, injectable } from "inversify";
import {
  commonServiceTypes,
  ILogService,
  IReflectionService,
  IUtilService,
} from "../..";

@injectable()
export abstract class BaseService {
  @inject(commonServiceTypes.IReflectionService)
  protected readonly _reflectionService: IReflectionService;

  @inject(commonServiceTypes.IUtilService)
  protected readonly _utilService: IUtilService;

  @inject(commonServiceTypes.ILogService)
  protected readonly _logService: ILogService;

  abstract getDtoClass(): any;
}
