const router = require('express').Router();
const mongoose = require('mongoose');
const StoryMap = mongoose.model('StoryMap');
const User = mongoose.model('User');

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
    const { mapId } = req.params;

    StoryMap.findOne({ id: parseInt(mapId, 10) }).exec((err, story) => {

      if (err) {
        return res.status(400).json(err).end();
      }

      if (req.user.maps.indexOf(story._id) === -1) {
        return res.status(403).end();
      }
      return res.status(200).json(story).end();
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
      req.body.releases = [{id: 0, title: 'Unscheduled', order: 999}];

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
