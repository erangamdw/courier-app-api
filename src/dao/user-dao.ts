import { loggers } from "winston";
import { UserLogger } from "../common/loggin";
import { DUSer, IUser } from "../models/userModels";
import User from "../schemas/userSchemas";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Util } from "../common/utils";

export namespace UserDao {
  export const getUserByEmail = async (
    email: string
  ): Promise<IUser | null> => {
    let user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Email was not found");
    } else {
      UserLogger.log(
        "info",
        `Got user for email ,userId: ${user ? user._id : "None"}`
      );

      return user;
    }
  };

  export const authenticateUser = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    try {
      const user = await getUserByEmail(email);

      if (!user) {
        throw new Error("Email was not found");
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw new Error("Password was not found");
      }

      return user.createAccessToken();
    } catch (error: any) {
      throw new Error(error.message); // Re-throwing the error message
    }
  };

  export const UpdateUserData = async (
    userId: string,
    data: Partial<DUSer>
  ) => {
    try {
      const password = data.password;
      delete data.password;
      let updateStatus: boolean = false;
      let user = await User.findByIdAndUpdate(userId, { $set: data });

      if (password && user) {
        user.password = password;
        user = await user.save();
        return (updateStatus = true);
      } else {
        throw new Error("User Data not Updated");
      }
    } catch (error: any) {
      return error.message;
    }
  };
}
