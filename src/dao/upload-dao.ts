import {DUpload, IUpload} from "../models/upload-model";
import Upload from "../schemas/upload-schema";
import {AppLogger} from "../common/logging";

export namespace UploadDao {
    export async function createUpload(data: DUpload): Promise<IUpload> {
        const iUpload: IUpload = new Upload(data);
        console.log(`Created Upload ID: ${iUpload._id}`);
        return await iUpload.save();
    }

    export async function getUpload(imageId: string) {
        const upload = await Upload.findById(imageId);
        console.log(`Get upload for id ${imageId}`);
        return upload;
    }

    export async function deleteUploadById(uploadId: string) {
        Upload.findOneAndDelete({_id: uploadId})
            .then((docs) => {
                if(docs) {
                    return uploadId;
                } else {
                    AppLogger.info('Upload ID not found');
                }
            }).catch((err) => {
            AppLogger.info(err);
        });
        AppLogger.info(`Got Delete for ID: ${uploadId}`);
    }

}
