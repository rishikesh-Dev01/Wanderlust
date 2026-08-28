const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user.model');

    
const listingRouter = require('./routers/listing');
const reviewRouter = require('./routers/review');
const userRouter= require('./routers/user');

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const sessionOption = {
    secret: 'mysupersecretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.get('/', (req, res) => {
    res.send("Hey i'm root ");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error'); 
    res.locals.currUsers = req.user;
    next();
})

// app.get('/demouser', async(req, res) => {
//     let fakeUser = new User({
//         email: 'student@gmail.com',
//         username: 'delta-student'
//     });

//     let registeredUser = await User.register(fakeUser, 'helloworld')
//     res.send(registeredUser)
// })


app.use('/listings', listingRouter);
app.use('/listings/:id/reviews/', reviewRouter);
app.use('/', userRouter);


app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'));
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message} );
   // res.status(statusCode).send(message);
})

module.exports = app