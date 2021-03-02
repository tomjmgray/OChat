const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildsSchema = new Schema({
    name: {type: String, required: true},
    members: [{type: Schema.Types.ObjectId, ref: 'Characters'}],
    guildMaster: {type: Schema.Types.ObjectId, ref: 'Characters'},
    officers: [{type: Schema.Types.ObjectId, ref: 'Characters'}],
    description: {type: String},
    realm: {type: Schema.Types.ObjectId, ref: 'Realms'}
})

const Guilds = mongoose.model('Guilds', guildsSchema);
module.exports = Guilds;