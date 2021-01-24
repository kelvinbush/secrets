require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('*/css', express.static('public/css'));

mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true, useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(err => {
        if (err) console.log(err);
        else res.render("secrets");
    });
})

app.post("/login", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;


    User.findOne({email: userName}, (err, user) => {
        if (err) console.log(err);
        else {
            if (user) {
                if (user.password === password) {
                    res.render("secrets");
                }
            }
        }
    })
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});