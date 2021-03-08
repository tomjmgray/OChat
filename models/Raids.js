const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const raidSchema = new Schema({
    date: {type: Date, required: true},
    guild: {type: Schema.Types.ObjectId, ref: 'Guilds'},
    lootStructure: {type: String},
    signedUp: [{type: Schema.Types.ObjectId, ref: 'Characters', unique: true, dropDups: true}],
    tentative: [{type: Schema.Types.ObjectId, ref: 'Characters', unique: true, dropDups: true}],
    bench: [{type: Schema.Types.ObjectId, ref: 'Characters', unique: true, dropDups: true}],
    onTime: [{type: Schema.Types.ObjectId, ref: 'Characters', unique: true, dropDups: true}],
    completed: [{type: Schema.Types.ObjectId, ref: 'Characters', unique: true, dropDups: true}],
    dkpLogs: [{type: Schema.Types.ObjectId, ref: 'DKPLogs'}],
    location: {type: String, required: true},
    raidSize: {type: Number},
    staging: [{type: Schema.Types.ObjectId, ref: 'Characters', unique: true, dropDups: true}],
})

const Raids = mongoose.model('Raids', raidSchema);
module.exports = Raids;