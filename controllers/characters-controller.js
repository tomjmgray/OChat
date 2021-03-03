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

router.get('/editCharacter/:id', (req, res) => {
    db.Characters.findById(req.params.id, (err, foundCharacter) => {
        if (err) throw err;
        if (foundCharacter.user.toString() !== req.session.currentUser._id.toString()) {
            res.redirect('/');
        }
        db.Realms.find({}, (err, foundRealms) => {
            if (err) throw err;
            const context = {
                user: req.session.currentUser,
                character: foundCharacter,
                realms: foundRealms
            }
            res.render('characters/editCharacter.ejs', context);
        })
    })
})

router.get('/grantAdmin/:charId', (req, res) => {
    db.Characters.findById(req.params.charId, (err, foundChar) => {
        if (err) throw err;
        db.Users.findByIdAndUpdate(foundChar.user, {
            $push: {isAdmin: foundChar.guild}
        }, (err, updatedUser) => {
            if (err) throw err;
            console.log(updatedUser.isAdmin);
            res.redirect(`/guilds/manageGuild/${foundChar.guild}`);
        })
    })
})

router.get('/gkickOfficer/:charId', (req, res) => {
    db.Characters.findById(req.params.charId, (err, foundChar) => {
        if (err) throw err;
        db.Characters.findByIdAndUpdate(foundChar._id, {
            guild: null,
            guildRank: ''
        }, (err, updatedChar) => {
            if (err) throw err;
            console.log(updatedChar.guild);
            db.Guilds.findByIdAndUpdate(foundChar.guild, {
                $pull: {officers: foundChar._id}
            }, (err, updatedGuild) => {
                if (err) throw err;
                console.log(updatedGuild.officers);
                res.redirect(`/guilds/manageGuild/${updatedGuild._id}`);
            })
        })
    })
})

router.get('/gkickMember/:charId', (req, res) => {
    db.Characters.findById(req.params.charId, (err, foundChar) => {
        if (err) throw err;
        db.Characters.findByIdAndUpdate(foundChar._id, {
            guild: null,
            guildRank: ''
        }, (err, updatedChar) => {
            if (err) throw err;
            console.log(updatedChar.guild);
            db.Guilds.findByIdAndUpdate(foundChar.guild, {
                $pull: {members: foundChar._id}
            }, (err, updatedGuild) => {
                if (err) throw err;
                console.log(updatedGuild.members);
                res.redirect(`/guilds/manageGuild/${updatedGuild._id}`);
            })
        })
    })
})

router.put('/editCharacter/:id', (req, res) => {
    const charObj = {
        name: req.body.name,
        spec: req.body.spec,
        level: req.body.level,
        realm: req.body.realm,
        isMain: false
    }
    if (req.body.isMain === 'on') {
        charObj.isMain = true
    };
    db.Characters.findByIdAndUpdate(req.params.id, charObj, (err, updatedCharacter) => {
        if (err) throw err;
        console.log(updatedCharacter);
        res.redirect('/users/profile');
    })
})

module.exports = router;