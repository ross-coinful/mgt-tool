const express = require('express');
const { labelList } = require('./mockData');

const router = express.Router();

router.get('/list', (req, res) => {
  setTimeout(() => {
    return res.status(200).json(labelList).end();
  }, 500);
});

module.exports = router;
