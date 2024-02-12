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
  ): Promise<string> => {
    const user = await getUserByEmail(email);
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw UserLogger.log("error", "Incorrect Email and password");
      }

      return user.createAccessToken();
    } else {
      throw UserLogger.log("error", "User not found in the system!");
    }
  };
}
