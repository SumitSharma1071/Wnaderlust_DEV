// listingRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../cloudinary.js');
const listingController = require('../controller/listingcontroller.js');
const { isLoggedin, isOwner, validateSchema } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');

// Index
router.get('/', wrapAsync(listingController.index));

// Category
router.get("/category/:name", isLoggedin, wrapAsync(listingController.category));

// Search
router.get("/search", isLoggedin, wrapAsync(listingController.search));

// New Listing
router.route("/new")
    .get(isLoggedin, listingController.newGet)
    .post(isLoggedin, validateSchema, upload.single('image'), wrapAsync(listingController.newPost));

// Edit Listing
router.get('/:id/edit', isLoggedin, isOwner, wrapAsync(listingController.editGet));
router.route('/:id')
    .put(isLoggedin, isOwner, upload.single('image'), validateSchema, wrapAsync(listingController.editPut))
    .get(wrapAsync(listingController.showList))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.deleteList));

module.exports = router;