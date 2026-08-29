const express = require('express')
const router = express.Router();
const listingModel = require('../Models/listings.models');
const wrapAsync = require('../Utils/wrapAsync');
const {isLoggedIn, isOwner, validateListing} = require('../middleware')
const listingController = require('../Controllers/listings')
const multer  = require('multer');
const {storage} = require('../cloudConfig')
const upload = multer({ storage })


router
    .route('/')
    .get(wrapAsync(listingController.index))
    .post( 
    isLoggedIn,
    upload.single('listing[image][url]'),
    validateListing, 
    wrapAsync(listingController.createListing)
);
     
 
// new route
router.get('/new',isLoggedIn, listingController.renderNewForm)

router 
    .route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync (listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync (listingController.deleteListing))
 

// render Edit route
router.get(
    '/:id/edit', 
    isLoggedIn,
    isOwner,
    wrapAsync (listingController.editListing));

 
module.exports = router