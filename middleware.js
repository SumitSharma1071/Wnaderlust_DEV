const listing = require('./model/listing.js');
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require('./schema.js');


module.exports.isLoggedin = (req, res, next) => {
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'Not login for access!');
        res.redirect('/login');
     }else{ 
     next();
     }
}

module.exports.saveRedirectUrl = (req, res, next) =>{
   if(req.session.redirectUrl){
      res.locals.redirect = req.session.redirectUrl;
   }
   next();
}

module.exports.isOwner = async (req, res, next) =>{
   let {id} = req.params;
   const listings = await listing.findById(id);
   if(!listings.owner._id.equals(res.locals.currUser._id)){
      req.flash('error', 'You are not permitted this change');
      return res.redirect('/listing/' + id);
   }
   next();
}

module.exports.validateSchema = (req, res, next) =>{
    let { error } = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{ 
        next();
    }
};

module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
