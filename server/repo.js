const router = require('express').Router();
// const axios = require('axios');
const { githubApi } = require('../data');
const fetch = require('node-fetch');
// const mongoose = require('mongoose');
// const StoryMap = mongoose.model('StoryMap');
// const User = mongoose.model('User');
// const Card = mongoose.model('Card');
// const Release = mongoose.model('Release');

module.exports = function (passport, isAuthenticated) {
  router.get('/list', isAuthenticated, (req, res) => {
    // const query = `
    //   query {
    //     viewer {
    //       repositories(last: 100) {
    //         nodes {
    //           id
    //           name
    //         }
    //       }
    //     }
    //   }
    // `;

    const query = `
      query {
        __schema {
          types {
            name
            kind
            description
            fields {
              name
            }
          }
        }
      }
    `;

    console.log('getRepoList');

    fetch(`${githubApi}/graphql`, {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Authorization': `Bearer ${req.user.token}`
      }
    }).then(res => res.text())
      .then(body => {
        // console.log(body);
        // return res.status(200).json(body).end();
      }) // {"data":{"repository":{"issues":{"totalCount":247}}}}
      .catch(error => console.error(error));

    // axios({
    //   method: 'get',
    //   url: `${githubApi}/graphql`,
    //   headers: {
    //     Authorization: `bearer ${req.user.token}`
    //   },
    //   data: {
    //     query: JSON.stringify({query})
    //   }
    // })
    // .then((response) => {
    //   console.log('getRepoListSuc', response.data);
    //   return res.status(200).json(response.data).end();
    // }, (error) => {
    //   console.log('getRepoListErr', error);
    //   return res.status(400).json(error).end();
    // });
    // StoryMap.find({_id: {$in: req.user.maps}}, {'_id': false}).exec((error, maps) => {

    //   if (error) {
    //     return res.status(400).json(error).end();
    //   }
    //   return res.status(200).json(maps).end();
    // });
  });

  return router;
};
