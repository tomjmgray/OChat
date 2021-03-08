const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/join', (req, res) => {
    db.Guilds.find({}, (err, foundGuilds) => {
        if (err) throw err;
        const context = {
            user: req.session.currentUser,
            guilds: foundGuilds
        };
        res.render('guilds/browseGuilds.ejs', context);
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
            db.Users.findByIdAndUpdate(req.session.currentUser._id, {$push: {isAdmin: createdGuild._id}}, (err, updatedUser) => {
                if (err) throw err;
                // req.session.reload((err) => {
                //     req.session.currentUser = updatedUser;
                // })
                db.Realms.findByIdAndUpdate(createdGuild.realm, {$push: {guilds: createdGuild._id}}, (err, updatedRealm) => {
                    if (err) throw err;
                    console.log(updatedRealm);
                    res.redirect('/users/profile');
                })
            })
        })
    })
})

router.get('/manageGuildRoster/:id', (req, res) => {
    if (!req.session.currentUser.isAdmin?.includes(req.params.id)) {
        res.redirect(`/guilds/${req.params.id}`);
    }
    
    db.Guilds.findById(req.params.id).populate(['members', 'guildMaster', 'realm', 'joinRequests', {
        path: 'officers', populate: {
            path: 'user', model: 'Users',
        }
    }]).exec((err, foundGuild) => {
        if (err) throw err;
        context = {
            user: req.session.currentUser,
            guild: foundGuild
        }
        res.render('guilds/manageGuildRoster.ejs', context);
    })
})

router.get('/raidHistory/:guildId', (req, res) => {
    db.Guilds.findById(req.params.guildId).populate([
        'raids', 'guildMaster', 'officers', 'members', 'realm',    
    ]).exec((err, foundGuild) => {
        if (err) throw err;
        const sortedRaids = foundGuild.raids.sort((a, b) => {
            let da = new Date(a.date);
            let db = new Date(b.date);
            return db - da;
        })
        const context = {
            guild: foundGuild,
            user: req.session.currentUser,
            raids: sortedRaids
        }
        res.render('guilds/raidHistory', context);
    })
})

router.get('/:id', (req, res) => {
    db.Guilds.findById(req.params.id).populate(['members', 'guildMaster', 'officers', 'realm', 'raids', {path: 'posts', populate: [
        {path: 'author', models: 'Characters'},
        {path: 'comments', models: 'Posts'}
    ]}]
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
        
        res.render('guilds/guildPage', context);
    })
})

router.get('/joinRequest/:id', (req, res) => {
    db.Guilds.findById(req.params.id).populate(['guildMaster', 'joinRequests']).exec((err, foundGuild) => {
        if (err) throw err;
        db.Users.findById(req.session.currentUser._id).populate([
            {path: 'main', populate: [
                {path: 'guild', model: 'Guilds'},
                {path: 'realm', model: 'Realms'}
            ]},
            {path: 'characters', populate: [
                {path: 'guild', model: 'Guilds'},
                {path: 'realm', model: 'Realms'}
            ]}
        ]).exec((err, populatedUser) => {
            if (err) throw err;
            const context = {
                guild: foundGuild,
                user: populatedUser
            };
            res.render('guilds/joinGuildForm', context);
        })
    })
})

router.post('/joinRequest/:id', (req, res) => {
    console.log(req.body)
    db.Guilds.findByIdAndUpdate(req.params.id, {$push: {joinRequests: req.body.charId}}, (err, updatedGuild) => {
        if (err) throw err;
        res.redirect(`/users/profile`)
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
                    res.redirect(`/guilds/manageGuildRoster/${req.body.guildId}`)
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
                res.redirect(`/guilds/manageGuildRoster/${req.body.guildId}`)
            })
        })
    }
});

router.post('/declineJoinRequest', (req, res) => {
    db.Guilds.findByIdAndUpdate(req.body.guildId, {
        $pull: {
            joinRequests: req.body.userId
        }
    }, (err, updatedGuild) => {
        if (err) throw err;
        console.log(updatedGuild.officers)
        res.redirect(`/guilds/manageGuildRoster/${req.body.guildId}`)
    })
})

module.exports = router;