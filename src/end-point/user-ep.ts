import { NextFunction, Request, Response } from "express";
import {validationResult} from "express-validator";
import {Util} from "../common/util";
import {UserDao} from "../dao/user-dao";
import {Validation} from "../common/validation";
import {Role} from "../models/user-model";
import {CustomerEp} from "./customer-ep";

export namespace UserEp {

    export function authValidationRules() {
        return [
            Validation.email(),
            Validation.password()
        ];
    }

    export function registerValidationRules() {
        return [
            Validation.role(Role.CUSTOMER),
            Validation.email(),
            Validation.name(),
            Validation.password,
            Validation.noPermissions(),
        ];
    }

    export async function authenticate(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return Util.sendError(res, errors.array()[0]['msg']);
        }

        UserDao.authenticateUser(req.body.email, req.body.password).then((token: string) => {
            Util.sendSuccess(res, token);
        }).catch(next);
    }

    export async function register(req: Request, res: Response, next: NextFunction) {
        try {
            await CustomerEp.register(req, res, next);
        } catch (e) {
            Util.sendError(res, e);
        }
    }

    export function getSelf(req: Request, res: Response, next: NextFunction) {
        UserDao.getUserById(req.user!._id).then(user => {
            Util.sendSuccess(res, user);
        }).catch(next);
    }
}