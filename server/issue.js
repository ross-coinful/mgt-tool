const router = require('express').Router();

const axios = require('axios');
const { githubApi } = require('../data');

const mongoose = require('mongoose');
const Card = mongoose.model('Card');

module.exports = function (passport, isAuthenticated) {
  router.post('/', isAuthenticated, (req, res, next) => {
    const { owner, repo, title, body, id } = req.body;

    axios({
      method: 'post',
      url: `${githubApi}/repos/${owner}/${repo}/issues`,
      headers: {
        Authorization: `token ${req.user.token}`,
        Accept: 'application/vnd.github.symmetra-preview+json'
      },
      data: {
        title,
        body
      }
    }).then((response) => {
      const issue = {
        owner,
        repo,
        number: response.data.number
      };

      Card.update({id: id}, {$set: {issue}}).exec((err, result) => {
        if (err) {
          return res.status(400).json(err).end();
        }

        return res.status(200).json(issue).end();
      });
    }, (error) => {
      console.log('post issue failed', error);
      return res.status(400).end();
    });
  });

  return router;
};
