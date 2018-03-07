const express = require('express');
const app = express();

console.log('hahahahaha');

app.get('/suggest/', (req, res) => {
  setTimeout(() => {
    return res.status(200).json(['test']).end();
  }, 500);
});

app.listen(3030, () => {
  console.log('server listening on port 3030');
});
