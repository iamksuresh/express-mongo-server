import { Request } from "express";

export interface IUtilService {
  getValue(key: string, params?: any): any;
  getByKey(key: string, params?: any): any;
  setByKey(key: string, value: any, config: any): void;
  interpolate(url: string, params: any): string;
  replace(key: string, replaceValue: string, value: string): string;
  getRequestParams(request: Request): any;
}
