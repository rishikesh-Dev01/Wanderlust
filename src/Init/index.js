require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
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
    initData.data = initData.data.map((obj) => ({...obj, owner: '6a8ea742e1df2e6b2c07f668'}));
    await listingModel.insertMany(initData.data)
    console.log('Data was initialized')
}

main()