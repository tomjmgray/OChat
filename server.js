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

app.use(express.static('public'));
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

app.get('/', (req, res) => {
    res.render('landing.ejs');
})

app.get('/loginErr', (req, res) => {
    res.render('landingErr.ejs')
})

app.get('/home', (req, res) => {
    const userId = req.session.currentUser?._id;
    db.Users.findById(userId).populate(
        {path: 'characters', populate: [
            {path: 'guild', model: 'Guilds'},
            {path: 'realm', model: 'Realms'}
        ]}
    ).exec((err, foundUser) => {
        if (err) throw err;
        const guilds = [];
        foundUser.characters.forEach((char) => {
            if (char.guild && !guilds.includes(char.guild)) {
                guilds.push(char.guild);
            }
        })
        const context = {
            guilds: guilds,
            user: foundUser
        };
        res.render('home.ejs', context);
    })
})

app.post('/register', (req, res) => {
    db.Users.find({username: req.body.username}, (err, foundUser) => {
        if (err) throw err;
        console.log(foundUser);
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