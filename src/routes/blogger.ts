import {Express} from "express";
import {BloggerEp} from "../end-point/blogger-ep";

export function initBloggerRoutes(app: Express) {
// PUBLIC ROUTES

    app.post('/api/public/create-blogger', BloggerEp.registerAsBlogger);



}
