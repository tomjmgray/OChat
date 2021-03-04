require('dotenv').config();

const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const flash = require('express-flash');

router.use(flash());

router.get('/profile', (req, res) => {
    const userId = req.session.currentUser?._id;
    db.Users.findById(userId).populate([
        {path: 'main', populate: [
            {path: 'guild', model: 'Guilds'},
            {path: 'realm', model: 'Realms'}
        ]},
        {path: 'characters', populate: [
            {path: 'guild', model: 'Guilds'},
            {path: 'realm', model: 'Realms'}
        ]}
    ]
        
    ).exec((err, foundUser) => {
        if (err) throw err;
        req.session.reload((err) => {
            req.session.currentUser = foundUser;
        })
        const context = {
            user: foundUser
        };
        console.log(req.session.currentUser);
        res.render('user/userProfile.ejs', context);
    })
})

router.post('/login', (req, res) => {
    db.Users.findOne({username: {$eq: req.body.username}}).populate([
        {path: 'main', populate: [
            {path: 'guild', model: 'Guilds'},
            {path: 'realm', model: 'Realms'}
        ]},
        {path: 'characters', populate: [
            {path: 'guild', model: 'Guilds'},
            {path: 'realm', model: 'Realms'}
        ]}
    ]
    ).exec((err, foundUser) => {
        if (err) throw err;
        console.log(foundUser);
        if (!foundUser) {
            console.log('Improper login credentials, please try again');

            return res.redirect('/loginErr');
        }
        bcrypt.compare(req.body.password, foundUser?.password, (err, resolved) => {
            if (err) console.log(err);
            if (resolved) {
                console.log('Login Succesful'),
                req.session.currentUser = foundUser;
                console.log('**********', foundUser);
                console.log('!!!!!!!!!!!!', req.session.currentUser);
                res.redirect('/users/profile')
            } else {
                // alert('Improper login credentials, please try again');
                res.redirect('/loginErr');
            }
        })
    })
})



router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    })
})

module.exports = router;