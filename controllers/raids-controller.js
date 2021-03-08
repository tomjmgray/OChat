const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/createRaid/:guildId', (req, res) => {
    if (!req.session.currentUser.isAdmin?.includes(req.params.guildId)) {
        res.redirect(`/guilds/${req.params.guildId}`);
    }
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
    if (!req.session.currentUser.isAdmin?.includes(req.params.guildId)) {
        res.redirect(`/guilds/${req.params.guildId}`);
    }
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

router.get('/manageRaid/:raidId', (req, res) => {
    db.Raids.findById(req.params.raidId).populate([
        'guild', 'signedUp', 'tentative', 'bench', 'onTime', 'completed', 'staging'
        // 'dkpLogs'
    ]).exec((err, foundRaid) => {
        if (err) throw err;
        console.log('!!!!!!!!!!!!!!!!!!!!', !req.session.currentUser.isAdmin?.join('').includes(foundRaid.guild._id))
        if (!req.session.currentUser.isAdmin?.join('').includes(foundRaid.guild._id)) {
            res.redirect(`/guilds/${foundRaid.guild._id}`);
        } else {
            const context = {
                raid: foundRaid,
                user: req.session.currentUser
            };
            res.render('raids/manageRaid', context)
        }
    })
})

router.post('/addToStaging/:raidId', (req, res) => {
    db.Raids.findByIdAndUpdate(req.params.raidId, {
        $push: {staging: req.body.character}
    }, (err, updatedRaid) => {
        if (err) throw err;
        res.redirect(`/raids/manageRaid/${updatedRaid._id}`)
    })
})

router.post('/removeFromStaging/:raidId', (req, res) => {
    db.Raids.findByIdAndUpdate(req.params.raidId, {
        $pull: {staging: req.body.character}
    }, (err, updatedRaid) => {
        if (err) throw err;
        res.redirect(`/raids/manageRaid/${updatedRaid._id}`)
    })
})

router.get('/addSignedUpToStaging/:raidId', (req, res) => {
    db.Raids.findById(req.params.raidId, (err, foundRaid) => {
        if (err) throw err;
        db.Raids.findByIdAndUpdate(foundRaid._id, {
            $push: {staging: {$each: foundRaid.signedUp}}
        }, (err, updatedRaid) => {
            if (err) throw err;
            res.redirect(`/raids/manageRaid/${updatedRaid._id}`);
        })
    })
})

router.get('/addOnTimeToStaging/:raidId', (req, res) => {
    db.Raids.findById(req.params.raidId, (err, foundRaid) => {
        if (err) throw err;
        db.Raids.findByIdAndUpdate(foundRaid._id, {
            $push: {staging: {$each: foundRaid.onTime}}
        }, (err, updatedRaid) => {
            if (err) throw err;
            res.redirect(`/raids/manageRaid/${updatedRaid._id}`);
        })
    })
})

router.get('/clearStaging/:raidId', (req, res) => {
    db.Raids.findByIdAndUpdate(req.params.raidId, {
        $set: {staging: []}
    }, (err, updatedRaid) => {
        console.log(updatedRaid);
        if (err) throw err;
        res.redirect(`/raids/manageRaid/${updatedRaid._id}`)
    })
})

router.get('/markStagingOnTime/:raidId', (req, res) => {
    db.Raids.findById(req.params.raidId, (err, foundRaid) => {
        if (err) throw err;
        db.Raids.findByIdAndUpdate(req.params.raidId, {
            $push: {onTime: {$each: foundRaid.staging}}
        }, (err, updatedRaid) => {
            if (err) throw err;
            res.redirect(`/raids/manageRaid/${updatedRaid._id}`)
    })
})})

router.get('/markStagingCompleted/:raidId', (req, res) => {
    db.Raids.findById(req.params.raidId, (err, foundRaid) => {
        if (err) throw err;
        db.Raids.findByIdAndUpdate(req.params.raidId, {
            $push: {completed: {$each: foundRaid.staging}}
        }, (err, updatedRaid) => {
            if (err) throw err;
            res.redirect(`/raids/manageRaid/${updatedRaid._id}`)
        })
    })
})

module.exports = router;