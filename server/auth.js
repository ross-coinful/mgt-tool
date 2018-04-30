const express = require('express');
const router = express.Router();

// const mongoose = require('mongoose');
// const User = mongoose.model('User');

const axios = require('axios');
const { clientId, clientSecret, state, githubApi } = require('../data');

module.exports = function (passport) {
  router.get('/token/:code', (req, res) => {

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
      return res.status(200).json(response.data.access_token).end();
    }, (error) => {
      return res.status(400).json(error).end();
    });
  });

  router.get('/user', (req, res, next) => {
    // passport.authenticate('local');
    axios({
      method: 'get',
      url: `${githubApi}/user`,
      params: {
        access_token: req.query.token
      }
    })
    .then((response) => {
      console.log('response', response.data);
      passport.authenticate('login', function (err, user, info) {
        // console.log('in passport', err, user, info);

        if (err) {
          return res.status(400).json(err).end();
        }

        if (!user) {
          return res.status(400).json(info).end();
        }

        req.login(user, function (error) {
          if (error) {
            return next(error);
          }
          return res.status(200).json(user).end();
        });
      })({body: {username: response.data.id, password: 'github', name: response.data.login}}, res, next);

    }, (error) => {
      console.log('get user error', error);
      return res.status(400).end();
    });
  });

  return router;
};
