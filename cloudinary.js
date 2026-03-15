const cloudinary = require("cloudinary"); // NOT cloudinary.v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
});

const multerStorageCloudinary = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = multerStorageCloudinary({
  cloudinary: cloudinary, // pass the cloudinary instance
  folder: "wanderlust_DEV",
  allowedFormats: ["png","jpg","jpeg","avif"]
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };