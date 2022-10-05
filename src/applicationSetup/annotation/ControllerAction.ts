import "reflect-metadata";

import { MetaDataEnum } from "../enum/MetaDataEnum";

import { ActionMethodInfo } from "./ActionMethodInfo";

export function ControllerAction(info: ActionMethodInfo) {
  return (target: any, property: any) => {
    const actions =
      Reflect.getMetadata(MetaDataEnum.ControllerAction, target) || [];
    const oldRecord = actions.find(
      (method: ActionMethodInfo) =>
        method.method === info.method && method.path === info.path
    );
    if (!oldRecord) {
      info.actionName = property;
      actions.push(info);
      Reflect.defineMetadata(MetaDataEnum.ControllerAction, actions, target);
    }
  };
}
