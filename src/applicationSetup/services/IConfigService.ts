import { ModuleDto } from "./dto/ModuleDto";

export interface IConfigService {
  init(): Promise<void>;
  getVariables(): Promise<void>;
  getByKey(key: string): any;
  getModule(): ModuleDto;
  getModuleName(): string;
  getValue(key: string): any;
}
