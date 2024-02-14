import { loggers } from "winston";
import { UserLogger } from "../common/loggin";
import { IUser } from "../models/userModels";
import User from "../schemas/userSchemas";

export namespace UserDao {
  export const getUserByEmail = async (
    email: string
  ): Promise<IUser | null> => {
    let user = await User.findOne({ email: email });
    UserLogger.log(
      "info",
      `Got user for email ,userId: ${user ? user._id : "None"}`
    );

    return user;
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
}
