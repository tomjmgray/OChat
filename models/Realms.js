const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const realmSchema = new Schema({
    name: {type: String, required: true},
    guilds: [{type: Schema.Types.ObjectId, ref: 'Guilds'}],
    characters: [{type: Schema.Types.ObjectId, ref: 'Characters'}],
    type: {type: String, required: true},
    location: {type: String, required: true}
})

const Realms = mongoose.model('Realms', realmSchema)
module.exports = Realms;