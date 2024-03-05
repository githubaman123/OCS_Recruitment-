const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');  

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');


async function main() {
    await mongoose.connect('mongodb+srv://aamangupta439:yU2T3XNHAXfihs8j@cluster0.gixb0km.mongodb.net/?retryWrites=true&w=majority');
}

main().then(()=>{console.log("connected to database")})
.catch(err => console.log(err));

// Define the user schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, enum: ['client', 'admin'], default: 'client' } // Add a role field with default value 'client'
  });

// Use passport-local-mongoose plugin
UserSchema.plugin(passportLocalMongoose);

// Create User model
const User = mongoose.model('User', UserSchema);

// Set up session management
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up Express middleware
app.use(require('express-session')({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.urlencoded({ extended: true }));
  





app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', (req, res) => {
    res.render('signIn.ejs');
});

// Sign Up Route
app.get('/signup', (req, res) => {
    res.render('signup'); // You need to create a signup.ejs or any other template file
});
  
app.post('/signup', (req, res) => {
    const { username, password, role } = req.body;
  
    // Use User.register() for user registration
    User.register(new User({ username, role }), password, (err, user) => {
      if (err) {
        console.error(err);
        return res.render('signup'); 
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect("/");
      });
    });
  });
  
// app.post("/login",(req,res)=>{
//     res.send("done");
// })

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}));
  
app.get('/dashboard', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            if (req.user.role === 'admin') {
                // For admin, fetch all users
                const data = await User.find({}).exec();
                res.render("info", { data });
            } else {
                // For clients, fetch their own data
                const data = await User.find({ username: req.user.username }).exec();
                res.render("info", { data });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});

  


  

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
