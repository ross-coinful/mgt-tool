const router = require('express').Router();

const mongoose = require('mongoose');
const StoryMap = mongoose.model('StoryMap');
const User = mongoose.model('User');
const Card = mongoose.model('Card');
const Release = mongoose.model('Release');

module.exports = function (passport) {
  // router.get('/list',
  //   passport.authenticate('local'));

  router.get('/list', (req, res) => {

    if (!req.isAuthenticated()) {
      return res.status(401).end();
    }

    console.log('req.user', req.user);
    User.findOne({ _id: req.user }, {'_id': false}).exec((err, user) => {
      if (err) {
        console.log('Get User: Fail.', err);
        return res.status(400).end();
      }
      console.log('user', user);
      StoryMap.find({_id: {$in: user.maps}}, {'_id': false}).exec((error, maps) => {
        if (error) {
          console.log('Get map list: Fail.', error);
          return res.status(400).end();
        }
        console.log('maps', maps);
        return res.status(200).json(maps).end();
      });
    });
  });

  router.get('/', (req, res) => {
    // console.log('req.isAuthenticated', req.isAuthenticated(), req.user);

    let data = {};
    const mapId = parseInt(req.query.id, 10);
    StoryMap.findOne({ id: mapId }).exec((err, story) => {
      if (err) {
        console.log('Get story: Fail.', err);
        return res.status(400).end();
      }

      data = story;
      console.log('Get story: Ok.');
      console.log('story', data);

      const findCard = new Promise((resolve, reject) => Card.find({_id: {$in: data.cards}}, {'_id': false}).exec((err, cards) => {
        if (err) {
          console.log('Get card list: Fail.', err);
          reject(err);
        }

        // console.log('Get card list: Ok.', cards);
        resolve(cards);
      }));

      const findRelease = new Promise((resolve, reject) => Release.find({_id: {$in: data.releases}}, {'_id': false}).exec((err, releases) => {
        if (err) {
          console.log('Get release list: Fail.', err);
          reject(err);
        }

        let maxOrder = 0;

        if (releases.length) {
          maxOrder = releases.reduce((max, v) => Math.max(max, v.order), releases[0].order);
        }

        releases.push({id: 0, title: 'Unscheduled', order: maxOrder + 1});
        resolve(releases);
      }));

      Promise.all([findCard, findRelease]).then(([cards, releases]) => {
        data.cards = cards;
        data.releases = releases;

        return res.status(200).json(data).end();
      }).catch((err) => {
        return res.status(400).json(err).end();
      });
    });
  });

  router.post('/', (req, res) => {
    StoryMap.find().exec((error, stories) => {
      console.log('stories', stories.length, error);
      const count = stories.length;
      let id = 0;

      if (count !== 0) {
        id = stories[count - 1].id + 1;
      }
      req.body.id = id;
      new StoryMap(req.body).save((err, map) => {
        if (err) {
          console.log('Create a new story: Fail to save to DB.', err);
          return res.status(400).end();
        }

        User.update({ _id: req.user }, { $push: { maps: map._id } }).exec((error, result) => {
          if (error) {
            console.log('Update User with map: Fail.', error);
            return res.status(400).end();
          }
          return res.status(200).json(id).end();
        });
      });
    });
  });

  return router;
};
