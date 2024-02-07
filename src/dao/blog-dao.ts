import {DBlog, IBlog} from "../models/blog-model";
import {AppLogger} from "../common/logging";
import Blog from "../schemas/blog-schema";

export namespace BlogDao {
    export async function getAllBlogs(limit: number, offset: number): Promise<IBlog[]> {
        
        const blogs = await Blog.aggregate([
            {
                $project: {
                    title: 1,
                    post: 1,
                    category: 1,
                    isValied: 1,
                    uploads: 1,
                    status: 1,
                    createdAt: 1,
                    createdBy: 1,
                    _id: 1,
                }
              },
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
              },
            },
            {
                $unwind: {
                    path: "$createdBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                  from: "uploads",
                  localField: "uploads",
                  foreignField: "_id",
                  as: "uploads",
                },
            },
            { $skip: offset },
            { $limit: limit },
        ]).sort({ createdAt: -1 });

        AppLogger.info(`Got all blogs, total: ${blogs.length}`);
        return blogs;
    }

    export async function getAllBlogsCount(): Promise<any> {
        const blogs = await Blog.find();
        AppLogger.info(`Got all blogs, total: ${blogs.length}`);
        return blogs.length;
    }

    export async function getBlog(blogId: string): Promise<IBlog | null> {
        const blog = await Blog.findById(blogId).populate([{path: 'createdBy'}, {path: 'uploads'}]);
        AppLogger.info(`Got blog for blog ID: ${blogId}`);
        return blog;
    }

    export async function createBlog(data: DBlog): Promise<IBlog | null> {
        const iBlog = new Blog(data);
        let blog = await iBlog.save();
        return blog;
    }

}
