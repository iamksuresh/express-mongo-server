import { inject, injectable } from "inversify";

import { MetaDataEnum } from "../../enum/MetaDataEnum";
import { IReflectionService } from "../IReflectionService";
import { types as commonServiceTypes } from "../types";

@injectable()
export class ReflectionService implements IReflectionService {
  @inject(commonServiceTypes.Lodash)
  private readonly _: any;

  isString(value: any): boolean {
    return this._.isString(value);
  }

  toObject(value: string): any {
    let json;
    if (this._.isString(value)) {
      try {
        json = JSON.parse(value);
      } catch (e) {
        json = {};
      }
    } else {
      json = value;
    }
    return json;
  }

  toJson(value: any): any {
    let json;
    if (this._.isObject(value)) {
      json = JSON.stringify(value);
    } else {
      json = value;
    }
    return json;
  }
  isArray(value: any): boolean {
    return this._.isArray(value);
  }

  isObject(value: any): boolean {
    return this._.isObject(value);
  }

  isFunction(value: any): boolean {
    return this._.isFunction(value);
  }

  isNumber(value: any): boolean {
    return this._.isNumber(value);
  }
  objectToConstructor(instance: any): any {
    if (this._.isFunction(instance)) {
      return instance;
    } else {
      return instance.constructor;
    }
  }

  getMetaData(target: any, key: MetaDataEnum, property?: string | symbol): any {
    if (property) {
      return Reflect.getMetadata(key, target, property);
    } else {
      return Reflect.getMetadata(key, target);
    }
  }
}
