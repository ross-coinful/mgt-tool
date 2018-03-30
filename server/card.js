const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Card = mongoose.model('Card');

const { cardList } = require('./mockData');
let id = 100;

// function getNextSequence (name, counters) {
//   var ret = counters.findAndModify(
//     {
//       query: { _id: name },
//       update: { $inc: { seq: 1 } },
//       new: true
//     }
//   );

//   return ret.seq;
// }

router.get('/list', (req, res) => {
  Card.find({}, {'_id': false, '_v': false}).exec((err, cards) => {
    if (err) {
      console.log('Get card list: Fail.', err);
      return res.status(400).end();;
    }

    const _cards = cards.map((value) => {
      delete value._id;
      delete value._v;
      return value;
    });

    console.log('Get card list: Ok.');
    return res.status(200).json(_cards).end();
  });
});

router.post('/', (req, res) => {
  Card.find().exec((err, cards) => {

    console.log('cards', cards.length);

    const count = cards.length;
    let id = 0;

    if (count !== 0) {
      id = cards[count - 1].id + 1;
    }

    req.body.id = id;

    new Card(req.body).save((err) => {
      if (err) {
        console.log('Create a new card: Fail to save to DB.', err);
        return res.status(400).end();;
      }
      console.log('Create a new card: Save to DB.');
      return res.status(200).json(id).end();
    });
  });
});

router.delete('/', (req, res) => {
  Card.remove({id: { $in: req.body }}).exec((err, cards) => {
    if (err) {
      console.log('Delete card: Fail.', err);
      return res.status(400).end();;
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
      }));
  });

  Promise.all(promises).then(() => {
    console.log('work');
    return res.status(200).end();
  });
});

module.exports = router;
