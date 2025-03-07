const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

const path = require("path");

//-----------------------------------MONGO DB CONNECT---------------------------------------
const userModel = require('./models/userModel');

//CONNECT TO MONGODB
const mongoose = require('mongoose');
function connectToDb() {
    mongoose.connect('mongodb+srv://nikul2004parmar:Dg6m9NHWj3WN67Fy@cluster0.kdfxj.mongodb.net/facebook').then(() => {
        console.log('connected to db')
    }).catch((e) => {
        console.log('error in db connection:', e)
    })
};

connectToDb();
//------------------------------------------------------------------------------------------

//----------------------------COMPULSORY IN ALL PROJECTS-----------------------------------------

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// To use EJS in JS File
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// CSS and JS files
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

//----------------------------------------------------------------------------------------------

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

//------------------------------------------------ALL ROUTES----------------------------------------------------------------------

app.get('/', (req, res) => {
    res.render('start.ejs');
});

// GET ROUTES
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.get('/home', isAuthenticated, (req, res) => {
    res.render('homepage.ejs', { email: req.session.user.email, password: req.session.user.password });
});

// POST ROUTES
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email, password: password })
        .then(user => {
            if (user) {
                req.session.user = user;
                res.status(200).redirect('/home');
            } else {
                res.status(401).send('Invalid email or password');
            }
        })
        .catch(err => {
            res.status(500).send('Error logging in');
        });
});

app.post('/register', (req, res) => {
    let { firstname, lastname, email, password } = req.body;
    userModel.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
    })
        .then(user => {
            req.session.user = user;
            res.status(201).redirect('/home');
        })
        .catch(err => {
            res.status(500).send('Error registering user');
        });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

//---------------------------------------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// When error will exist that time you can use this
app.get("*", (req, res) => {
    res.send("The error exists");
});