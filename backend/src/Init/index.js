require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') }) // fallback to root .env
const mongoose = require('mongoose')
const initData = require('./data')
const listingModel = require('../Models/listings.models')

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to Db')
        await initDB()
    } catch (err) {
        console.log('Database connection error', err)
    }
}

const initDB = async () => {
    await listingModel.deleteMany({})
    const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
    const mapToken = process.env.MAP_TOKEN;
    const geocodingClient = mbxGeocoding({ accessToken: mapToken });

    // Geocode each listing location to add geometry for map (with fallback)
    const geocodedData = await Promise.all(initData.data.map(async (obj) => {
        let geometry = { type: 'Point', coordinates: [77.2090, 28.6139] }; // default Delhi fallback
        try {
            const res = await geocodingClient.forwardGeocode({
                query: `${obj.location}, ${obj.country}`,
                limit: 1
            }).send();
            if (res.body.features.length) {
                geometry = res.body.features[0].geometry;
            }
        } catch (e) {
            console.warn(`Geocoding failed for ${obj.location}: ${e.message}`);
        }
        return { ...obj, owner: '6a8ea742e1df2e6b2c07f668', geometry };
    }));

    await listingModel.insertMany(geocodedData)
    console.log('Data was initialized with geometry')
}

main()