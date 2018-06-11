const router = require('express').Router();

module.exports = function (passport, isAuthenticated) {
  router.post('/', isAuthenticated, (req, res) => {
    const release = req.body;
    const map = req.map;
    const { releases } = map;
    const count = releases.length;
    const id = count === 0 ? 0 : releases[count - 1].id + 1;

    release.id = id;
    releases.push(release);

    map.save(error => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).json(id).end();
    });
  });

  router.delete('/:releaseId', isAuthenticated, (req, res) => {
    const { releaseId } = req.params;
    const map = req.map;
    const { releases } = map;

    const index = releases.findIndex(release => release.id === parseInt(releaseId, 10));
    releases.splice(index, 1);

    map.save(error => {
      if (error) {
        return res.status(400).json(error).end();
      }
      return res.status(200).end();
    });
  });

  router.patch('/', isAuthenticated, (req, res) => {
    const updateData = req.body;
    const map = req.map;

    updateData.forEach(data => {
      const release = map.releases.find(release => release.id === data.id);
      Object.assign(release, data);
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
