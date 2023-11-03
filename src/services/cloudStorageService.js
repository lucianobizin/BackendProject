import { Storage } from "@google-cloud/storage";
import { __dirname } from "../utils.js";

export default class CloudStorageService {

    constructor() {

        this.storage = new Storage({

            keyFilename: `${__dirname}/../backendproject-key.json`

        })

        this.bucket = "backendprojectbucket";

    }

    uploadFileToCloudStorage = (file) => {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(`${Date.now()}-${file.originalname}`)
        const blobStream = blob.createWriteStream();

        return new Promise((resolve, reject) => {
            blobStream.on('error', error => {
                reject(error);
            })
            blobStream.on('finish', () => {
                //Si llegaste hasta aquí, ya se escribió en el bucket
                const publicURL = `https://storage.googleapis.com/${this.bucket}/${blob.name}`
                resolve(publicURL);
            })
            blobStream.end(file.buffer);
        })

    }

    // uploadFileToCloudStorage = (file) => {

    //     // Hay que acceder al buffer de datos del archivo y almacenarlo en un bucket (contenedor)
    //     const bucket = this.storage.bucket(this.bucket);

    //     // Se crea un blob, un elemento que reserva espacio y va escribiendo lo que va llegando ---> los flujos de bytes (buffers)
    //     const blob = bucket.file(`${Date.now()}-${file.originalname}}`);

    //     // BlobStream es el proceso / flujo de paso y escritura del bucket de un lado a otro
    //     const blobStream = blob.createWriteStream();

    //     // Convertir flujo de datos en promesas
    //     return new Promise((resolve, reject) => {

    //         // BlobStream es un flujo de datos y no es una promesa (debería controlarse como un evento)
    //         blobStream.on("error", error => {

    //             console.log(error);

    //             reject(error);

    //         })

    //         // Se crea la URL pública en la que se creará y por la que se podrá acceder al archivo en la nube

    //         blobStream.on("finish", () => {
    //             const publicURL = `https://storage.googleapis.com/${this.bucket}/${blob.name}`;

    //             resolve(publicURL);
    //         })

    //         // Cuando se detecta que no hay más bytes por escribir se termina el proceso
    //         blobStream.end(file.buffer);

    //     });

    // };

}