const express = require('express');
const { releaseList, defaultRelease } = require('./mockData');

const router = express.Router();

router.get('/list', (req, res) => {
  setTimeout(() => {
    return res.status(200).json(releaseList).end();
  }, 500);
});

module.exports = router;
