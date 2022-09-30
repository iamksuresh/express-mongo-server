import { Schema, Document, model } from "mongoose";

export interface IUser {
  username: string;
  university: string;
  email: string;
}

export default interface IUserModel extends Document, IUser {}

const schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUserModel>("User", schema);
