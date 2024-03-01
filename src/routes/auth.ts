import { Express } from "express";
import { userEp } from "../end-points/user-ep";
import { setupSession } from "../middleware/sesseionMiddleware";

export const initAuthRoutes = (app: Express) => {
  // PUBLIC ROUTES

  app.post("/api/public/login", userEp.authenticate);
  app.post("/api/public/register", userEp.register);
  app.post("/api/public/resetpassword", userEp.resetPassowrd);
  app.post("/api/public/verifyotp", userEp.verifyOTP);
  app.post("/api/public/updatepassword", userEp.UpdatePassword);
};
