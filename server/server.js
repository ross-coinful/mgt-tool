const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 8030;
const app = express();
// app.use(cors());
app.use(cors({
          credentials: true,
          origin: 'http://localhost:8080' // web前端服务器地址
          // origin: '*' // 这样会出错
        }));
app.use(bodyParser.json());

const DB_URL = 'mongodb://localhost:27017/db';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
    src: String,
    maps: Array
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const StoryMap = new Schema({
    id: Number,
    name: String,
    desc: String,
    cards: Array,
    releases: Array
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

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

const UserModel = mongoose.model('User', User);
mongoose.model('StoryMap', StoryMap);
mongoose.model('Card', Card);
mongoose.model('Release', Release);
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
  console.log('serializeUser', user._id);
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  console.log('deserial', id);
  done(null, id);
});

passport.use('login', new LocalStrategy({
    passReqToCallback: true
  }, function (req, username, password, done) {
    console.log('you are heheehehheere', username, password);
    UserModel.findOne({id: username, src: password}).exec((err, user) => {

      console.log('findOne', err, user);

      if (err) {
        console.log('1111', err);
        return done(null, false, { message: '用户名不存在.' });
      } else if (user) {
        console.log('get user suc', user);
        return done(null, user);
      } else {
        const user = {
          id: username,
          src: password,
          name: req.body.name
        };

        new UserModel(user).save((err, result) => {
          if (err) {
            console.log('Create a new user: Fail to save to DB.', err);
            return done(null, false, { message: 'create failed.' });
          }
          return done(null, result);
        });
      }
    });
  }
));

function authenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).end();
}

// routes
const auth = require('./auth');
const card = require('./card');
const release = require('./release');
const map = require('./map');

app.use('/auth', auth(passport, authenticated));
app.use('/card', card);
app.use('/release', release);
app.use('/map', map(passport, authenticated));

app.listen(port, () => {
  console.log('==>Server is running on port %s', port);
});
