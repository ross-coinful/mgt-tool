const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const StoryMap = mongoose.model('StoryMap');
const Release = mongoose.model('Release');

router.get('/list', (req, res) => {
  Release.find({}, {'_id': false}).exec((err, releases) => {
    if (err) {
      console.log('Get card list: Fail.', err);
      return res.status(400).end();
    }

    let maxOrder = 0;

    if (releases.length) {
      maxOrder = releases.reduce((max, v) => Math.max(max, v.order), releases[0].order);
    }

    releases.push({id: 0, title: 'Unscheduled', order: maxOrder + 1});
    console.log('Get card list: Ok.');
    return res.status(200).json(releases).end();
  });
});

router.post('/', (req, res) => {
  Release.find().exec((error, releases) => {
    console.log('Releases', releases.length, error);
    const count = releases.length;
    let id = 1;

    if (count) {
      id = releases[count - 1].id + 1;
    }

    req.body.id = id;

    new Release(req.body).save((err, release) => {
      if (err) {
        console.log('Create a new release: Fail to save to DB.', err);
        return res.status(400).end();
      }

      StoryMap.update({ id: req.body.mapId }, { $push: { releases: release._id } }).exec((err, result) => {
        if (err) {
          console.log('Update StoryMap with release: Fail.', err);
        }
        return res.status(200).json(id).end();
      });
    });
  });
});

router.delete('/', (req, res) => {
  Release.remove({id: req.body.id}).exec((err, cards) => {
    if (err) {
      console.log('Delete release: Fail.', err);
      return res.status(400).end();
    }
    console.log('Delete release: Ok.');
    return res.status(200).end();
  });
});

router.patch('/', (req, res) => {
  const body = req.body;
  const promises = [];

  body.forEach(data => {
    const id = data.id;
    delete data.id;

    promises.push(
      Release.update({id: id}, {$set: data}).exec((err, result) => {
        if (err) {
          console.log('Update release: Fail.', err);
        }
        console.log('Update release: Ok.');
      }));
  });

  Promise.all(promises).then(() => {
    return res.status(200).end();
  });
});

module.exports = router;
