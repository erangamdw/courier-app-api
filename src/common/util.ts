import {NextFunction, Request, Response} from "express";
import {ErrorLogger} from "./logging";
import * as mongoose from "mongoose";

export type ObjectIdOr<T extends mongoose.Document> = mongoose.Types.ObjectId | T;

export type StringOrObjectId = string | mongoose.Types.ObjectId;

export namespace Util {

    export function sendSuccess(res: Response, data: any) {
        res.send({success: true, data: data, message: null});
    }

    export function sendError(res: Response, error: any, errorCode = 0) {
        if (typeof error === 'string') {
            res.send({success: false, error: error, errorCode: errorCode});
        } else {
            if (!error) {
                error = {stack: null, message: "Unknown Error"};
            }
            ErrorLogger.error(error.stack);
            res.send({success: false, error: error.message, errorData: error, errorCode: errorCode});
        }
    }

    export function withErrorHandling(requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
        return function updateProject(req: Request, res: Response, next: NextFunction) {
            requestHandler(req, res, next).catch(next);
        };
    }

    export function addDays(date: Date, days: number) {
        // @ts-ignore
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}
