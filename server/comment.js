const router = require('express').Router();

module.exports = function (passport, isAuthenticated) {
  router.post('/', isAuthenticated, (req, res) => {
    const card = req.card;
    const { comments } = card;
    const count = comments.length;
    const comment = {
      id: count === 0 ? 0 : comments[count - 1].id + 1,
      userId: req.user.id,
      body: req.body.body,
      time: Date.now()
    };

    card.comments.push(comment);

    req.map.save(error => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).json(card).end();
    });
  });

  router.delete('/:commentId', isAuthenticated, (req, res) => {
    const { commentId } = req.params;
    const card = req.card;
    const { comments } = card;
    const index = comments.findIndex(comment => comment.id === parseInt(commentId, 10));

    comments.splice(index, 1);

    req.map.save(error => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).json(card).end();
    });
  });

  router.patch('/:commentId', isAuthenticated, (req, res) => {
    const { commentId } = req.params;
    const { body } = req.body;
    const card = req.card;
    const { comments } = card;
    const index = comments.findIndex(comment => comment.id === parseInt(commentId, 10));

    comments[index].body = body;

    req.map.save((error) => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).json(card).end();
    });
  });

  return router;
};
