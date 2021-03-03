const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/join', (req, res) => {
    db.Guilds.find({}, (err, foundGuilds) => {
        if (err) throw err;
        const guilds = {
            guilds: foundGuilds
        };
        res.render('guilds/browseGuilds.ejs', guilds);
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
        db.Characters.findByIdAndUpdate(createdGuild.guildMaster, {guild: createdGuild, guildRank: 'Guild Master'}, (err, updatedCharacter) => {
            if (err) throw err;
            db.Users.findByIdAndUpdate(updatedCharacter.user, {$push: {isAdmin: createdGuild._id}}, (err, updatedUser) => {
                if (err) throw err;
                console.log(updatedUser.isAdmin);
                db.Realms.findByIdAndUpdate(createdGuild.realm, {$push: {guilds: createdGuild._id}}, (err, updatedRealm) => {
                    if (err) throw err;
                    console.log(updatedRealm);
                    res.redirect('/users/profile');
                })
            })
        })
    })
})

router.get('/manageGuild/:id', (req, res) => {
    if (req.session.currentUser.isAdmin?.toString() !== req.params.id) {
        res.redirect(`/guilds/${req.params.id}`);
    }
    db.Guilds.findById(req.params.id).populate(['members', 'guildMaster', 'officers', 'realm', 'joinRequests']).exec((err, foundGuild) => {
        if (err) throw err;
        context = {
            user: req.session.currentUser,
            guild: foundGuild
        }
        console.log(foundGuild);
        res.render('guilds/manageGuild.ejs', context);
    })
})

router.get('/:id', (req, res) => {
    db.Guilds.findById(req.params.id).populate(['members', 'guildMaster', 'officers', 'realm']
    ).exec((err, foundGuild) => {
        if (err) throw err;
        
        const context = {
            guild: foundGuild,
            user: req.session.currentUser
        }
        res.render('guilds/guildPage', context);
    })
})

router.get('/:id/joinRequest', (req, res) => {
    db.Guilds.findById(req.params.id).populate('guildMaster').exec((err, foundGuild) => {
        if (err) throw err;
        db.Users.findById(req.session.currentUser._id).populate('characters').exec((err, populatedUser) => {
            if (err) throw err;
            const context = {
                guild: foundGuild,
                user: populatedUser
            };
            res.render('guilds/joinGuildForm', context);
        })
    })
})

router.post('/:id/joinRequest', (req, res) => {
    console.log(req.body)
    db.Guilds.findByIdAndUpdate(req.params.id, {$push: {joinRequests: req.body.charId}}, (err, updatedGuild) => {
        if (err) throw err;
        console.log(updatedGuild.joinRequests);
        res.redirect(`/guilds/${req.params.id}`)
    });
    
})

router.post('/addMember', (req, res) => {
    if (req.body.isOfficer === 'on') {
        db.Guilds.findByIdAndUpdate(req.body.guildId, {
            $push: {
                officers: req.body.name
            },
            $pull: {
                joinRequests: req.body.name
            }
        }, (err, updatedGuild) => {
            if (err) throw err;
            db.Characters.findByIdAndUpdate(req.body.name, {
                    guild: req.body.guildId,
                    guildRank: 'Officer'
                }, (err, updatedCharacter) => {
                    if (err) throw err;
                    console.log(updatedCharacter)
                    res.redirect(`/guilds/manageGuild/${req.body.guildId}`)
            })
        })
    } else {
        db.Guilds.findByIdAndUpdate(req.body.guildId, {
            $push: {
                members: req.body.name
            },
            $pull: {
                joinRequests: req.body.name
            }
        }, (err, updatedGuild) => {
            if (err) throw err;
            db.Characters.findByIdAndUpdate(req.body.name, {
                guild: req.body.guildId,
                guildRank: 'Member'
            }, (err, updatedCharacter) => {
                if (err) throw err;
                console.log(updatedCharacter.guild)
                res.redirect(`/guilds/manageGuild/${req.body.guildId}`)
            })
        })
    }
});

router.post('declineJoinRequest', (req, res) => {
    db.Guilds.findByIdAndUpdate(req.body.guildId, {
        $pull: {
            joinRequests: req.body.userId
        }
    }, (err, updatedGuild) => {
        if (err) throw err;
        console.log(updatedGuild.officers)
        res.redirect(`/guilds/manageGuild/${req.body.guildId}`)
    })
})

module.exports = router;