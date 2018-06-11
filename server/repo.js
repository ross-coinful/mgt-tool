const router = require('express').Router();
const axios = require('axios');
const { githubApi } = require('../data');

module.exports = function (passport, isAuthenticated) {
  router.get('/list', isAuthenticated, (req, res) => {
    // const query = `
    //   query {
    //     viewer {
    //       repositories(last: 100) {
    //          nodes {
    //             id,
    //             name
    //          }
    //       }
    //     }
    //   }
    // `;

    // fetch(`${githubApi}/graphql`, {
    //   method: 'POST',
    //   body: JSON.stringify({query}),
    //   headers: {
    //     Authorization: `Bearer ${req.user.token}`
    //   }
    // }).then(res => res.json()).then(body => {
    //   return res.status(200).json(body.data.viewer.repositories.nodes).end();
    // }).catch(error => {
    //   console.error(error);
    // });

    axios({
      method: 'get',
      url: `${githubApi}/user/repos`, // `${githubApi}/orgs/coinful-tech/repos`,
      // params: {type: 'member'},
      headers: {
        Authorization: `token ${req.user.token}`,
        Accept: 'application/vnd.github.nightshade-preview+json'
      }
    }).then((response) => {
      // console.log('get repos suc', response.data);
      return res.status(200).json(response.data).end();
    }, (error) => {
      return res.status(400).json(error.data).end();
    });
  });

  return router;
};
