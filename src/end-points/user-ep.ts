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

  export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return Util.sendError(res, errors.array()[0]["msg"]);
    }

    await UserDao.authenticateUser(req.body.email, req.body.password)
      .then((token: string) => {
        Util.sendSuccess(res, token);
      })
      .catch(next);
  };

  export async function register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await CustomerEp.register(req, res, next);
    } catch (e) {
      Util.sendError(res, e);
    }
  }
}
