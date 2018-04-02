'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ticketSchema = new Schema({
    // 敢说所属用户
    owner: { type: Schema.Types.ObjectId, ref: 'user', index: true },
    // 敢说音频地址
    audioUrl: { type: String, required: true, unique: true },
    createTime: { type: String, index: true },
    updateTime: { type: String },
    // 是否为激活状态
    isAlive: { type: Boolean, default: true, index: true },
    // 可持续时间，这个由客户端算好传入             // 七天
    duration: { type: Number, required: true, max: 604800000 },
    // 总人数
    amount: { type: Number, required: true, max: 500 },
    // 地点 二维 坐标
    location: { type: [ Number ], required: true, index: '2d' },
    // 参与的挑战
    challenges: [{ type: Schema.Types.ObjectId, ref: 'challenge' }],
  });
  return mongoose.model('ticket', ticketSchema, 'basic_ticket');
};
