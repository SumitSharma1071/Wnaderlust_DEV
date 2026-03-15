const express = require('express');
const router = express.Router();

const {storage} = require('../cloudinary.js');
const multer  = require('multer')
const upload = multer({ storage })

// Error Handler
const wrapAsync = require("../utils/wrapAsync.js");

// Models
const listing = require('../model/listing.js');

// Middleware
const {isLoggedin, isOwner, validateSchema} = require('../middleware.js');
const { populate } = require('../model/user.js');

// Controller
const listingController = require('../controller/listingcontroller.js');

// Listing routes
router.get('/', wrapAsync(listingController.index));

router.get("/category/:name", isLoggedin, wrapAsync(listingController.category));

router.get("/search",isLoggedin, wrapAsync(listingController.search));

// Create new listing
router.route("/new")
.get(isLoggedin, listingController.newGet)
.post(validateSchema, upload.single('listing[image][url]'), wrapAsync(listingController.newPost));

// Update
router.get('/:id/edit', isLoggedin, isOwner,  wrapAsync(listingController.editGet));

router.route('/:id')
.put(isLoggedin, isOwner, upload.single('listing[image][url]'),  validateSchema,  wrapAsync(listingController.editPut))
.get(wrapAsync(listingController.showList)) // Show details of listing
.delete(isLoggedin, isOwner, wrapAsync(listingController.deleteList)); // Delete Lisiitng


module.exports = router;
