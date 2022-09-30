import { Request, Response, NextFunction } from "express";

export interface IErrorHandlerService {
  handle(error: any, req: Request, res: Response, next: NextFunction): any;
}
