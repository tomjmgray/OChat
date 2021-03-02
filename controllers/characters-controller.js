const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/new', (req, res) => {
    db.Realms.find({}, (err, foundRealms) => {
        if (err) throw err;
        const context = {
            user: req.session.currentUser?._id,
            realms: foundRealms,
        }
    
        res.render('characters/createCharacter.ejs', context);
    })
})

router.post('/new', (req, res) => {
    db.Characters.create(req.body, (err, createdCharacter) => {
        if (err) throw err;
        db.Users.findByIdAndUpdate(req.body.user, {$push: {characters: createdCharacter._id}}, (err, updatedUser) => {
            if (err) throw err;
            res.redirect('/users/profile')
        })
    })
})

module.exports = router;