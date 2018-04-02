'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const challengeSchema = new Schema({
    // 所属敢说
    belongTo: { type: Schema.Types.ObjectId, index: true, ref: 'ticket' },
    // 所属用户
    owner: { type: Schema.Types.ObjectId, index: true, ref: 'user' },
    // 创建时间
    createTime: { type: String, index: true },
    // 挑战视频截图
    posterUrl: String,
    // 挑战视频
    videoUrl: { type: String, required: true, unique: true },
  });
  return mongoose.model('challenge', challengeSchema, 'basic_challenge');
};
