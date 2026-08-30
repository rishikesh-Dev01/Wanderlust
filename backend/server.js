require('dotenv').config({ path: require('path').join(__dirname, '.env') })
require('dotenv').config({ path: require('path').join(__dirname, '../.env') }) // fallback to root .env
const app = require('./src/app')
const connectDB = require('./src/DB/db')

connectDB()

app.listen(8080, () => {
    console.log('server is running on port 8080');
    
})