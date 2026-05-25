const cloudinary = require('../config/cloudinary');

const streamifier = require('streamifier');

const uploadToCloudinary = (fileBuffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {
                folder: "EduLoop_Notes",
                resource_type: "auto",
            },

            (error, result) => {

                if (result) {

                    resolve(result);

                } else {

                    reject(error);
                }
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

module.exports = uploadToCloudinary;