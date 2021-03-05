const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dkpLogSchema = new Schema({
    characters: [{type: Schema.Types.ObjectId, ref: 'Characters', required: true}],
    guild: {type: Schema.Types.ObjectId, ref: 'Guilds', required: true},
    raid: {type: Schema.Types.ObjectId, ref: 'Raids'},
    assignedBy: {type: Schema.Types.ObjectId, ref: 'Characters', required: true},
    amount: {type: Number, required: true},
    description: {type: String, required: true}
})

const DKPLogs = mongoose.model('DKPLogs', dkpLogSchema);
module.exports = DKPLogs;