const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/dkpForm/:guildId', (req, res) => {
    if (!req.session.currentUser.isAdmin?.includes(req.params.guildId)) {
        res.redirect(`/guilds/${req.params.guildId}`);
    }
    db.Guilds.findById(req.params.guildId).populate(['members', 'guildMaster', 'officers', 'dkpLogs']).exec((err, foundGuild) => {
        if (err) throw err;
        const context = {
            user: req.session.currentUser,
            guild: foundGuild
        }
        res.render('guilds/dkpForm.ejs', context);
    })
})

router.get('/standings/:id', (req, res) => {
    db.Guilds.findById(req.params.id).populate(['members', 'guildMaster', 'officers', 'realm', 'raids']
    ).exec((err, foundGuild) => {
        if (err) throw err;
        const gmArr = [foundGuild.guildMaster];
        const officersArr = gmArr.concat(foundGuild.officers);
        const membersArr = officersArr.concat(foundGuild.members);
        const sortedArr = membersArr.sort((a, b) => {
            return b.dkp - a.dkp
        })
        const context = {
            dkpStandings: sortedArr,
            guild: foundGuild,
            user: req.session.currentUser
        }
        
        res.render('guilds/dkpStandings', context);
    })
})

router.get('/dkpHistory/:guildId', (req, res) => {
    db.Guilds.findById(req.params.guildId).populate([
        {
            path: 'dkpLogs',
            populate: [
                {path: 'guild', model: 'Guilds'},
                {path: 'characters', models: 'Characters'},
                {path: 'assignedBy', models: 'Characters'},
                {path: 'raid', models: 'Raids'}
            ]
        }, 'members', 'guildMaster', 'officers'
    ]).exec((err, foundGuild) => {
        if (err) throw err;
        const context = {
            guild: foundGuild,
            user: req.session.currentUser
        }
        res.render('guilds/dkpHistory', context);
    })
})

router.post('/dkpForm/:guildId', (req, res) => {
    if (!req.session.currentUser.isAdmin?.includes(req.params.guildId)) {
        res.redirect(`/guilds/${req.params.guildId}`);
    }

    const formObj = {
        guild: req.params.guildId,
        assignedBy: req.session.currentUser.main?._id,
        raid: null,
        amount: req.body.amount,
        description: req.body.description,
        characters: []
    };

    if (req.body.characters === 'guild') {
        db.Guilds.findById(req.params.guildId, (err, foundGuild) => {
            if (err) throw err;
            formObj.characters.push(foundGuild.guildMaster);
            foundGuild.officers.forEach((officer) => {
                formObj.characters.push(officer);
            });
            foundGuild.members.forEach((member) => {
                formObj.characters.push(member);
            })
            db.DKPLogs.create(formObj, (err, createdLog) => {
                if (err) throw err;
                db.Guilds.findByIdAndUpdate(createdLog.guild, {
                    $push: {dkpLogs: createdLog._id}
                }, (err, updatedGuild) => {
                    if (err) throw err;
                    if (req.body.decay === 'on') {
                        const decayVar = (100 - createdLog.amount) * 0.01
                        createdLog.characters.forEach((char) => {
                            db.Characters.findByIdAndUpdate(char, {
                                $push: {dkpLogs: createdLog._id},
                                $mul: {dkp: decayVar}
                            }, (err, updatedCharacter) => {
                                if (err) throw err;
                            })
                        })
                    } else {
                        createdLog.characters.forEach((char) => {
                            db.Characters.findByIdAndUpdate(char, {
                                $push: {dkpLogs: createdLog._id},
                                $inc: {dkp: createdLog.amount}
                            }, (err, updatedCharacter) => {
                                if (err) throw err;
                            })
                        })
                    }
                    res.redirect(`/guilds/${updatedGuild._id}`);
                })
            })
        })
    } else {
        formObj.characters.push(req.body.characters);
        db.DKPLogs.create(formObj, (err, createdLog) => {
            if (err) throw err;
            db.Guilds.findByIdAndUpdate(createdLog.guild, {
                $push: {dkpLogs: createdLog._id}
            }, (err, updatedGuild) => {
                if (err) throw err;
                if (req.body.decay === 'on') {
                    const decayVar = (100 - createdLog.amount) * 0.01
                    createdLog.characters.forEach((char) => {
                        db.Characters.findByIdAndUpdate(char, {
                            $push: {dkpLogs: createdLog._id},
                            $mul: {dkp: decayVar}
                        }, (err, updatedCharacter) => {
                            if (err) throw err;
                        })
                    })
                } else {
                    createdLog.characters.forEach((char) => {
                        db.Characters.findByIdAndUpdate(char, {
                            $push: {dkpLogs: createdLog._id},
                            $inc: {dkp: createdLog.amount}
                        }, (err, updatedCharacter) => {
                            if (err) throw err;
                        })
                    })
                }
                res.redirect(`/guilds/${req.params.guildId}`);
            })
        })
    }
})


router.post('/newForm', (req, res) => {
    if (!req.session.currentUser.isAdmin?.includes(req.body.guild)) {
        res.redirect(`/guilds/${req.body.guild}`);
    }
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