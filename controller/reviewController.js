const Review = require('../model/Review.js');
const listing = require('../model/listing.js');

module.exports.reviewPost = async (req, res) => {

    const listings = await listing.findById(req.params.id);
    if(!listings) throw new ExpressError(404, "Listing Not Found");

    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();

    listings.reviews.push(review._id);
    await listings.save();
    req.flash('success', 'Review Posted!');
    res.redirect(`/listing/${req.params.id}`);
}

module.exports.reviewDelete = async (req, res) => {
    let { id, reviewid } = req.params;

    await listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewid }
    });

    await Review.findByIdAndDelete(reviewid);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/listing/${id}`);
}