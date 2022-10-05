import { inject, injectable } from "inversify";
import { IUserRepository } from "../IUserRepository";
import IUserModel, { IUser, User } from "../models/user.model";
import { commonServiceTypes } from "../../applicationSetup";
import mongoose from "mongoose";
import { MessageEnum } from "../../enum/MessageEnum";

@injectable()
export class UserRepository implements IUserRepository {
  @inject(commonServiceTypes.DbConnection)
  private readonly _dbConnection: mongoose.Connection;

  addUser = async (userlist: IUser[]): Promise<any> => {
    const session = await this._dbConnection.startSession();
    let dbUserList: IUserModel[] | [] = [];

    try {
      session.startTransaction();
      dbUserList = await User.insertMany(userlist, { session });
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw MessageEnum.DB_USER_CREATION_ERROR;
    }

    session.endSession();
    return dbUserList;
  };
}
