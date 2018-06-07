const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const StoryMap = mongoose.model('StoryMap');
const Card = mongoose.model('Card');

const axios = require('axios');
const { githubApi } = require('../data');

module.exports = function (passport, isAuthenticated) {
  router.get('/:id', isAuthenticated, (req, res) => {
    Card.findOne({ id: req.params.id }, {'_id': false}).exec((err, card) => {

      if (err) {
        return res.status(400).json(err).end();
      }
      return res.status(200).json(card).end();
    });
  });

  router.patch('/pos', isAuthenticated, (req, res) => {
    const body = req.body;
    const promises = [];

    body.forEach(data => {
      const updateData = {};
      const removekeys = {};

      Object.keys(data).forEach(key => {

        if (key !== 'id') {

          if (data[key] === null) {
            removekeys[key] = '';
          } else {
            updateData[key] = data[key];
          }
        }
      });

      const id = data.id;
      const options = {};

      if (Object.keys(updateData).length > 0) {
        options['$set'] = updateData;
      }

      if (Object.keys(removekeys).length > 0) {
        options['$unset'] = removekeys;
      }

      promises.push(
        Card.update({id: id}, options).exec((err, result) => {
          if (err) {
            return res.status(400).json(err).end();
          }
        })
      );
    });

    Promise.all(promises).then(() => {
      console.log('work');
      return res.status(200).end();
    });
  });

  router.post('/', isAuthenticated, (req, res) => {
    Card.find().exec((error, cards) => {

      if (error) {
        return res.status(400).json(error).end();
      }

      const count = cards.length;
      let id = 0;

      if (count !== 0) {
        id = cards[count - 1].id + 1;
      }
      req.body.id = id;
      new Card(req.body).save((err, card) => {

        if (err) {
          return res.status(400).json(err).end();
        }
        StoryMap.update({ id: req.body.mapId }, { $push: { cards: card._id } }).exec((error2, result) => {

          if (error2) {
            return res.status(400).json(error2).end();
          }
          return res.status(200).json(id).end();
        });
      });
    });
  });

  router.delete('/', isAuthenticated, (req, res) => {
    Card.remove({ id: { $in: req.body } }).exec((err, cards) => {

      if (err) {
        return res.status(400).json(err).end();
      }
      return res.status(200).end();
    });
  });

  // only change 'title', 'detail', 'comment' or 'labelId'
  // update issue sync if has issue
  router.patch('/', isAuthenticated, (req, res) => {
    const { id, commentId, ...updateData } = req.body;

    if (Number.isInteger(commentId)) {
      const comment = {
        id: commentId,
        userId: req.user.id,
        body: req.body.body,
        time: Date.now()
      };

      Card.findOne({id}).exec((err, card) => {
        if (err) {
          return res.status(400).json(err).end();
        }
        const index = card.comments.findIndex(comment => comment.id === commentId);

        if (index !== -1) {
          const { body } = req.body;

          if (body === null) { // delete comment
            card.comments.splice(index, 1);
          } else {
            card.comments[index].body = req.body.body;
          }
        } else {
          card.comments.push(comment);
          // if (card.issue) {
          //   const { owner, repo, number } = card.issue;

          //   axios({
          //     method: 'patch',
          //     url: `${githubApi}/repos/${owner}/${repo}/issues/${number}/comments`,
          //     headers: {
          //       Authorization: `token ${req.user.token}`,
          //       Accept: 'application/vnd.github.symmetra-preview+json'
          //     },
          //     data: body
          //   }).then((response) => {
          //     return res.status(200).json(card).end();
          //   }, (error) => {
          //     return res.status(400).json(error).end();
          //   });
          // } else {
          //   return res.status(200).json(card).end();
          // }
        }

        card.save((error) => {
          if (error) {
            return res.status(400).json(error).end();
          }
          return res.status(200).json(card).end();
        });
      });
    } else {
      Card.findOneAndUpdate({id}, {$set: updateData}, {new: true}).exec((err, card) => {
        if (err) {
          return res.status(400).json(err).end();
        }

        // update issue
        if (card.issue) {
          const { owner, repo, number } = card.issue;

          if (updateData.hasOwnProperty('detail')) {
            updateData.body = updateData.detail;
            delete updateData.detail;
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

        return res.status(200).json(card).end();
      });
    }
  });

  return router;
};
