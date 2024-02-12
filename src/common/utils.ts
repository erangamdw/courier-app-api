import { Response } from "express";
import mongoose from "mongoose";

export type StringOrObjectId = string | mongoose.Types.ObjectId;

export namespace Util {
  export const sendSuccess = (res: Response, data: any) => {
    res.send({ success: true, data: data, message: null });
  };

  export const sendError = (res: Response, error: any, errorCode = 0) => {
    if (typeof error === "string") {
      res.send({ success: false, error: error, errorCode: errorCode });
    } else {
      if (!error) {
        error = { stack: null, message: "Unknown error" };
      }
    }
  };
}
