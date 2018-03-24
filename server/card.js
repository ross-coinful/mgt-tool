const express = require('express');
// import { exchangeAry, credentialsAry } from 'mockData/exchange';

const router = express.Router();
const cardList = require('./mockData');

router.get('/list', (req, res) => {
  setTimeout(() => {

    // const labels = ['todo', 'ready', 'doing', 'done'];
    // const cardList = [];

    // for (let i = 0; i < 30; i++) {
    //   let type = 'subtask';

    //   if (i < 3) {
    //     type = 'activity';
    //   } else if (i < 10) {
    //     type = 'task';
    //   }

    //   const card = {
    //     id: i,
    //     title: `${type}-${i}`,
    //     type
    //   };

    //   switch (type) {
    //     case 'activity':
    //       card.activityIndex = i;
    //       break;
    //     case 'task':
    //       card.activityIndex = i % 3;
    //       card.taskIndex = i % 2;
    //       break;
    //     case 'subtask':
    //       card.activityIndex = i % 3;
    //       card.taskIndex = i % 2;
    //       card.releaseIndex = i % 3;
    //       card.subtaskIndex = i % 3;
    //       card.label = labels[i % 4];
    //       break;
    //   }

    //   cardList.push(card);
    // }

    return res.status(200).json(cardList).end();
  }, 500);
});

router.post('/', (req, res) => {
  setTimeout(() => {
    const id = 100;
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
