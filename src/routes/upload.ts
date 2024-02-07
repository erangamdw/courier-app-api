import {Express} from "express";
import {UploadEp} from "../end-point/upload-ep";
import multer = require("multer");
import {uploadPath} from "../config";

const upload = multer({dest: `${uploadPath}/`}).single('upload');

export function initUploadRoutes(app: Express) {
    // PUBLIC ROUTES
    app.get(`${process.env.FILE_ACCESS_URL}/:imageId`, UploadEp.geThumbnail);
    // app.get(`${process.env.FILE_ACCESS_URL}/:imageId/:test`, UploadEp.getImage);

    /* AUTH ROUTES */
    app.post('/api/public/upload', upload, UploadEp.uploadFile);

    /* ADMIN ROUTES */
    app.post('/api/admin/upload/delete/:uploadId', UploadEp.uploadFile);


}
