require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 4000;
const db = require('./models');
const session = require('express-session');
const bcrypt = require('bcrypt');


const usersController = require('./controllers/users-controller.js');
const charactersController = require('./controllers/characters-controller.js');
const guildsController = require('./controllers/guilds-controller');
const raidsController = require('./controllers/raids-controller.js');
const dkpController = require('./controllers/dkp-controller.js')

app.use(express.static('./views/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000000000000
    }
}));

app.use('/users', usersController);
app.use('/characters', charactersController);
app.use('/guilds', guildsController);
app.use('/raids', raidsController);
app.use('/dkp', dkpController);

app.get('/', (req, res) => {
    res.render('landing.ejs');
})

app.get('/loginErr', (req, res) => {
    res.render('landingErr.ejs')
})

app.get('/home', (req, res) => {
    const user = req.session.currentUser;
    db.Guilds.findById(user.main?.guild).populate([
            'members',
            'guildMaster',
            'officers',
            'realm',
            'raids'
        ]
    ).exec((err, foundGuild) => {
        console.log(foundGuild);
        if (err) throw err;
        const context = {
            user: req.session.currentUser,
            guild: foundGuild
        }
        res.render('home.ejs', context);
    })
})

app.post('/register', (req, res) => {
    db.Users.find({username: req.body.username}, (err, foundUser) => {
        if (err) throw err;
        if (foundUser.length > 0) {
            return res.redirect('/loginErr');
        }
        bcrypt.hash(req.body.password, 15, (err, hashPass) => {
            const newUser = {
                username: req.body.username,
                password: hashPass
            };
            db.Users.create(newUser, (err, createdUser) => {
                if (err) {
                    console.log(err);
                };
                console.log('createdUser')
                req.session.currentUser = createdUser;
                res.redirect('users/profile')
            })
        })
    })
    
})

app.set('view engine', 'ejs');
app.listen(PORT, console.log(`Listening on ${PORT}`));