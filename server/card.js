const router = require('express').Router();
const axios = require('axios');
const { githubApi } = require('../data');

module.exports = function (passport, isAuthenticated) {
  router.get('/:cardId', isAuthenticated, (req, res) => {
    const { cardId } = req.params;
    const card = req.map.cards.find(value => value.id === parseInt(cardId, 10));
    return res.status(200).json(card).end();
  });

  router.patch('/', isAuthenticated, (req, res) => {
    const map = req.map;

    req.body.forEach(data => {
      const card = map.cards.find(value => value.id === data.id);

      Object.keys(data).forEach(field => {

        if (data[field] === null && field in card) {
          card[field] = undefined;
          delete data[field];
        }
      });

      Object.assign(card, data);

      // update issue
      if (card.issue && (data.hasOwnProperty('detail') || data.hasOwnProperty('title'))) {
        const { owner, repo, number } = card.issue;
        const updateData = {};

        if (data.hasOwnProperty('detail')) {
          updateData.body = data.detail;
        } else {
          updateData.title = data.title;
        }

        axios({
          method: 'patch',
          url: `${githubApi}/repos/${owner}/${repo}/issues/${number}`,
          headers: {
            Authorization: `token ${req.user.token}`,
            Accept: 'application/vnd.github.symmetra-preview+json'
          },
          data: updateData
        }).then((response) => {
          console.log('update to github successfully');
        }, (error) => {
          console.log('update to github failed', error);
        });
      }
    });

    map.save(error => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).json(map.cards).end();
    });
  });

  router.post('/', isAuthenticated, (req, res) => {
    const card = req.body;
    const map = req.map;
    const { cards } = map;
    const count = cards.length;
    const id = count === 0 ? 0 : cards[count - 1].id + 1;

    card.id = id;
    map.cards.push(card);

    map.save(error => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).json(id).end();
    });
  });

  router.delete('/', isAuthenticated, (req, res) => {
    const cardIds = req.body;
    const map = req.map;
    const { cards } = map;

    cardIds.forEach(cardId => {
      const index = cards.findIndex(card => card.id === cardId);
      cards.splice(index, 1);
    });

    map.save(error => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).end();
    });
  });
  return router;
};
