const express = require('express');
const router = express.Router();

// Error Handler
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// Models
const listing = require('../model/listing.js');
const Review = require('../model/Review.js');

// Validation
const {listingSchema, reviewSchema } = require('../schema.js');

// middleware
const {validateReview, isLoggedin, isOwner} = require('../middleware.js');

// Controller
const ReviewController = require('../controller/reviewController.js');

// Review Post
router.post('/:id/review',isLoggedin, validateReview, wrapAsync(ReviewController.reviewPost));

// Delete Review
router.delete("/:id/review/:reviewid", wrapAsync(ReviewController.reviewDelete));

module.exports = router;