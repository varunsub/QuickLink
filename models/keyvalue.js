const mongoose = require('mongoose');

/**
 * Product model schema.
 */
const kv = new mongoose.Schema({
  awslink: String,
  llink: String,
});

module.exports = kv;
