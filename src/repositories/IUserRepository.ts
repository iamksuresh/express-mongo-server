import { IUser } from "./models/user.model";

export interface IUserRepository {
  addUser(userlist: IUser[]): Promise<any>;
}
