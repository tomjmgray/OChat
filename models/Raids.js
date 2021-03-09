const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const raidSchema = new Schema({
    date: {type: Date, required: true},
    guild: {type: Schema.Types.ObjectId, ref: 'Guilds'},
    lootStructure: {type: String},
    signedUp: [{type: Schema.Types.ObjectId, ref: 'Characters', }],
    tentative: [{type: Schema.Types.ObjectId, ref: 'Characters', }],
    bench: [{type: Schema.Types.ObjectId, ref: 'Characters', }],
    onTime: [{type: Schema.Types.ObjectId, ref: 'Characters', }],
    completed: [{type: Schema.Types.ObjectId, ref: 'Characters', }],
    dkpLogs: [{type: Schema.Types.ObjectId, ref: 'DKPLogs', }],
    location: {type: String, required: true},
    raidSize: {type: Number},
    staging: [{type: Schema.Types.ObjectId, ref: 'Characters', }],
})

const Raids = mongoose.model('Raids', raidSchema);
module.exports = Raids;