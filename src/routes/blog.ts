import {Express} from "express";
import { BlogEp } from "../end-point/blog-ep";

export function initBlogRoutes(app: Express) {
    // PUBLIC ROUTES
    app.get('/api/public/get-all-blogs/:limit?/:offset?', BlogEp.getAllBlogs);
    app.get('/api/public/get-blog/:id', BlogEp.getBlogById);

    // AUTH ROUTES
    app.post('/api/auth/create-blog', BlogEp.createBlog);
    app.post('/api/auth/update-blog', BlogEp.updateBlog);
    app.delete('/api/auth/delete-blog', BlogEp.deleteBlog);
}
