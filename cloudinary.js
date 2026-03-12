const cloudinary = require("cloudinary").v2;
const multerStorageCloudinary = require("multer-storage-cloudinary");

const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowed_formats: ["png", "jpg", "jpeg"],
  },
});

module.exports = { cloudinary, storage };