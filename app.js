require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const app = express()


app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] })
const User = new mongoose.model("Users", userSchema)


app.route("/")
    .get((req, res) => {
        res.render("home")
    })



app.route("/login")
    .get((req, res) => {
        res.render("login")
    })
    .post((req, res) => {
        const username = req.body.username
        const password = req.body.password
        User.findOne({ email: username }).then((foundUser) => {
            // if (foundUser.password===password) {
            //     res.render("secrets")

            // }
            console.log(foundUser);


        }).catch((err) => {
            console.log(err);
        })

    })
app.route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })
        newUser.save().then(() => {
            res.render("secrets")
        })
            .catch((err) => {
                console.log(err);
            })
    })



app.listen(3000, () => {
    console.log("server running on port 3000");
})

