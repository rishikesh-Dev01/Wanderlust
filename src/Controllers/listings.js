const listingModel = require('../Models/listings.models');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:  mapToken});

const index = async (req, res) => {
    const alllistings = await listingModel.find({});
    res.render('listings/index.ejs', {alllistings});
}

const renderNewForm = (req, res) => {
    res.render('listings/new.ejs')
}

const showListing = async (req, res) => {
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
}


const createListing = async (req, res, next) => {
        if (!req.body || !req.body.listing || !req.body.listing.location) {
            req.flash('error', 'Location is required for geocoding!');
            return res.redirect('/listings/new');
        }
        let response = await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1
        }).send();

        if (!response.body.features.length) {
            req.flash('error', 'Location not found! Please enter a valid location.');
            return res.redirect('/listings/new');
        }

        if (!req.file) {
            req.flash('error', 'Image upload failed!');
            return res.redirect('/listings/new');
        }
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new listingModel(req.body.listing); 
        newListing.owner = req.user._id;
        newListing.image = {url, filename};

        newListing.geometry = response.body.features[0].geometry;

        const savedListing = await newListing.save();
        console.log(savedListing);
        req.flash('success', 'New Listing Created!')
        res.redirect('/listings');
   
}

const editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await listingModel.findById(id);
        if(!listing) {
        req.flash('error', 'Listing you requested for does not exit!');
        return res.redirect('/listings')
    }
    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace('/upload', '/upload/h_300, w_250')
    res.render('listings/edit.ejs', {listing, originalImageUrl})
}

const updateListing = async(req, res) => {
    let {id} = req.params; 
    if(!req.body || !req.body.listing){
        req.flash('error', 'Invalid listing data');
        return res.redirect(`/listings/${id}/edit`);
    }
    let listing = await listingModel.findByIdAndUpdate(id, {...req.body.listing});

    // Re-geocode if location changed to update map
    if (req.body.listing.location) {
        let geoRes = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        if (geoRes.body.features.length) {
            listing.geometry = geoRes.body.features[0].geometry;
        }
    }

    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
    }
    await listing.save();

    req.flash('success', 'Listing Updated!')
    res.redirect(`/listings/${id}`);
}

const deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedlisting = await listingModel.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash('success', 'Listing Deleted!')
    res.redirect('/listings')
}

module.exports = {
    index, 
    renderNewForm, 
    showListing, 
    createListing, 
    editListing, 
    updateListing, 
    deleteListing
}