import { NextFunction, Request, Response } from "express";
import { SessionData } from "express-session";

export const setupSession = (
  req: Request & { session: any },
  res: Response,
  next: NextFunction
) => {
  if (!req.session.otp) {
    req.session.otp = "";
  }
  if (!req.session.otpExpiry) {
    req.session.otpExpiry = 0;
  }
  next();
};
