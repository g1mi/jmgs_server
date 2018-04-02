'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const userSchema = new Schema({
    // 每个用户unionId唯一
    unionId: { type: String, unique: true, required: true, index: true },
    // 昵称， 每次登录的时候检查上次更新时间并更新
    nickName: String,
    // 头像，每次登录的时候检查上次更新时间并更新
    avatarUrl: String,
    // 更新时间，每次更新时记录
    updateTime: { type: String },
    // 创建时间
    createTime: { type: String },
    // 敢说IDs
    tickets: [{ type: Schema.Types.ObjectId, ref: 'ticket' }],
    // 敢做IDs
    challenges: [{ type: Schema.Types.ObjectId, ref: 'challenge' }],
  });
  return mongoose.model('user', userSchema, 'basic_user');
};
