const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 4000;
const db = require('./models');
const session = require('express-session');
const bcrypt = require('bcrypt');

const usersController = require('./controllers/users-controller.js')

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

app.use('/users', usersController)

app.get('/', (req, res) => {
    res.render('landing.ejs');
})

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 15, (err, hashPass) => {
        const newUser = {
            username: req.body.username,
            password: hashPass
        };
        db.Users.create(newUser, (err, createdUser) => {
            if (err) {
                console.log(err);
            };
            req.session.currentUser = createdUser;
            res.redirect('users/profile')
        })
    })
})

app.set('view engine', 'ejs');
app.listen(PORT, console.log(`Listening on ${PORT}`));