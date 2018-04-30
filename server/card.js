const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const StoryMap = mongoose.model('StoryMap');
const Card = mongoose.model('Card');

router.get('/:id', (req, res) => {
  Card.findOne({ id: req.params.id }, {'_id': false}).exec((err, card) => {
    if (err) {
      console.log('Get card detail: Fail.', err);
      return res.status(400).end();
    }

    console.log('Get card detail: Ok.');
    return res.status(200).json(card).end();
  });
});

router.post('/', (req, res) => {
  Card.find().exec((error, cards) => {
    console.log('cards', cards.length, error);
    const count = cards.length;
    let id = 0;

    if (count !== 0) {
      id = cards[count - 1].id + 1;
    }
    req.body.id = id;
    new Card(req.body).save((err, card) => {
      if (err) {
        console.log('Create a new card: Fail to save to DB.', err);
        return res.status(400).end();
      }

      StoryMap.update({ id: req.body.mapId }, { $push: { cards: card._id } }).exec((err, result) => {
        if (err) {
          console.log('Update StoryMap with card: Fail.', err);
          return res.status(400).end();
        }
        return res.status(200).json(id).end();
      });
    });
  });
});

router.delete('/', (req, res) => {
  Card.remove({ id: { $in: req.body } }).exec((err, cards) => {
    if (err) {
      console.log('Delete card: Fail.', err);
      return res.status(400).end();
    }
    console.log('Delete card: Ok.');
    return res.status(200).end();
  });
});

router.patch('/', (req, res) => {
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
          console.log('Update card: Fail.', err);
        }
        console.log('Update card: Ok.');
      })
    );
  });

  Promise.all(promises).then(() => {
    console.log('work');
    return res.status(200).end();
  });
});

module.exports = router;
