const mongoose = require('mongoose');
const { Schema } = mongoose;
// const Test = new Schema({
//     name: String,
//     msg: String,
//     time: Number
// });

// const Task = new Schema({
//     title: String,
//     body: String,
//     number: Number
// });

const Card = new Schema({
    id: Number,
    title: String,
    type: String,
    prevId: Number,
    parentId: Number,
    releaseId: Number,
    labelId: Number
});

// module.exports = mongoose.model('Messages', messagesSchema);

// mongoose.model('Test', Test);
// mongoose.model('Task', Task);
mongoose.model('Card', Card);
mongoose.connect('mongodb://localhost:27017/db');
