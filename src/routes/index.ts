import {Express, Request, Response} from "express";
import {Util} from "../common/util";
import {initAuthRoutes} from "./auth";
import {initUploadRoutes} from "./upload";
import {initBloggerRoutes} from "./blogger";
import {initBlogRoutes} from "./blog";

export function initRoutes(app: Express) {
    /* TOP LEVEL */
    app.get('/api', (req: Request, res: Response) => Util.sendSuccess(res, "Photography™ Api"));

    initAuthRoutes(app);
    initUploadRoutes(app);
    initBlogRoutes(app);
    initBloggerRoutes(app);

    /* ALL INVALID REQUESTS */
    app.all('*', (req: Request, res: Response) => Util.sendError(res, "Route Not Found"));
}
