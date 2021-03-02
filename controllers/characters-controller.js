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
        console.log(context.user);
        res.render('characters/createCharacter.ejs', context);
    })
})

router.post('/new', (req, res) => {
    const charObj = {
        user: req.body.user,
        name: req.body.name,
        race: req.body.race,
        class: req.body.class,
        spec: req.body.spec,
        level: req.body.level,
        realm: req.body.realm,
        isMain: false
    }
    if (req.body.isMain === 'on') {
        charObj.isMain = true
    };
    db.Characters.create(charObj, (err, createdCharacter) => {
        if (err) throw err;
        db.Users.findByIdAndUpdate(req.body.user, {$push: {characters: createdCharacter._id}}, (err, updatedUser) => {
            if (err) throw err;
            res.redirect('/users/profile')
        })
    })
})

module.exports = router;