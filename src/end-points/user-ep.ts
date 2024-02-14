import { NextFunction, Request, Response } from "express";
import { Validation } from "../common/validation";
import { Role } from "../models/userModels";
import { validationResult } from "express-validator";
import { Util } from "../common/utils";
import { CustomerEp } from "./customer-ep";
import { UserDao } from "../dao/user-dao";

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

  export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);

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
}
