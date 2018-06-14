const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// const path = require('path');

module.exports = function (passport, isAuthenticated) {
  router.post('/', upload.single('image'), (req, res) => {
    const { card, map, originalUrl, file: { filename } } = req;
    const src = `http://localhost:8030${originalUrl}/${filename}`;

    card.detail += `<img src="${src}" />`;

    map.save(error => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).json(card).end();
    });
  });

  router.get('/:imageId', (req, res) => {
    const { imageId } = req.params;
    const imagePath = `C:/Side Project/mgt-tool/uploads/${imageId}`;
    res.sendFile(imagePath);
  });
  return router;
};
