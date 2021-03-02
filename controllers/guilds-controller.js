const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/join', (req, res) => {
    db.Guilds.find({}, (err, foundGuilds) => {
        if (err) throw err;
        const guilds = {
            guilds: foundGuilds
        };
        res.render('guilds/joinGuild.ejs', guilds);
    })
})

router.get('/createGuild', (req, res) => {
    db.Realms.find({}, (err, foundRealms) => {
        if (err) throw err
        db.Users.findById(req.session.currentUser._id).populate('characters').exec((err, populatedUser) => {
            context = {
                user: populatedUser,
                realms: foundRealms
            };
            res.render('guilds/createGuild', context);
        })
        
    })
})

router.post('/createGuild', (req, res) => {
    db.Guilds.create(req.body, (err, createdGuild) => {
        if (err) throw err;
        console.log(createdGuild);
        db.Characters.findByIdAndUpdate(createdGuild.guildMaster, {guild: createdGuild, guildRank: 'Guild Master'}, (err, updatedUser) => {
            db.Realms.findByIdAndUpdate(createdGuild.realm, {$push: {guilds: createdGuild._id}}, (err, updatedRealm) => {
                if (err) throw err;
                console.log(updatedRealm);
                res.redirect('/users/profile');
            })
        })
    })
})

router.get('/:id', (req, res) => {
    db.Guilds.findById(req.params.id).populate(['members', 'guildMaster', 'officers', 'realm']
    ).exec((err, foundGuild) => {
        if (err) throw err;
        console.log(foundGuild);
        const context = {
            guild: foundGuild
        }
        res.render('guilds/guildPage', context);
    })
})

module.exports = router;