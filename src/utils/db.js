const mongoose = require('mongoose');
const config = require('../config/config');

const connect = (url = config.dbUrl, opts = {}) =>
  mongoose.connect(url, {
    ...opts,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

module.exports = connect;
