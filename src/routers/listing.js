const express = require('express')
const router = express.Router();
const listingModel = require('../Models/listings.models');
const wrapAsync = require('../Utils/wrapAsync');
const {isLoggedIn, isOwner, validateListing} = require('../middleware')


// Index route 
router.get('/', wrapAsync (async (req, res) => {
    const alllistings = await listingModel.find({});
    res.render('listings/index.ejs', {alllistings});
}));

// new route
router.get('/new',isLoggedIn,(req, res) => {
    res.render('listings/new.ejs')
})

// Show route 
router.get('/:id', wrapAsync (async (req, res) => {
    let {id} = req.params;
    const listing = await listingModel.findById(id)
    .populate({
        path: 'reviews', 
        populate: {
          path: 'author',
    }})
    .populate('owner');
    if(!listing) {
        req.flash('error', 'Listing you requested for does not exit!');
        return res.redirect('/listings')
    }
    console.log(listing);
    res.render('listings/show.ejs', {listing})
}));

// Create route
router.post(
    '/',
    isLoggedIn,
    validateListing, 
    wrapAsync (async (req, res, next) => {
         
         let newListing = new listingModel(req.body.listing);
        // Agar image url khaali hai, to default set karo manually
        if (!req.body.listing.image || !req.body.listing.image.url) {
            newListing.image = {
                url: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                filename: "listingimage"
            };
        }
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash('success', 'New Listing Created!')
        res.redirect('/listings');
   
}));

// Edit route
router.get(
    '/:id/edit', 
    isLoggedIn,
    isOwner,
    wrapAsync (async (req, res) => {
    let {id} = req.params;
    const listing = await listingModel.findById(id);
        if(!listing) {
        req.flash('error', 'Listing you requested for does not exit!');
        return res.redirect('/listings')
    }
    res.render('listings/edit.ejs', {listing})
}));

// Update route 
router.put(
    '/:id', 
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync (async(req, res) => {
    let {id} = req.params; 
    await listingModel.findByIdAndUpdate(id, {...req.body.listing});
    req.flash('success', 'Listing Updated!')
    res.redirect(`/listings/${id}`);
}));

// Delete route
router.delete(
    '/:id', 
    isLoggedIn,
    isOwner,
    wrapAsync (async (req, res) => {
    let {id} = req.params;
    let deletedlisting = await listingModel.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash('success', 'Listing Deleted!')
    res.redirect('/listings')
}));

module.exports = router