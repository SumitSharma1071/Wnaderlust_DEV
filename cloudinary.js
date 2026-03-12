const cloudinary = require("cloudinary").v2;
const multerStorageCloudinary = require("multer-storage-cloudinary");

const storage = multerStorageCloudinary({
  cloudinary: cloudinary,
  folder: "wanderlust_DEV",
  allowedFormats: ["png", "jpg", "jpeg"]
});

module.exports = {
  cloudinary,
  storage
};