const router = require('express').Router();

const mongoose = require('mongoose');
const StoryMap = mongoose.model('StoryMap');
const User = mongoose.model('User');
// const Card = mongoose.model('Card');
// const Release = mongoose.model('Release');

module.exports = function (passport, isAuthenticated) {
  router.get('/list', isAuthenticated, (req, res) => {
    StoryMap.find({_id: {$in: req.user.maps}}, {'_id': false}).exec((error, maps) => {

      if (error) {
        return res.status(400).json(error).end();
      }

      return res.status(200).json(maps).end();
    });
  });

  router.get('/:mapId', isAuthenticated, (req, res) => {
    // let data = {};
    const { mapId } = req.params;
    // console.log('req', req, req.map);
    // const mapId = parseInt(req.params.mapId, 10);
    StoryMap.findOne({ id: mapId }).exec((err, story) => {

      if (err) {
        return res.status(400).json(err).end();
      }

      if (req.user.maps.indexOf(story._id) === -1) {
        return res.status(403).end();
      }

      // data = story;

      // const findCard = new Promise((resolve, reject) => Card.find({_id: {$in: data.cards}}, {'_id': false}).exec((err, cards) => {

      //   if (err) {
      //     reject(err);
      //   }
      //   resolve(cards);
      // }));

      // const findRelease = new Promise((resolve, reject) => Release.find({_id: {$in: data.releases}}, {'_id': false}).exec((err, releases) => {

      //   if (err) {
      //     reject(err);
      //   }
      //   let maxOrder = 0;

      //   if (releases.length) {
      //     maxOrder = releases.reduce((max, v) => Math.max(max, v.order), releases[0].order);
      //   }
      //   releases.push({id: 0, title: 'Unscheduled', order: maxOrder + 1});
      //   resolve(releases);
      // }));

      // Promise.all([findCard, findRelease]).then(([cards, releases]) => {
      //   story.cards = cards;
      //   story.releases = releases;

      //   story.save((error) => {
      //     if (error) {
      //       return res.status(400).json(error).end();
      //     }
      //     return res.status(200).json(story).end();
      //   });

      return res.status(200).json(story).end();
      // }).catch((err) => {
      //   return res.status(400).json(err).end();
      // });
    });
  });

  router.post('/', isAuthenticated, (req, res) => {
    StoryMap.find().exec((error, stories) => {
      const count = stories.length;
      const id = count === 0 ? 0 : stories[count - 1].id + 1;

      if (error) {
        return res.status(400).json(error).end();
      }
      req.body.id = id;
      // req.body.cards = [{id: 0, title: 'First-Card', type: 'activity'}];
      req.body.releases = [{id: 0, title: 'Unscheduled', order: 0}];

      new StoryMap(req.body).save((err, map) => {
        if (err) {
          return res.status(400).json(err).end();
        }

        User.update({ _id: req.user._id }, { $push: { maps: map._id } }).exec((error2, result) => {
          if (error2) {
            return res.status(400).json(error2).end();
          }
          return res.status(200).json(id).end();
        });
      });
    });
  });

  return router;
};
