const router = require('express').Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

const axios = require('axios');
const { clientId, clientSecret, state, githubApi } = require('../data');

module.exports = function (passport, isAuthenticated) {
  router.get('/token/:code', (req, res, next) => {

    axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        client_id: clientId,
        client_secret: clientSecret,
        code: req.params.code,
        state: state
      }
    }).then((response) => {
      const token = response.data.access_token;

      axios({
        method: 'get',
        url: `${githubApi}/user`,
        params: {
          access_token: token
        }
      })
      .then((response) => {
        const { data: { id, login, avatar_url: avatar } } = response;

        console.log('get user response', response);
        passport.authenticate('login', function (err, user, info) {

          if (err) {
            return res.status(400).json(err).end();
          }

          if (!user) {
            return res.status(400).json(info).end();
          }

          req.login(user, function (err2) {
            if (err2) {
              return next(err2);
            }

            User.findOneAndUpdate({ _id: req.user._id }, { name: login, avatar, token }).exec((err3, result) => {
              if (err3) {
                return res.status(400).json(err3).end();
              }
              const { name } = result;

              return res.status(200).json({name}).end();
            });
          });
        })({body: {id, service: 'github'}}, res, next);

      }, (err4) => {
        return res.status(400).json(err4).end();
      });
    }, (error) => {
      return res.status(400).json(error).end();
    });
  });

  router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    return res.status(200).end();
  });
  return router;
};
