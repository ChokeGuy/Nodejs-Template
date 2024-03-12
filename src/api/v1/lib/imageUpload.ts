import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";
import multer from "multer";

// Set the storage engine.
// The destination is the folder you want the uploaded file to be saved.
// You will have to create the destination folder yourself in the project folder.
const storage = multer.diskStorage({
  destination: "../assests/uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Init upload request
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

//Cloudinary upload
export function cloudinaryConfig() {
  cloudinary.config({
    cloud_name: "dt2yrsa81",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(
  imageString: string,
  publicId: string,
  collection: string
): Promise<UploadApiResponse> {
  try {
    if (!imageString) {
      throw new Error("Image upload is required");
    }

    const uploadOptions: UploadApiOptions = {
      public_id: publicId,
      resource_type: "auto",
      type: "upload",
      overwrite: true,
      tags: [collection],
    };

    const result = await cloudinary.uploader.upload(imageString, uploadOptions);

    return result;
  } catch (error) {
    throw new Error("Fail to upload image");
    console.log(error);
  }
}

export async function uploadMultipleImages(
  imageUrls: string[],
  publicIds: string[],
  collection: string
) {
  try {
    const uploadPromises = imageUrls.map((imageUrl, index) => {
      return cloudinary.uploader.upload(imageUrl, {
        public_id: publicIds[index],
        resource_type: "image",
        type: "upload",
        overwrite: true,
        tags: [collection],
      });
    });

    const results = await Promise.all(uploadPromises);
    console.log(results);
  } catch (error) {
    console.log(error);
  }
}

export default cloudinary;
