

const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/ochat';
const configObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}

mongoose.connect(connectionString, configObject);

mongoose.connection.on('connected', () => {console.log('connected to mongo')});

module.exports = {
    Users: require('./Users'),
    Characters: require('./Characters'),
    Guilds: require('./Guilds'),
    Realms: require('./Realms'),
    Raids: require('./Raids'),
    DKPLogs: require('./DKPLogs'),
    Posts: require('./Posts')
}