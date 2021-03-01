const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 4000;
// const db = require('./models');
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
// app.listen(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000000000000
//     }
// }));

app.get('/', (req, res) => {
    res.render('landing.ejs');
})

app.set('view engine', 'ejs');
app.listen(PORT, console.log(`Listening on ${PORT}`));