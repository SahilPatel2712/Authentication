require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const bcrypt = require('bcrypt');
const saltRound = 10

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
         bcrypt.compare(password,foundUser.password,(err,result)=>{
           if (result===true) {
            res.render("secrets")
           }
                
         })
            


        }).catch((err) => {
            console.log(err);
        })

    })
app.route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post((req, res) => {

        bcrypt.hash(req.body.password, saltRound, (err, hash) => {
            const newUser = new User({
                email: req.body.username,
                password: hash
            })
            newUser.save().then(() => {
                res.render("secrets")
            })
                .catch((err) => {
                    console.log(err);
                })

        })

    })



app.listen(3000, () => {
    console.log("server running on port 3000");
})

