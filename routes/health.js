const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  console.log(req.cookies);
  res.send('Authenticated...');
});

module.exports = router;
