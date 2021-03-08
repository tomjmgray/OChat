const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postsSchema = new Schema({
    title: {type: String},
    message: {type: String},
    guild: {type: Schema.Types.ObjectId, ref: 'Guilds'},
    author: {type: Schema.Types.ObjectId, ref: 'Characters'},
    commentOf: {type: Schema.Types.ObjectId, ref: 'Posts'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Posts'}],
    postType: {type: String},
}, {timestamps: true});

const Posts = mongoose.model('Posts', postsSchema);
module.exports = Posts;