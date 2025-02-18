import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs' // this is called file system

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if(!filePath) return null;

        // uploading on cloud
        const response = await cloudinary.uploader.upload(filePath,{
            resource_type: 'auto',
        })
        fs.unlinkSync(filePath);
        return response;
        
    } catch (error) {
        // remove the locally saved temporary file as the upload operation got failed
        fs.unlinkSync(filePath);
        return null;
    }
};

const uploadMultipleToCloudinary = async (files) => {
    try {
        // console.log("files :: ",files)
        if(files){
            const uploadPromises =  files.map((file) => 
                cloudinary.uploader.upload(file.path,{
                    resource_type: 'auto',
                    folder: 'gig'
                })
            )
            //It is used to wait for multiple asynchronous operations
            const response = await Promise.all(uploadPromises);
            // Delete temporary files after upload on cloud
            files.forEach((file) => fs.unlinkSync(file.path));

            return response.map((res) => res?.secure_url); // return array of URLs
        }else{
            return null;
        }


    } catch (error) {
        console.error("Cloudinary Upload multiple Failed:", error);
        return null;
    }
}

export {uploadOnCloudinary, uploadMultipleToCloudinary};