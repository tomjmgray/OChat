require('dotenv').config();

const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const flash = require('express-flash');

router.use(flash());

router.get('/profile', (req, res) => {
    const userId = req.session.currentUser?._id;
    db.Users.findById(userId).populate('characters').exec((err, foundUser) => {
        if (err) throw err;
        const context = {
            user: foundUser
        };
        res.render('user/userProfile.ejs', context);
    })
})

router.post('/login', (req, res) => {
    db.Users.findOne({username: {$eq: req.body.username}}, (err, foundUser) => {
        if (err) throw err;
        console.log(foundUser);
        if (!foundUser) {
            console.log('Improper login credentials, please try again');

            return res.redirect('/');
        }
        bcrypt.compare(req.body.password, foundUser?.password, (err, resolved) => {
            if (err) console.log(err);
            if (resolved) {
                console.log('Login Succesful'),
                req.session.currentUser = foundUser;
                res.redirect('/users/profile')
            } else {
                // alert('Improper login credentials, please try again');
                res.redirect('/');
            }
        })
    })
})

module.exports = router;