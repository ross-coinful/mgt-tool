const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const axios = require('axios');

// const mongoose = require('mongoose');
// const Test = mongoose.model('Test');
// const Task = mongoose.model('Task');

// const { token, githubApi } = require('../data');

const port = 8030;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// mongodb
// require('../lib/db');

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
    detail: String,
    type: String,
    prevId: Number,
    parentId: Number,
    releaseId: Number,
    labelId: Number
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const Release = new Schema({
    id: Number,
    title: String,
    order: Number
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

// module.exports = mongoose.model('Messages', messagesSchema);

// mongoose.model('Test', Test);
// mongoose.model('Task', Task);
mongoose.model('Card', Card);
mongoose.model('Release', Release);
mongoose.connect('mongodb://localhost:27017/db', (err, db) => {

  if (err) {
    throw (err);
  }

  app.db = db;
});

// routes
const auth = require('./auth');
const card = require('./card');
const release = require('./release');
const label = require('./label');

app.use('/auth', auth);
app.use('/card', card);
app.use('/release', release);
app.use('/label', label);

// app.get('/test', (req, res) => {
//   new Test({
//     name: '123',
//     msg: '456',
//     time: 789
//   }).save((err) => {
//     if (err) {
//       console.log('Fail to save to DB.');
//       return;
//     }

//     console.log('Save to DB.');
//   });

//   setTimeout(() => {
//     return res.status(200).json(['test', 'and']).end();
//   }, 500);
// });

// app.get('/suggest', (req, res) => {
//   let data = [];

//   axios({
//     method: 'get',
//     url: `${githubApi}/milestones`
//   })
//   .then((response) => {
//     data = response.data;
//     return res.status(200).json(data[0].url).end();
//   }, (error) => {
//     data = 'error';
//     console.log('send error', error);
//     return res.status(400).json(data).end();
//   });

  // setTimeout(() => {
  //   return res.status(200).json(data).end();
  // }, 2000);
// });

// issue

        // url: `${githubApi}/issues`
// app.get('/issues', (req, res) => {
//   Task.find((err, tasks) => {

//     if (err) {
//       console.log('Fail to get from DB.');

//       return res.status(400).end();
//     }
    // console.log('get from DB.', tasks);

    // data = tasks.map((value) => {
    // })

  //   return res.status(200).json([]).end();
  // });

  // axios({
  //   method: 'get',
  //   url: `${githubApi}/issues`
  // })
  // .then((response) => {

  //   // data.number = response.data.number;
  //   // console.log('get response', response.data, number);

  //   new Task.find((err, tasks) => {

  //     if (err) {
  //       console.log('Fail to get from DB.');
  //       return;
  //     }
  //     console.log('get from DB.', tasks);
  //   });

  //   return res.status(200).end();
  // }, (error) => {
  //   console.log('get error', error);
  //   return res.status(400).end();
//   // });
// });

// app.post('/issues', (req, res) => {
//   const { title, body } = req.body;
//   const data = {
//     title,
//     body
//   };

//   axios({
//     method: 'post',
//     url: `${githubApi}/issues`,
//     headers: {
//       Authorization: `token ${token}`,
//       Accept: 'application/vnd.github.v3+json'
//     },
//     data
//   })
//   .then((response) => {

//     data.number = response.data.number;
//     // console.log('get response', response.data, number);

//     new Task(data).save((err) => {

//       if (err) {
//         console.log('Fail to save to DB.');
//         return;
//       }
//       console.log('Save to DB.');
//     });

//     return res.status(200).end();
//   }, (error) => {
//     console.log('get error', error);
//     return res.status(400).end();
//   });
// });

// app.post('/test/:id', (req, res) => {
//   setTimeout(() => {
//     console.log('test card', req.parameter, req.body);
//     return res.status(200).end();
//   }, 500);
// });

app.listen(port, () => {
  console.log('==>Server is running on port %s', port);
});
