const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterScema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    name: {type: String, required: true},
    class: {type: String, required: true},
    class: {type: String, required: true},
    spec: {type: String, required: true},
    dkp: {type: Number, default: 0},
    level: {type: Number, required: true},
    guild: {type: Schema.Types.ObjectId, ref: 'Guilds'}
});

const Characters = mongoose.model('Characters', characterScema);
module.exports = Characters;
