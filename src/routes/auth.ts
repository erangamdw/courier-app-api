import {Express} from "express";
import {UserEp} from "../end-point/user-ep";
import {BloggerEp} from "../end-point/blogger-ep";

export function initAuthRoutes(app: Express) {
// PUBLIC ROUTES

    app.post('/api/public/login', UserEp.authenticate);
    app.post('/api/public/register',  UserEp.register);
    app.get('/api/auth/self', UserEp.getSelf);



}
