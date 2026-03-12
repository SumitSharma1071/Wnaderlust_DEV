const mongoose = require('mongoose');

const {Schema} = mongoose;

const reviewSchema = new Schema({
    comment : {
        type : String,
    } ,
    rating : {
        type : Number,
        Min : 1,
        Max : 5
    },
    created_At : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
});

let Review = mongoose.model('Review', reviewSchema);

module.exports = Review;