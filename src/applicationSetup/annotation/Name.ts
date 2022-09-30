import "reflect-metadata";

import { MetaDataEnum } from "../enum/MetaDataEnum";

export function Name(name: string) {
  return (target: any, actionName?: any) => {
    Reflect.defineMetadata(MetaDataEnum.Name, name, target, actionName);
  };
}
