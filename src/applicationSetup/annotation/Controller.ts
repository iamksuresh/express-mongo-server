import "reflect-metadata";

import { MetaDataEnum } from "../enum/MetaDataEnum";
import { iocContainer } from "../iocContainer";

export function Controller(path: string) {
  return (target: any) => {
    if (target.__registered___ === undefined) {
      target.__registered___ = true;
      iocContainer.bind<any>(MetaDataEnum.Controller).to(target);
    }
    Reflect.defineMetadata(MetaDataEnum.Controller, path, target);
  };
}
