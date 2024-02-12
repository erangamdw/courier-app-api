import { Express } from "express";
import { userEp } from "../end-points/user-ep";

export const initAuthRoutes = (app: Express) => {
  // PUBLIC ROUTES

  app.post("/api/public/login", userEp.authenticate);
  app.post("/api/public/register", userEp.register);
};
