import { HttpMethodEnum } from "../enum/HttpMethodEnum";

export class ActionMethodInfo {
  method: HttpMethodEnum;
  path: string;
  actionName?: string;
}
