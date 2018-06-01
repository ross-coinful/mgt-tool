const router = require('express').Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function (passport, isAuthenticated) {
  router.get('/', isAuthenticated, (req, res, next) => {
    return res.status(200).json(req.user).end();
  });

  router.get('/list', isAuthenticated, (req, res) => {
    User.find({}).exec((error, users) => {

      if (error) {
        return res.status(400).json(error).end();
      }

      const _users = users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          maps: user.maps
        };
      });

      return res.status(200).json(_users).end();
    });
  });

  router.patch('/map', isAuthenticated, (req, res) => {
    User.update({ id: req.body.userId }, { $addToSet: { maps: mongoose.Types.ObjectId(req.body.mapId) } }).exec((err, result) => {
      if (err) {
        return res.status(400).json(err).end();
      }
      return res.status(200).end();
    });
  });

  router.delete('/map', isAuthenticated, (req, res) => {
    User.update({ id: req.body.userId }, { $pull: { maps: mongoose.Types.ObjectId(req.body.mapId) } }).exec((err, result) => {
      if (err) {
        return res.status(400).json(err).end();
      }
      return res.status(200).end();
    });
  });

  return router;
};
