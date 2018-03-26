const express = require('express');
// import { exchangeAry, credentialsAry } from 'mockData/exchange';

const router = express.Router();
const { cardList } = require('./mockData');
let id = 100;

router.get('/list', (req, res) => {
  setTimeout(() => {
    return res.status(200).json(cardList).end();
  }, 500);
});

router.post('/', (req, res) => {
  setTimeout(() => {
    id++;
    return res.status(200).json(id).end();
  }, 500);
});

router.patch('/:id', (req, res) => {
  setTimeout(() => {
    const { id } = req.params;

    console.log('patch card', id, req.body);
    return res.status(200).end();
  }, 500);
});

router.delete('/:id', (req, res) => {
  setTimeout(() => {
    const { id } = req.params;

    console.log('patch card', id, req.body);
    return res.status(200).end();
  }, 500);
});

module.exports = router;
