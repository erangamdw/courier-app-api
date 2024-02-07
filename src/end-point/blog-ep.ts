import {NextFunction, Request, Response} from "express";
import {BlogDao} from "../dao/blog-dao";
import {Util} from "../common/util";
import { UploadCategory } from "../common/UploadCategory";
import multer from "multer";
import { DUpload } from '../models/upload-model';
import { UploadDao } from "../dao/upload-dao";
import { DBlog } from '../models/blog-model';
import { Types } from "mongoose";
var fs = require("fs");
import * as path from "path";

export namespace BlogEp {
    export async function getAllBlogs(req: Request, res: Response, next: NextFunction) {
        const limit = Number(req.params.limit);
        const offset = Number(req.params.offset);
        console.log(limit, offset);

        try {    
            const blogs = await BlogDao.getAllBlogs(limit, offset);
    
            const blogsCount = await BlogDao.getAllBlogsCount();
    
            let newCount = blogsCount - limit * offset;
    
            if (blogs.length === 0) {
                return Util.sendError(res, "No articles found.");
            }
    
            const data = {
                articleSet: blogs,
                count: newCount,
            };

            return Util.sendSuccess(res, data);
        } catch (error) {
            return Util.sendError(res, error);
        }
    }

    export async function createBlog(req: Request, res: Response, next: NextFunction) {
        const userId = req.user?._id;
        let uploadBlogImg = `${process.env.UPLOAD_PATH}/${UploadCategory.BLOG_IMAGE}`;

        let uploadedFiles: any[] = [];
      
        const storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                await blogValidationRules(req, file, cb);
            },
        });

        async function blogValidationRules(req: any, file: any, cb: any) {
            try {
                let blogDetails = JSON.parse(req.body.blogDetails);
        
                if (!blogDetails.title || typeof blogDetails.title !== "string") {
                return cb(Error("blog title is required."));
                }

                if (!blogDetails.post || typeof blogDetails.post !== "string") {
                    return cb(Error("blog post is required."));
                }
        
                fs.access(uploadBlogImg, (error: any) => {
                    if (error) {
                      return fs.mkdir(uploadBlogImg, (error: any) => {
                        cb(error, uploadBlogImg);
                      });
                    } else {
                        return cb(null, uploadBlogImg);
                    }
                });

            } catch (error) {
                return cb(Error(error), null);
            }
        }

        const upload = multer({ storage: storage }).array("blogFiles", 3);
      
        try {
            upload(req, res, async function (error: any) {
                if (error) {
                    console.log(error);
                    return Util.sendError(res, error + "");
                }

                if (req.files!.length <= 0) {
                    return Util.sendError(res, "Blog image is required.");
                }

                const uploads: any = req.files;

                const blogDetails = JSON.parse(req.body.blogDetails);

                for (const upload of uploads) {
                        const data: DUpload = {
                            type: upload.mimetype,
                            category: UploadCategory.BLOG_IMAGE,
                            path: upload.path,
                            name: upload.filename,
                            fileSize: upload.size,
                            userId: userId as unknown as Types.ObjectId,
                            extension: path.extname(upload.originalname),
                            originalName: upload.originalname,
                        }

                        let uploadedFile = await UploadDao.createUpload(data);

                        uploadedFiles.push(uploadedFile);
                }

                let uploadedIds: any = uploadedFiles.map((item: any) => {
                    return item._id;
                });

                const blog: DBlog = {
                    createdBy: userId as unknown as Types.ObjectId,
                    category: blogDetails.category,
                    title: blogDetails.title,
                    post: blogDetails.post,
                    isValied: true,
                    uploads: uploadedIds,
                }


                try {
                    let savedBlog = await BlogDao.createBlog(blog);
                    
                    if (savedBlog === null) {
                        return Util.sendError(res, 'Blog could not saved!')
                    }

                    return Util.sendSuccess(res, savedBlog)
                } catch (error) {
                    return Util.sendError(res, error);
                }

            });
        } catch (error) {
            return Util.sendError(res, error);
        }
    }

    export async function updateBlog(req: Request, res: Response, next: NextFunction) {
        
    }

    export async function deleteBlog(req: Request, res: Response, next: NextFunction) {
        
    }

    export async function getBlogById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        try {
            const blog = await BlogDao.getBlog(id);

            if (blog) {
                return Util.sendSuccess(res, blog);
            } else {
                return Util.sendError(res, 'No Blog here');
            }
        } catch (error) {
            return Util.sendError(res, error);
        }
    }

}
