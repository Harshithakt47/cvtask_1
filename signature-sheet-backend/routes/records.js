const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

router.get('/', async (req, res) => {
  const records = await Record.find();
  res.json(records);
});

module.exports = router;
