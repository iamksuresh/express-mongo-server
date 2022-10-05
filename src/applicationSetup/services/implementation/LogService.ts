// tslint:disable:no-bitwise
import { inject, injectable } from "inversify";

import { LogType, ILogService } from "../ILogService";
import { types as commonServiceTypes } from "../types";
import { IConfigService } from "../IConfigService";
import { ConfigKeyEnum } from "../../enum/ConfigKeyEnum";
import { LogLevelEnum } from "../../enum/LogLevelEnum";

// import { WinstonService } from "./WinstonService";

@injectable()
export class LogService implements ILogService {
  @inject(commonServiceTypes.IConfigService)
  protected readonly _configService: IConfigService;

  // private _logger: WinstonService;
  private _logLevel: number;

  // constructor() {
  //   console = WinstonService.create();
  // }

  log(logType: LogType, message: any): void {
    if (logType === LogType.Error) {
      this.error(message);
    } else if (logType === LogType.Warning) {
      this.warn(message);
    } else {
      this.info(message);
    }
  }

  info(message: any): void {
    const logLevel = this._getLogLevel();
    if (logLevel & LogLevelEnum.Info) {
      console.info("info: ", { info: message });
    }
  }

  error(message: any): void {
    const logLevel = this._getLogLevel();
    if (logLevel & LogLevelEnum.Error) {
      console.error("error: ", { info: message });
    }
  }

  warn(message: any): void {
    const logLevel = this._getLogLevel();
    if (logLevel & LogLevelEnum.Warning) {
      console.warn("warn: ", { info: message });
    }
  }

  private _getLogLevel(): number {
    if (this._logLevel === undefined) {
      const logLevel =
        this._configService.getByKey(ConfigKeyEnum.Log.logLevel) ||
        LogLevelEnum.Error;
      this._logLevel = parseInt(logLevel, 10);
    }
    return this._logLevel;
  }
}
