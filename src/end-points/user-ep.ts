import { NextFunction, Request, Response } from "express";
import { Validation } from "../common/validation";
import { DUSer, Role } from "../models/userModels";
import { validationResult } from "express-validator";
import { Util } from "../common/utils";
import { CustomerEp } from "./customer-ep";
import { UserDao } from "../dao/user-dao";
import { mailService } from "../services/mailer";
import { OtpCodeProvide } from "../common/OTPgen";

import OTPSchema, { OTPDocument } from "../schemas/otpSchema";
import jwt, { Secret } from "jsonwebtoken";

export namespace userEp {
  export const authValidatioRules = () => {
    return [Validation.email(), Validation.password()];
  };

  export const regiterValodationRules = () => {
    return [
      Validation.role(Role.CUSTOMER),
      Validation.email(),
      Validation.name(),
      Validation.password,
      Validation.noPermissions(),
    ];
  };
  // ////////////////
  // USER AUTHENTICATION
  // ///////////////
  export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    validationResult(req);

    try {
      const token = await UserDao.authenticateUser(
        req.body.email,
        req.body.password
      );

      return Util.sendSuccess(res, token);
    } catch (error: any) {
      return Util.sendError(res, error.message);
    }
  }

  // ////////////////
  // USER REGISTRATION
  // ///////////////
  export async function register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await CustomerEp.register(req, res, next);
    } catch (e) {
      return Util.sendError(res, e);
    }
  }

  // ////////////////
  // USER PASSWORD RESET EMAIL CHECK
  // ///////////////
  export const resetPassowrd = async (
    req: Request & { session: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return Util.sendError(res, errors.array()[0]);
      }

      await UserDao.getUserByEmail(req.body.email)

        .then(async (user) => {
          const userId = user?.id;
          const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET_KEY as Secret
          );
          // ////////////////
          // Send OTP via email
          // ///////////////
          if (userId) {
            const otpCode = OtpCodeProvide();
            const otpDocument = await OTPSchema.create({
              userId,
              otpCode,
              token,
              expiry: new Date(Date.now() + 2 * 60 * 1000),
            })
              .then((user) => {
                mailService({
                  userName: userId.name,
                  userEmail: req.body.email,
                  subject: "OTP CODE",
                  text: `Your OTP is ${otpCode}`,
                });

                console.log(otpCode);
              })
              .catch((error) => {
                return Util.sendError(
                  res,
                  "Please wait for 2 minutes because your token is not expired"
                );
              });

            // const token = otpDocument.createAccessToken();
            const userData = {
              userEmail: user?.email,
              userId,
              token,
            };
            return Util.sendSuccess(res, userData);
          }
        })
        .catch((err) => {
          return Util.sendError(res, err.message);
        });
    } catch (error) {
      return Util.sendError(res, error);
    }
  };

  // ////////////////
  // USER USER ENTERED OTP VALID CHECK
  // ///////////////
  export const verifyOTP = async (
    req: Request & { session: any },
    res: Response
  ) => {
    try {
      const { OTPValues, userId } = req.body;

      console.log("front end OTP", OTPValues, "userId", userId);

      // ////////////////
      // OTP CHECK IS VALID
      // ///////////////
      if (!OTPValues) {
        return Util.sendError(res, "OTP is required");
      }

      if (userId) {
        const otpDoc = await OTPSchema.findOne({ userId });

        const { expiry, otpCode } = otpDoc || {};

        if (expiry && expiry <= new Date()) {
          await OTPSchema.findByIdAndUpdate(
            otpDoc?._id,
            { $unset: { otpCode: 1 } },
            { new: true }
          );
        }

        if (otpCode) {
          if (OTPValues === otpCode) {
            return Util.sendSuccess(res, "OTP code is Valid");
          } else {
            return Util.sendError(res, "OTP Code is Not Valid");
          }
        } else {
          return Util.sendError(res, "OTP Code is Expired");
        }
      } else {
        return Util.sendError(res, "User Id not found");
      }
    } catch (error) {}
  };

  // ////////////////
  // USER ENTERED NEW PASSWORD UPDATE FUNCTION
  // ///////////////
  export const UpdatePassword = async (req: Request, res: Response) => {
    const { userId, password, userToken } = req.body;

    // Update new password
    const userData: Partial<DUSer> = {
      password: password,
    };

    if (userId && userToken) {
      try {
        const otpDoc: OTPDocument | null = await OTPSchema.findOne({ userId });

        if (otpDoc) {
          const { token } = otpDoc;
          console.log("Created Token", token);
          console.log("User Token", userToken);
          if (token === userToken) {
            // User Token is valid
            UserDao.UpdateUserData(userId, userData)
              .then((updateUserStatus) => {
                if (updateUserStatus) {
                  Util.sendSuccess(res, "User Password Updated");
                } else {
                  Util.sendError(res, "Failed to update user password");
                }
              })
              .catch((error) => {
                Util.sendError(res, error.message);
              });
          } else {
            Util.sendError(res, "User Token is Invalid");
          }
        } else {
          Util.sendError(res, " Not found  the user");
        }
      } catch (error) {
        Util.sendError(res, "User Data Not Found");
      }
    } else {
      Util.sendError(res, "UserID or Token Invalid");
    }
  };
}
