const mongoose = require('mongoose');
const { Schema } = mongoose;

const Test = new Schema({
    name: String,
    msg: String,
    time: Number
});

const Task = new Schema({
    title: String,
    body: String,
    number: Number
});

// module.exports = mongoose.model('Messages', messagesSchema);

mongoose.model('Test', Test);
mongoose.model('Task', Task);
mongoose.connect('mongodb://localhost:27017/db');
