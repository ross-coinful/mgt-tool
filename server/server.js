const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 8030;
const app = express();
// app.use(cors());
app.use(cors({
          credentials: true,
          origin: 'http://localhost:8080' // web前端服務器地址
          // origin: '*' // 這樣會出錯
        }));
app.use(bodyParser.json());

const DB_URL = 'mongodb://localhost:27017/db';
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: DB_URL })
}));

const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
    id: Number,
    name: String,
    service: String,
    maps: Array,
    token: String,
    avatar: String
}, {
    versionKey: false
});

const StoryMap = new Schema({
    id: Number,
    name: String,
    desc: String,
    cards: [{
      id: Number,
      title: String,
      detail: String,
      type: {type: String},
      prevId: Number,
      parentId: Number,
      releaseId: Number,
      labelId: Number,
      members: Array,
      comments: [{
        id: Number,
        userId: Number,
        body: String,
        time: Number
      }],
      issue: {
        owner: String,
        repo: String,
        number: Number
      }
    }],
    releases: [{
      id: Number,
      title: String,
      order: Number
    }]
}, {
    versionKey: false
});

// const Card = new Schema({
//     id: Number,
//     title: String,
//     detail: String,
//     type: String,
//     prevId: Number,
//     parentId: Number,
//     releaseId: Number,
//     labelId: Number,
//     members: Array,
//     comments: [{
//       id: Number,
//       userId: Number,
//       body: String,
//       time: Number
//     }],
//     issue: {
//       owner: String,
//       repo: String,
//       number: Number
//     }
// }, {
//     versionKey: false
// });

// const Release = new Schema({
//     id: Number,
//     title: String,
//     order: Number
// }, {
//     versionKey: false // remove _v field
// });

const StoryMapModel = mongoose.model('StoryMap', StoryMap);
const UserModel = mongoose.model('User', User);
// mongoose.model('StoryMap', StoryMap);
// mongoose.model('Card', Card);
// mongoose.model('Release', Release);
mongoose.connect(DB_URL, (err, db) => {

  if (err) {
    throw (err);
  }

  app.db = db;
});

// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  UserModel.findOne({ _id: id }).exec((err, user) => {
    done(err, user);
  });
});

const LocalStrategy = require('passport-local').Strategy;

passport.use('login', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'service',
    passReqToCallback: true
  }, function (req, username, password, done) {
    UserModel.findOne({id: username, service: password}).exec((err, user) => {

      if (err) {
        return done(null, false, { message: 'find account failed.' });
      } else if (user) {
        return done(null, user);
      } else {
        const user = {
          id: username,
          service: password
        };

        new UserModel(user).save((err, result) => {
          if (err) {
            return done(null, false, { message: 'create account failed.' });
          }
          return done(null, result);
        });
      }
    });
  }
));

function isAuthenticated (req, res, next) {

  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).end();
}

// routes
const auth = require('./auth');
const repo = require('./repo');
const user = require('./user');
const map = require('./map');
const card = require('./card');
const release = require('./release');
const issue = require('./issue');
const comment = require('./comment');
const image = require('./image');

app.param('mapId', function (req, res, next, mapId) {
  StoryMapModel.findOne({id: parseInt(mapId, 10)}).exec((err, map) => {
    if (err) return next(err);
    if (!map) return next(new Error('No map is found'));
    req.map = map;
    next();
  });
});

app.param('cardId', function (req, res, next, cardId) {
  const card = req.map.cards.find(card => card.id === parseInt(cardId, 10));
  if (!card) return next(new Error('No card is found'));
  req.card = card;
  next();
});

app.use('/auth', auth(passport, isAuthenticated));
app.use('/repo', repo(passport, isAuthenticated));
app.use('/user', user(passport, isAuthenticated));
app.use('/map', map(passport, isAuthenticated));
app.use('/map/:mapId/card', card(passport, isAuthenticated));
app.use('/map/:mapId/release', release(passport, isAuthenticated));
app.use('/map/:mapId/card/:cardId/issue', issue(passport, isAuthenticated));
app.use('/map/:mapId/card/:cardId/comment', comment(passport, isAuthenticated));
app.use('/map/:mapId/card/:cardId/image', image(passport, isAuthenticated));

app.listen(port, () => {
  console.log('==>Server is running on port %s', port);
});
