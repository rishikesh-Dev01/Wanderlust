const express = require('express')
const router = express.Router({mergeParams: true});
const wrapAsync = require('../Utils/wrapAsync');
const ExpressError = require('../Utils/ExpressError');
const Review = require('../Models/review.model')
const listingModel = require('../Models/listings.models');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
 

const reviewController = require('../Controllers/reviews')


//Post Reviews Route 
router.post(
    '/',
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview));

// Delete Review route 
router.delete(
    '/:reviewId',
    isLoggedIn, 
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview))


module.exports = router