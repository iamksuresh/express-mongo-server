import { MetaDataEnum } from "../enum/MetaDataEnum";

export interface IReflectionService {
  isString(value: any): boolean;
  toObject(value: string): any;
  toJson(value: any): any;
  isArray(value: any): boolean;
  isObject(value: any): boolean;
  isFunction(value: any): boolean;
  isNumber(value: any): boolean;
  objectToConstructor(instance: any): any;
  getMetaData(target: any, key: MetaDataEnum, property?: string | symbol): any;
}
