const mongoose = require('mongoose');
const Review = require('./Review.js');

let listingSchema = new mongoose.Schema({
        title: {
           type : String,
           required : true
        },
        description: {
            type : String,
        },
        price: {
            type : Number,
            required : true
        },
        image: {
            url : String,
            filename : String,
        },
        location: {
            type : String,
        },
        country: {
            type : String,
        },
        reviews : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }],
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
});

listingSchema.post('findOneAndDelete', async (listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

 let listing = mongoose.model('listing', listingSchema);

module.exports = listing;