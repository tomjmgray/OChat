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

module.exports = router;