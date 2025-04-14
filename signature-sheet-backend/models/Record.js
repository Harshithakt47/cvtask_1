// models/Record.js
const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  parentName: String,
  childName: String,
});

module.exports = mongoose.model('Record', RecordSchema);
