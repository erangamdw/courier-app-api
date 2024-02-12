import { Express, Request, Response } from "express";
import { initAuthRoutes } from "./auth";
import { Util } from "../common/utils";

export function initRoutes(app: Express) {
  initAuthRoutes(app);
  app.all("*", (req: Request, res: Response) =>
    Util.sendError(res, "Route Not Found")
  );
}
