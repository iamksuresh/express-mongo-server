import "reflect-metadata";

import { MetaDataEnum } from "../enum/MetaDataEnum";

export function ValidateRequestParams(validationModel: any) {
  return (target: any, property: string) => {
    Reflect.defineMetadata(
      MetaDataEnum.ValidateRequestParams,
      validationModel,
      target,
      property
    );
  };
}
