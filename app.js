require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express()


app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({
    secret: "our little secret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("Users", userSchema)

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.route("/")
    .get((req, res) => {
        res.render("home")
    })

app.route("/secrets")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render("secrets")
        } else {
            res.redirect("/login")
        }
    })


app.route("/login")
    .get((req, res) => {
        res.render("login")
    })
    .post((req, res) => {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        })
        req.login(newUser, (err) => {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/secrets")
                })
            }
        })

    })
app.route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post((req, res) => {
        User.register({ username: req.body.username }, req.body.password).then((user) => {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets")
            })
        }).catch((err) => {
            console.log(err);
        })
    })

    app.route("/logout")
    .get((req,res)=>{
        req.logOut((err)=>{
            console.log(err);
        })
        res.redirect("/")
    })


app.listen(3000, () => {
    console.log("server running on port 3000");
})

