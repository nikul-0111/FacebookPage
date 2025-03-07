const express = require('express');
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

//----------------------------------------------------------------------------------------------





//------------------------------------------------ALL ROUTES----------------------------------------------------------------------


app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.render('start.ejs');
});

// GET ROUTES
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

// POST ROUTES
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email, password: password })
        .then(user => {
            if (user) {
                res.status(200).render('homepage.ejs', { email, password });
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
            res.status(201).render('login.ejs',);
        })
        .catch(err => {
            res.status(500).send('Error registering user');
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