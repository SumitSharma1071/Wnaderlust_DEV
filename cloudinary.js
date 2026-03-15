const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const multerStorageCloudinary = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
});

// Create storage using old syntax
const storage = multerStorageCloudinary({
  cloudinary: cloudinary,
  folder: "wanderlust_DEV",
  allowedFormats: ["png", "jpg", "jpeg", "avif"]
});

const upload = multer({ storage })


module.exports = { cloudinary, upload };