'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const infoSchema = new Schema({
    // info name
    infoName: { type: String, required: true, unique: true, index: true },
    // create time
    createTime: { type: String, default: Date.now() },
    // create time
    updateTime: { type: String, default: Date.now() },
    content: String,
    meta: { type: String, default: '{}' },
  });
  return mongoose.model('info', infoSchema, 'basic_info');
};
