const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/new', (req, res) => {
    const userId = {
        user: req.session.currentUser?._id
    }
    res.render('createCharacter.ejs', userId);
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