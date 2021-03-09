const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/newAnnouncement/:guildId', (req, res) => {
    if (!req.session.currentUser.isAdmin?.includes(req.params.guildId)) {
        res.redirect(`/guilds/${req.params.guildId}`);
    }
    db.Guilds.findById(req.params.guildId).populate(['members', 'guildMaster', 'officers', 'posts']).exec((err, foundGuild) => {
        if (err) throw err;
        const context = {
            user: req.session.currentUser,
            guild: foundGuild
        };
        res.render('posts/newPost', context);
    })
    
})

router.get('/deletePost/:postId', (req, res) => {
    db.Posts.findById(req.params.postId, (err, foundPost) => {
        if (err) throw err;
        if (!req.session.currentUser.main._id == foundPost.author) {
            res.redirect('/home')
        } else {
            db.Posts.findByIdAndDelete(foundPost._id, (err, deletedPost) => {
                if (err) throw err;
                if (deletedPost?.guild) {
                    db.Guilds.findByIdAndUpdate(deletedPost.guild, {
                        $pull: {posts: deletedPost._id}
                    }, (err, updatedGuild) => {
                        if (err) throw err;
                        res.redirect(`/guilds/${updatedGuild._id}`)
                    })
                } else {
                    res.redirect('/home');
                }
            })
        }
    })
})

router.get('/editPost/:postId', (req, res) => {
    db.Posts.findById(req.params.postId, (err, foundPost) => {
        if (err) throw err;
        if (!req.session.currentUser.main._id == foundPost.author) {
            res.redirect('/home')
        } else {
            const context = {
                user: req.session.currentUser,
                post: foundPost
            };
            res.render('posts/editPost', context);
        }
    })
})

router.post('/newPost/:guildId', (req, res) => {
    if (!req.session.currentUser.isAdmin?.includes(req.params.guildId)) {
        res.redirect(`/guilds/${req.params.guildId}`);
    }
    db.Posts.create(req.body, (err, createdPost) => {
        if (err) throw err;
        if (createdPost.guild) {
            db.Guilds.findByIdAndUpdate(createdPost.guild, {
                $push: {posts: createdPost._id}
            }, (err, updatedGuild) => {
                if (err) throw err;
                res.redirect(`/guilds/${updatedGuild._id}`)
            })
        } else {
            res.redirect('/home');
        }
    })
})

router.post('/editPost/:postId', (req, res) => {
    db.Posts.findByIdAndUpdate(req.params.postId, req.body,  (err, updatedPost) => {
        if (err) throw err;
        res.redirect(`/guilds/${updatedPost.guild}`)
    })
})

router.get('/postDetail/:postId', (req, res) => {
    db.Posts.findById(req.params.postId).populate(['author', {path: 'comments', populate: 
        {path: 'author', models: 'Characters'}}
    ]).exec((err, foundPost) => {
        if (err) throw err;
        const context = {
            post: foundPost,
            user: req.session.currentUser
        };
        res.render('posts/postDetail', context);
    })
})

router.post('/addComment', (req, res) => {
    db.Posts.create(req.body, (err, createdPost) => {
        if (err) throw err;
        db.Posts.findByIdAndUpdate(createdPost.commentOf, {
            $push: {comments: createdPost._id}
        }, (err, updatedPost) => {
            if (err) throw err
            res.redirect(`/posts/postDetail/${updatedPost._id}`)
        })
    })
})

module.exports = router