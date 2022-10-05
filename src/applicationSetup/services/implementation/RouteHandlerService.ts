/* eslint-disable @typescript-eslint/no-unused-vars */
import { Application, NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { ActionMethodInfo } from "../../annotation/ActionMethodInfo";
import { HttpMethodEnum } from "../../enum/HttpMethodEnum";
import { MetaDataEnum } from "../../enum/MetaDataEnum";
import { ILogService } from "../ILogService";
import { IReflectionService } from "../IReflectionService";
import { IRouteHandlerService } from "../IRouteHandlerService";
import { types as commonServiceTypes } from "../types";

@injectable()
export class RouteHandlerService implements IRouteHandlerService {
  @inject(commonServiceTypes.IReflectionService)
  private readonly _reflectionService: IReflectionService;

  @inject(commonServiceTypes.ILogService)
  private readonly _logService: ILogService;

  @inject(commonServiceTypes.Lodash)
  private readonly _lodash: any;

  handle(
    controller: any,
    handler: (
      request: Request,
      response: Response,
      nextFunction: NextFunction
    ) => any
  ): any {
    /**
     * PreProcess/ PostProcess Request interceptors
     * Validate Request params
     * Validate Authorization
     */
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this._validateRequestParams();
        await this._requestParamsAuthorization();
        const returnValue = handler(req, res, next);

        if (returnValue && this._lodash.isFunction(returnValue.then)) {
          returnValue
            .then((value: any) => {
              return this._returnValue(res, value);
            })
            .catch((err: any) => {
              next(err);
              // return Promise.reject(err);
            });
        } else {
          await this._returnValue(res, returnValue);
        }
      } catch (err) {
        next(err);
      }
    };
  }

  private async _returnValue(response: Response, value: any) {
    /**
     * Implement post interceptor here
     */
    this._logService.info(`_returnValue: ${JSON.stringify(value)} `);
    if (this._lodash.isObject(value)) {
      response.status(200).json(value);
    } else {
      response.status(200).send(value);
    }
  }

  private async _validateRequestParams(): Promise<void> {
    /**
     * TOOD : Validate Request Params
     * check Business Violation Exceptions
     * @params => controller: any, handler: any, request: Request
     */
    return Promise.resolve();
  }

  private async _requestParamsAuthorization(): Promise<void> {
    /**
     * TOOD :Check user access
     * @params => controller: any, handler: any, request: Request
     */
    return Promise.resolve();
  }

  configureControllers(app: Application, controllers: any[]): void {
    if (controllers && controllers.length > 0) {
      const unitializedControllers =
        controllers.filter(
          (controller: any) => controller.__controller__attached__ === undefined
        ) || [];
      unitializedControllers.forEach((controller: any) => {
        const controllerClass =
          this._reflectionService.objectToConstructor(controller);
        const controllerBasePath = this._reflectionService.getMetaData(
          controllerClass,
          MetaDataEnum.Controller
        );
        if (controllerBasePath) {
          const actions: ActionMethodInfo[] =
            this._reflectionService.getMetaData(
              controller,
              MetaDataEnum.ControllerAction
            );
          if (actions && actions.length > 0) {
            const controllerName =
              this._reflectionService.getMetaData(
                controllerClass,
                MetaDataEnum.Name
              ) || controllerClass.name;
            const isPublic = this._reflectionService.getMetaData(
              controllerClass,
              MetaDataEnum.IsPublic
            );
            const router = Router();
            const controllerLevelMiddleware =
              this._reflectionService.getMetaData(
                controllerClass,
                MetaDataEnum.ExpressMiddleware
              );
            if (controllerLevelMiddleware) {
              app.use(controllerBasePath, controllerLevelMiddleware, router);
            } else {
              app.use(controllerBasePath, router);
            }
            actions.forEach((action: any) => {
              this._createControllerActionPath(
                router,
                controller,
                action,
                controllerName,
                isPublic
              );
            });
          }
        }
        controller.__controller__attached__ = true; // mark this controller as done
      });
    }
  }

  private _createControllerActionPath(
    router: Router,
    controller: any,
    action: ActionMethodInfo,
    controllerName: string,
    isControllerPublic?: boolean
  ) {
    /**
     * register route for each controller
     * All API's are open to public and accessable.
     * default `isPublic` to false for otherwise
     */
    const actionName = action.actionName;
    if (actionName) {
      let handler: any = controller[actionName];
      if (this._reflectionService.isFunction(handler)) {
        const middlewares = this._reflectionService.getMetaData(
          controller,
          MetaDataEnum.ExpressMiddleware,
          actionName
        );
        const customActionName =
          this._reflectionService.getMetaData(
            controller,
            MetaDataEnum.Name,
            actionName
          ) || actionName;
        let isPublic = true;
        if (isControllerPublic === true) {
          isPublic = true;
        } else {
          isPublic =
            this._reflectionService.getMetaData(
              controller,
              MetaDataEnum.IsPublic,
              actionName
            ) || true;
        }
        handler = handler.bind(controller);
        handler._actionName = actionName;
        handler._invocationInfo = {
          resource: controllerName,
          action: customActionName,
          isPublic,
        };

        if (action.method === HttpMethodEnum.Get) {
          if (middlewares) {
            router.get(
              action.path,
              middlewares,
              this.handle(controller, handler)
            );
          } else {
            router.get(action.path, this.handle(controller, handler));
          }
        } else if (action.method === HttpMethodEnum.Post) {
          if (middlewares) {
            router.post(
              action.path,
              middlewares,
              this.handle(controller, handler)
            );
          } else {
            router.post(action.path, this.handle(controller, handler));
          }
        } else if (action.method === HttpMethodEnum.Put) {
          if (middlewares) {
            router.put(
              action.path,
              middlewares,
              this.handle(controller, handler)
            );
          } else {
            router.put(action.path, this.handle(controller, handler));
          }
        }
      }
    }
  }
}
