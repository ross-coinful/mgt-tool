const router = require('express').Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function (passport, isAuthenticated) {
  router.get('/', isAuthenticated, (req, res, next) => {
    const { name } = req.user;

    // return res.status(200).json(req.user).end();
    return res.status(200).json({name}).end();
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
          avatar: user.avatar
        };
      });

      return res.status(200).json(_users).end();
    });
  });

  return router;
};
