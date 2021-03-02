const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    characters: [{
        type: Schema.Types.ObjectId,
        ref: 'Characters' 
    }],
    main: {type: Schema.Types.ObjectId, ref: 'Characters'},
    isAdmin: [{type: Schema.Types.ObjectId, ref: 'Guilds'}]
})

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;