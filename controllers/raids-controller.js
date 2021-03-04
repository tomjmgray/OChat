const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/createRaid/:guildId', (req, res) => {
    db.Guilds.findById(req.params.guildId).populate(['members', 'guildMaster', 'officers']).exec((err, foundGuild) => {
        if (err) throw err;
        const context = {
            user: req.session.currentUser,
            guild: foundGuild
        };
        res.render('raids/createRaid', context);
    })
})

router.get('/detail/:raidId', (req, res) => {
    db.Raids.findById(req.params.raidId).populate([{
            path: 'guild', populate: [
                {path: 'members', model: 'Characters'},
                {path: 'officers', model: 'Characters'},
                {path: 'guildMaster', model: 'Characters'},
                // {path: 'dkpLogs', model: 'DKPLogs'},
            ]
        }, 'signedUp', 'bench', 'tentative'
    ]).exec((err, foundRaid) => {
        if (err) throw err;
        const context = {
            user: req.session.currentUser,
            raid: foundRaid
        };
        res.render('raids/raidDetail', context);
    })
})

router.post('/addSignup/:raidId', (req, res) => {
    if (req.body.tentative === 'on') {
        db.Raids.findByIdAndUpdate(req.params.raidId, {
            $push: {tentative: req.body.character}
        }, (err, updatedRaid) => {
            if (err) throw err;
            console.log('Updated Raid');
            res.redirect(`/raids/detail/${updatedRaid._id}`)
        })
    } else if (req.body.bench === 'on') {
        db.Raids.findByIdAndUpdate(req.params.raidId, {
            $push: {bench: req.body.character}
        }, (err, updatedRaid) => {
            if (err) throw err;
            console.log('Updated Raid');
            res.redirect(`/raids/detail/${updatedRaid._id}`)
        })
    } else {
        db.Raids.findByIdAndUpdate(req.params.raidId, {
            $push: {signedUp: req.body.character}
        }, (err, updatedRaid) => {
            if (err) throw err;
            console.log('Updated Raid');
            res.redirect(`/raids/detail/${updatedRaid._id}`)
        })
    }
})

router.post('/createRaid/:guildId', (req, res) => {
    db.Raids.create(req.body, (err, createdRaid) => {
        if (err) throw err;
        db.Guilds.findByIdAndUpdate(req.params.guildId, {
            $push: {raids: createdRaid._id}
        }, (err, updatedGuild) => {
            if (err) throw err;
            res.redirect(`/guilds/${updatedGuild._id}`);
        })
    })
})


module.exports = router;