const express = require('express');
const axios = require('axios');
const { clientId, clientSecret, state } = require('../data');

const router = express.Router();

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
    res.status(200).json(response.data.access_token).end();
  }, (error) => {
    res.status(400).json(error).end();
  });
});

module.exports = router;
