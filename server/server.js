const express = require('express');
const cors = require('cors');

const port = 8030;
const app = express();
app.use(cors());

console.log('hahahahaha');

app.get('/suggest/', (req, res) => {
  setTimeout(() => {
    return res.status(200).json(['test', 'and']).end();
  }, 500);
});

app.listen(port, () => {
  console.log('server listening on port %s', port);
});
