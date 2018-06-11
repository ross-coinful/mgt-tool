const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const StoryMap = mongoose.model('StoryMap');

module.exports = function (passport, isAuthenticated) {
  router.post('/', isAuthenticated, (req, res) => {
    const { mapId, cardId } = req.params;
    const comment = req.body;

    StoryMap.findOne({id: mapId}).exec((err, map) => {
      if (err) {
        return res.status(400).json(err).end();
      }

      const card = map.cards.find(card => card.id === cardId);
      const { comments } = card;
      const count = comments.length;
      const id = count === 0 ? 0 : comments[count - 1].id + 1;

      comments.id = id;
      card.comments.push(comment);

      map.save(error => {
        if (error) {
          return res.status(400).json(error).end();
        }
        return res.status(200).end();
      });
    });
  });

  router.delete('/:commentId', isAuthenticated, (req, res) => {
    const { mapId, cardId, commentId } = req.params;

    StoryMap.findOne({id: mapId}).exec((err, map) => {
      if (err) {
        return res.status(400).json(err).end();
      }

      const { comments } = map.cards.find(card => card.id === cardId);
      const index = comments.findIndex(comment => comment.id === commentId);
      comments.splice(index, 1);

      map.save(error => {
        if (error) {
          return res.status(400).json(error).end();
        }
        return res.status(200).end();
      });
    });
  });

  router.patch('/:commentId', isAuthenticated, (req, res) => {
    const { mapId, cardId, commentId } = req.params;
    const { body } = req.body;

    StoryMap.findOne({id: mapId}).exec((err, map) => {
      if (err) {
        return res.status(400).json(err).end();
      }

      const { comments } = map.cards.find(card => card.id === cardId);
      const index = comments.findIndex(comment => comment.id === commentId);
      comments[index].body = body;

      map.save((error) => {
        if (error) {
          return res.status(400).json(error).end();
        }
        return res.status(200).end();
      });
    });
  });

  return router;
};
