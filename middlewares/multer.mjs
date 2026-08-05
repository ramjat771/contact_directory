import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "../config/config.mjs";
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_API_KEY,
  api_secret: config.CLOUD_API_SECRATE,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
         public_id: (req, file)=> { 
      const name = file.originalname.split(".")[0];
      return `${name}_${Date.now()}`},             // unique name
  },
});
export const upload = multer({ storage });
