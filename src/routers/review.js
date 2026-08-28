const express = require('express')
const router = express.Router({mergeParams: true});
const wrapAsync = require('../Utils/wrapAsync');
const ExpressError = require('../Utils/ExpressError');
const Review = require('../Models/review.model')
const listingModel = require('../Models/listings.models');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')



//Post Reviews Route 
router.post(
    '/',
    isLoggedIn,
    validateReview, 
    wrapAsync(async(req, res) => {
    let listing = await listingModel.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success', 'New Review Created!')
    res.redirect(`/listings/${listing._id}`)
}));

// Delete Review route 
router.delete(
    '/:reviewId',
    isLoggedIn, 
    isReviewAuthor,
    wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;

    await listingModel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!')
    res.redirect(`/listings/${id}`)
}))


module.exports = router