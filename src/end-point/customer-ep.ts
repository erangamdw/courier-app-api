import {Validation} from "../common/validation";
import {IUser, Role} from "../models/user-model";
import {validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {UserDao} from "../dao/user-dao";
import {Util} from "../common/util";
import {DCustomer} from "../models/customer-model";
import {CustomerDao} from "../dao/customer-dao";

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

    export async function register(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return Util.sendError(res, errors.array()[0]['msg']);
        }

        UserDao.getUserByEmail(req.body.email).then((result: IUser | null) => {
            if (result !== null) {
                return Util.sendError(res, "Email already exists!");
            }

            const data: DCustomer = {
                lastLogin: undefined,
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                role: Role.CUSTOMER,
            };

            CustomerDao.createCustomer(data).then(async token => {
                Util.sendSuccess(res, token);
            }).catch(next);
        });
    }
}