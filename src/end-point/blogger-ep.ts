import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {Util} from "../common/util";
import {UserDao} from "../dao/user-dao";
import {IUser, Role} from "../models/user-model";
import {DBlogger} from "../models/blogger-model";
import {BloggerDao} from "../dao/blogger-dao";


export namespace BloggerEp {
    export async function registerAsBlogger(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return Util.sendError(res, errors.array()[0]['msg']);
        }

        UserDao.getUserByEmail(req.body.email).then((result: IUser | null) => {
            if (result !== null) {
                return Util.sendError(res, "Email already exists!");
            }

            const data: DBlogger = {
                lastLogin: undefined,
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                role: Role.BLOGGER,
            };

            BloggerDao.createBlogger(data).then(async token => {
                Util.sendSuccess(res, token);
            }).catch(next);
        });
    }
}