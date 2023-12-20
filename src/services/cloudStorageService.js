import { Storage } from "@google-cloud/storage";
import { __dirname } from "../utils.js";

export default class CloudStorageService {

    constructor() {

        this.storage = new Storage({

            keyFilename: `${__dirname}/../backendproject-key.json`

        })

        this.bucket = "backendprojectbucket";

    }

    uploadFileToCloudStorage = (file_directory, file_type, file) => {

        const fileName = `${Date.now()}-${file_directory}-${file_type}-${file.originalname}`;

         // The file data buffer must be accessed and stored in a bucket (container)
        const bucket = this.storage.bucket(this.bucket);
        
        // A blob is created, an element that reserves space and writes what is arriving ---> the byte streams (buffers)
        const blob = bucket.file(fileName)

        // BlobStream is the process/stream of passing and writing the bucket back and forth
        const blobStream = blob.createWriteStream();

        // Convert data stream into promises
        return new Promise((resolve, reject) => {

            blobStream.on('error', error => {

                reject(error);

            })
            blobStream.on('finish', () => {

                // The public URL where the file will be created and accessed in the cloud
                const publicURL = `https://storage.googleapis.com/${this.bucket}/${blob.name}`
                resolve(publicURL);

            })

            // When it is detected that there are no more bytes to write, the process ends
            blobStream.end(file.buffer);

        })

    }

}