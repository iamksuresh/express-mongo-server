import { inject, injectable } from "inversify";

import { ModuleDto } from "../dto/ModuleDto";
import { IConfigService } from "../IConfigService";
import { IUtilService } from "../IUtilService";
import { types as commonServiceTypes } from "../types";

@injectable()
export class ConfigService implements IConfigService {
  private _configValues: any;

  @inject(commonServiceTypes.ConfigLib)
  private readonly _configLib: any;

  @inject(commonServiceTypes.EnvironmentVariables)
  private readonly _environmentVariables: any;

  @inject(commonServiceTypes.IUtilService)
  private readonly _utilService: IUtilService;

  async init(): Promise<void> {
    this._configValues = { ...this._configLib, ...this._environmentVariables };
  }

  getVariables(): Promise<any> {
    return { ...this._configValues };
  }

  getValue(key: string): any {
    return this._utilService.getValue(key, this._configValues);
  }

  getByKey(key: string): any {
    let value: any = this.getValue(key);
    if (value === undefined) {
      const environmentKey = this._utilService.replace(".", "_", key);
      value = this.getValue(environmentKey);
    }
    return value;
  }

  getModule(): ModuleDto {
    return this.getValue("module") as ModuleDto;
  }

  getModuleName(): string {
    const module = this.getModule();
    if (typeof module === "object") {
      return module.name;
    } else {
      return module;
    }
  }
}
