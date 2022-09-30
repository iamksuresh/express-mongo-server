import { Request } from "express";
import { inject, injectable } from "inversify";
import * as objectPath from "object-path";

import { IReflectionService } from "../IReflectionService";
import { IUtilService } from "../IUtilService";
import { types as commonServiceTypes } from "../types";

@injectable()
export class UtilService implements IUtilService {
  @inject(commonServiceTypes.IReflectionService)
  private readonly _reflectionService: IReflectionService;

  getValue(key: string, params?: any): any {
    return objectPath.get(params, key);
  }

  getByKey(key: string, params?: any): any {
    let value: any = this.getValue(key, params);
    if (value === undefined) {
      const environmentKey = this.replace(".", "_", key);
      value = this.getValue(environmentKey, params);
    }
    return value;
  }

  setByKey(key: string, value: any, config: any): void {
    objectPath.set(config, key, value);
  }

  getRequestParams(request: Request): any {
    let parameters = {};
    if (request) {
      /********************************************\
       * description: this method will collect all the parameters for the request with the priority below
       *
       * 1. url params - all methods
       * 2. body - if method post/put
       * 3. query params -  all methods
       *
      \********************************************/

      // query params for all methods
      parameters = Object.assign(parameters, request.query || {});

      const httpMethod = request.method.toLowerCase();
      if (httpMethod === "post" || httpMethod === "put" || httpMethod === "delete") {
        parameters = Object.assign(parameters, request.body || {}, request.file || {});
      }

      // url params for all methods
      parameters = Object.assign(parameters, request.params || {});
    }
    return parameters;
  }

  interpolate(input: string, params: any): string {
    let returnValue = input;
    if (this._reflectionService.isString(returnValue) === false) {
      returnValue = this._reflectionService.toJson(returnValue);
    }

    const variables = returnValue.match(/\$\{[\w\.\-]*\}/gi);
    if (variables && variables.length) {
      variables.forEach((varName: string) => {
        const key = varName.replace("${", "").replace("}", "");
        let value = this.getByKey(key, params);
        if (value === undefined) {
          value = "";
        }

        // workaround for missing IMO_NO
        // ${IMO_NO} is the value defined in deployment template
        if (key === "IMO_NO" && value === "${IMO_NO}") {
          value = "";
        }
        while (returnValue.indexOf(varName) >= 0) {
          returnValue = returnValue.replace(varName, value);
        }
      });
    }
    return returnValue;
  }

  replace(key: string, replaceValue: string, v: string): string {
    let value: string = v;
    if (value) {
      while (value.indexOf(key) >= 0) {
        value = value.replace(key, replaceValue);
      }
    }
    return value;
  }
}
