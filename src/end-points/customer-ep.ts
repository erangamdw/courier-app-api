import { NextFunction, Request, Response } from "express";
import { Validation } from "../common/validation";
import { IUser, Role } from "../models/userModels";
import { validationResult } from "express-validator";
import { Util } from "../common/utils";
import User, { userSchema } from "../schemas/userSchemas";
import { UserLogger } from "../common/loggin";
import { UserDao } from "../dao/user-dao";
import { mailService } from "../services/mailer";

export namespace CustomerEp {
  export function registerValidationRules() {
    return [
      Validation.role(Role.CUSTOMER),
      Validation.email(),
      Validation.name(),
      Validation.password,
      Validation.noPermissions(),
    ];
  }

  export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      Util.sendError(res, errors.array()[0]);
    }

    UserDao.getUserByEmail(req.body.email).then((result: IUser | null) => {
      if (result !== null) {
        return Util.sendError(res, "Email already exists!");
      }

      const data = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        role: Role.CUSTOMER,
      };

      User.create(data)
        .then(async (token) => {
          Util.sendSuccess(res, token);
          mailService({
            userName: req.body.name,
            userEmail: req.body.email,
            subject: "register",
            text: "regText",
          });
        })
        .catch(next);
    });
  };
}
