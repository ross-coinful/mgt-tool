const express = require('express');
// import { exchangeAry, credentialsAry } from 'mockData/exchange';

const router = express.Router();

router.get('/list', (req, res) => {
  setTimeout(() => {
    const releaseList = [];

    for (let i = 0; i < 3; i++) {
      releaseList.push(
        `release-${i}`
      );
    }

    return res.status(200).json(['card']).end();
  }, 500);
});

module.exports = router;
