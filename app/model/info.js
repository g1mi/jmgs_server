'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const infoSchema = new Schema({
    // info name
    infoName: { type: String, required: true, unique: true, index: true },
    // create time
    createTime: { type: String },
    // create time
    updateTime: { type: String },
    content: String,
    meta: { type: String, default: '{}' },
  });
  return mongoose.model('info', infoSchema, 'basic_info');
};
