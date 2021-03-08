const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/new', (req, res) => {
    db.Realms.find({}, (err, foundRealms) => {
        if (err) throw err;
        const sortedRealms = foundRealms.sort((a, b) => {
            const aname = a.name;
            const bname = b.name;
            let comparison = 0;
            if (aname > bname) {
                comparison = 1;
            } else if (bname > aname) {
                comparison = -1
            }
            return comparison
        })
        const context = {
            user: req.session.currentUser,
            realms: sortedRealms,
        }
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
        db.Realms.findByIdAndUpdate(createdCharacter.guild, {
            $push: {characters: createdCharacter._id}
        }, (err, updatedRealm) => {
            if (err) throw err;
            if (charObj.isMain) {
                db.Users.findByIdAndUpdate(req.body.user, {
                    $push: {characters: createdCharacter._id},
                    main: createdCharacter._id
                }, {upsert: true}, (err, updatedUser) => {
                    if (err) throw err;
                    // req.session.currentUser = updatedUser;
                    res.redirect('/users/profile')
                })
            } else {
                db.Users.findByIdAndUpdate(req.body.user, {$push: {characters: createdCharacter._id}}, (err, updatedUser) => {
                    if (err) throw err;
                    // req.session.reload((err) => {
                    //     req.session.currentUser = updatedUser;
                    // })
                    res.redirect('/users/profile')
                })
            }
            
        })
        
    })
})

router.get('/editCharacter/:id', (req, res) => {
    db.Characters.findById(req.params.id, (err, foundCharacter) => {
        if (err) throw err;
        db.Realms.find({}, (err, foundRealms) => {
            if (err) throw err;
            const sortedRealms = foundRealms.sort((a, b) => {
                const aname = a.name;
                const bname = b.name;
                let comparison = 0;
                if (aname > bname) {
                    comparison = 1;
                } else if (bname > aname) {
                    comparison = -1
                }
                return comparison
            })
            const context = {
                user: req.session.currentUser,
                character: foundCharacter,
                realms: sortedRealms
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
            // req.session.reload((err) => {
            //     req.session.currentUser = updatedUser;
            // })
            res.redirect(`/guilds/manageGuildRoster/${foundChar.guild}`);
        })
    })
})

router.get('/removeAdmin/:charId', (req, res) => {
    db.Characters.findById(req.params.charId, (err, foundChar) => {
        if (err) throw err;
        db.Users.findByIdAndUpdate(foundChar.user, {
            $pull: {isAdmin: foundChar.guild}
        }, (err, updatedUser) => {
            if (err) throw err;
            // req.session.reload((err) => {
            //     req.session.currentUser = updatedUser;
            // })
            res.redirect(`/guilds/manageGuildRoster/${foundChar.guild}`);
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
                res.redirect(`/guilds/manageGuildRoster/${updatedGuild._id}`);
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
                res.redirect(`/guilds/manageGuildRoster/${updatedGuild._id}`);
            })
        })
    })
})

router.get('/demoteCharacter/:charId', (req, res) => {
    db.Characters.findByIdAndUpdate(req.params.charId, {
        guildRank: 'Member'
    }, (err, updatedChar) => {
        if (err) throw err;
        db.Guilds.findByIdAndUpdate(updatedChar.guild, {
            $push: {members: updatedChar._id},
            $pull: {officers: updatedChar._id}
        }, (err, updatedGuild) => {
            if (err) throw err;
            res.redirect(`/guilds/manageGuildRoster/${updatedGuild._id}`)
        })
    })
})

router.get('/promoteCharacter/:charId', (req, res) => {
    db.Characters.findByIdAndUpdate(req.params.charId, {
        guildRank: 'Officer'
    }, (err, updatedChar) => {
        if (err) throw err;
        db.Guilds.findByIdAndUpdate(updatedChar.guild, {
            $pull: {members: updatedChar._id},
            $push: {officers: updatedChar._id}
        }, (err, updatedGuild) => {
            if (err) throw err;
            res.redirect(`/guilds/manageGuildRoster/${updatedGuild._id}`)
        })
    })
})

router.put('/editCharacter/:id', (req, res) => {
    const charObj = {
        name: req.body.name,
        spec: req.body.spec,
        level: req.body.level,
        realm: req.body.realm,
        isMain: false,
        user: req.session.currentUser._id
    }
    if (req.body.isMain === 'on') {
        charObj.isMain = true
    };
    db.Characters.findByIdAndUpdate(req.params.id, charObj, (err, updatedCharacter) => {
        if (err) throw err;
        console.log(updatedCharacter);
        if (updatedCharacter.isMain === true) {
            db.Users.findByIdAndUpdate(req.session.currentUser._id, {main: updatedCharacter._id}, {upsert: true}, (err, updatedUser) => {
                if (err) throw err;
                
                res.redirect('/users/profile');
            })
        } else {
           res.redirect('/users/profile'); 
        }
        
    })
})

router.get('/delete/:id', (req, res) => {
    db.Characters.findByIdAndDelete(req.params.id, (err, deletedCharacter) => {
        if (err) throw err;
        db.Realms.findByIdAndUpdate(deletedCharacter.guild, {
            $pull: {characters: deletedCharacter._id}
        }, (err, updatedRealm) => {
            if (err) throw err;
            db.Users.findByIdAndUpdate(req.session.currentUser._id, {
                $pull: {
                    characters: deletedCharacter._id
                },
            }, (err, updatedUser) => {
                if (err) throw err;
                // req.session.reload((err) => {
                //     req.session.currentUser = updatedUser;
                // })
                db.Guilds.findByIdAndUpdate(deletedCharacter.guild, {
                    $pull: {
                        officers: deletedCharacter._id,
                        members: deletedCharacter._id
                    }
                }, (err, updatedGuild) => {
                    if (err) throw err;
                    res.redirect('/users/profile');
                })
            })
        })
        
    })
})

router.get('/characterInfo/:charId', (req, res) => {
    db.Characters.findById(req.params.charId).populate([
        'guild', 'realm', 'dkpLogs', {path: 'user', populate: 'characters'}
    ]).exec((err, foundCharacter) => {
        const context = {
            character: foundCharacter,
            user: req.session.currentUser
        };
        res.render('characters/characterInfo', context)
    })
})

router.get('/dkpHistoryChar/:charId', (req, res) => {
    db.Characters.findById(req.params.charId).populate([
        'guild', 'realm', {
            path: 'dkpLogs',
            populate: [
                {path: 'guild', model: 'Guilds'},
                {path: 'characters', models: 'Characters'},
                {path: 'assignedBy', models: 'Characters'},
                {path: 'raid', models: 'Raids'}
            ]
        },
    ]).exec((err, foundChar) => {
        if (err) throw err;
        const context = {
            character: foundChar,
            user: req.session.currentUser
        };
        res.render('characters/dkpHistoryChar', context);
    })
})

module.exports = router;