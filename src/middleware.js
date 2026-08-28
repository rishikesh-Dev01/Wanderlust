const listingModel = require('./Models/listings.models')
const ExpressError = require('./Utils/ExpressError');
const {listingSchema, reviewSchema,} = require('../schema');
const Review = require('./Models/review.model');


const isLoggedIn = (req, res, next) => {
    // console.log(req.path, "..", req.originalUrl);
        if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to create listing!')
        return res.redirect('/login')
    }
    next();
}

const saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
         res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


const isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await listingModel.findById(id);
    if(!listing.owner.equals(res.locals.currUsers._id)){
        req.flash('error', "You are not owner of this liting ")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

const validateListing = ((req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(','); 
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
});

const validateReview = ((req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(','); 
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
});

const isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review= await  Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUsers._id)){
        req.flash('error', "You are not author of this review ")
        return res.redirect(`/listings/${id}`)
    }
    next();
}





module.exports = {isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, isReviewAuthor, }