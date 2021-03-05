const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/newForm', (req, res) => {
    const form = {
        guild: req.body.guild,
        assignedBy: req.body.assignedBy,
        amount: req.body.amount,
        description: req.body.description
    }
    if (req.body?.raid?.length > 0) {
        db.Raids.findById(req.body.raid).populate([
            'signedUp', 'tentative', 'bench', 'onTime', 'completed', 'staging'
        ]).exec((err, foundRaid) => {
            if (err) throw err;
            form.raid = foundRaid._id
            if (req.body.characters === 'Bench') {
                form.characters = foundRaid.bench;
            } else if (req.body.characters === 'Completed') {
                form.characters = foundRaid.completed;
            } else if (req.body.characters === 'onTime') {
                form.characters = foundRaid.onTime;
            } else if (req.body.characters === 'signedUp') {
                form.characters = foundRaid.signedUp;
            } else if (req.body.characters === 'tentative') {
                form.characters = foundRaid.tentative;
            } else {
                form.characters = foundRaid.staging;
            };

            db.DKPLogs.create(form, (err, createdLog) => {
                if (err) throw err;
                db.Guilds.findByIdAndUpdate(createdLog.guild, {
                    $push: {dkpLogs: createdLog._id}
                }, (err, updatedGuild) => {
                    if (err) throw err;
                    db.Raids.findByIdAndUpdate(createdLog.raid, {
                        $push: {dkpLogs: createdLog._id}
                    }, (err, updatedRaid) => {
                        if (err) throw err;
                        createdLog.characters.forEach((char) => {
                            db.Characters.findByIdAndUpdate(char, {
                                $push: {dkpLogs: createdLog._id},
                                $inc: {dkp: createdLog.amount}
                            }, (err, updatedCharacter) => {
                                if (err) throw err;
                            })
                        })
                        res.redirect(`/raids/manageRaid/${updatedRaid._id}`);
                    })
                })
            })
        })
    }
})

module.exports = router;