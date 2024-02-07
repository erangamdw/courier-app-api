import {NextFunction, Request, Response} from "express";
import {ApplicationError} from "../common/application-error";
import {DUpload} from "../models/upload-model";
import {Util} from "../common/util";
import {UploadDao} from "../dao/upload-dao";
import * as fs from "fs";

export namespace UploadEp {
    export async function uploadFile(req: Request, res: Response, next: NextFunction) {
        const file = req.file;
        const body = req.body;
        if (!file) {
            throw new ApplicationError('No file found to Upload');
        }

        const data: DUpload = {
            name: body.fileName,
            type: file.mimetype,
            category: 'any',
            path: file.path,
            originalName: ""
        };

        return UploadDao.createUpload(data)
            .then(async fileUpload => Util.sendSuccess(res, fileUpload))
            .catch(next);

    }

    export async function getImage(req: Request, res: Response) {
        const imageId = req.params.imageId;
        const upload = await UploadDao.getUpload(imageId);
        if (fs.existsSync(upload!.path)) {
            return fs.createReadStream(upload!.path).pipe(res);
        } else {
            return fs.createReadStream(process.env.DEFAULT_FILE as string).pipe(res);
        }
    }

    export async function geThumbnail(req: Request, res: Response) {
        try {
            const imageId = req.params.imageId;
            const folder = req.params.folderName;

            const upload = await UploadDao.getUpload(imageId);

            if (upload) {
                if (fs.existsSync(upload.path)) {
                    return fs.createReadStream(upload.path).pipe(res);
                } else {
                    return fs.createReadStream(process.env.DEFAULT_FILE as string).pipe(res);
                }
            }
        } catch (error) {
            return Util.sendError(res, "Invalid Token.");
        }
    }

    export function deleteAdminUpload(req: Request, res: Response, next: NextFunction) {
        const uploadId = req.params.uploadId;
        UploadDao.deleteUploadById(uploadId).then(id => {
            Util.sendSuccess(res, id);
        }).catch(next);
    }

    export function deleteUserUpload(req: Request, res: Response, next: NextFunction) {
        const uploadId = req.params.id;
        UploadDao.deleteUploadById(uploadId).then(id => {
            Util.sendSuccess(res, id);
        }).catch(next);
    }
}
