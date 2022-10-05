import "reflect-metadata";

import { MetaDataEnum } from "../enum/MetaDataEnum";

export function ExpressMiddleware(...middlewares: any) {
  return (controller: any, property?: string | symbol) => {
    if (property) {
      Reflect.defineMetadata(
        MetaDataEnum.ExpressMiddleware,
        middlewares,
        controller,
        property
      );
    } else {
      Reflect.defineMetadata(
        MetaDataEnum.ExpressMiddleware,
        middlewares,
        controller
      );
    }
  };
}
