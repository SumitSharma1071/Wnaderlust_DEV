if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
let port = process.env.PORT || 8080;
let path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
// Authentication
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local');
const User = require('./model/user.js');

// Routers
const ReviewRouter = require('./routes/ReviewRoute.js');
const lisitngRouter = require('./routes/listingRoute.js');
const userRouter = require('./routes/user.js');

// MiddleWares
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_ATLAS,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});

const sessionObject = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};  

store.on("error", (err) => {
    console.log("Session Store Error", err);
});

app.use(session(sessionObject));
app.use(flash());
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());


// Authentication Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
}); 

passport.use(new LocalStrategy(User.authenticate()));

// Serialize and Deserialize the Authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        const email = profile.emails && profile.emails[0].value; // <- yahan email nikal rahe hain
        if(!email) return done(new Error("No email found in Google profile"));

        let user = await User.findOne({ googleId: profile.id });

        if(user){
            return done(null, user);
        } else {
            user = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: email // <- email must fill here
            });
            await user.save();
            return done(null, user);
        }
    } catch(err) {
        return done(err);
    }
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Static Files and Template
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

// flash Middleware
app.use((req, res, next) => {
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   res.locals.currUser = req.user;
    next();
});

// Mongooose connnection
const mongoose = require('mongoose');
async function main() {
    await mongoose.connect(process.env.MONGO_ATLAS);
}
main()
.then(() =>{
    console.log("Connected Successfully");
}).catch((err) =>{
    console.log(err);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/listing'); // ya jahan redirect karna ho
});

app.get("/", (req, res) => {
    res.redirect("/listing");
});

//  lisitng api's
app.use('/listing', lisitngRouter);

// Review api's
app.use('/listing', ReviewRouter);

// User SignUp Sign In
app.use('/', userRouter);

// Error Handler MiddleWare
app.use((err, req,  res, next) =>{
    let {status = 404, message = "Something went Wrong"} = err;
    res.status(status).render('error.ejs', {message});
});

// Port Listening
app.listen(port, () =>{
    console.log('server is listening on port', port);
});

