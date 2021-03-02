const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterScema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    isMain: {type: Boolean, default: false},
    name: {type: String, required: true},
    class: {type: String, required: true},
    race: {type: String, required: true},
    spec: {type: String, required: true},
    dkp: {type: Number, default: 0},
    level: {type: Number, required: true},
    guild: {type: Schema.Types.ObjectId, ref: 'Guilds'},
    guildRank: {type: String},
    realm: {type: Schema.Types.ObjectId, ref: 'Realms'},
});

const Characters = mongoose.model('Characters', characterScema);
module.exports = Characters;
