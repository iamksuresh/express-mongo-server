import "reflect-metadata";

import { MetaDataEnum } from "../enum/MetaDataEnum";

export function Public() {
  return (target: any, actionName?: any) => {
    Reflect.defineMetadata(MetaDataEnum.IsPublic, true, target, actionName);
  };
}
