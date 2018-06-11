const router = require('express').Router();
const axios = require('axios');
const { githubApi } = require('../data');

module.exports = function (passport, isAuthenticated) {
  router.post('/', isAuthenticated, (req, res, next) => {
    const { owner, repo, title, body } = req.body;

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

      req.card.issue = issue;
      req.map.save(error => {
        if (error) {
          return res.status(400).json(error).end();
        }
        return res.status(200).end();
      });
    }, (error) => {
      console.log('post issue failed', error);
      return res.status(400).end();
    });
  });
  return router;
};
