'use strict';

const Service = require('egg').Service;

class InfoService extends Service {
  /**
   *  infoName*, createTime, updateTime, content*, meta
   */

  async create(DATA) {
    return this.ctx.model.Info.create(DATA);
  }

  async update(NAME, NEWCONTENT) {
    const { ctx } = this;
    return ctx.model.Info.findOne({ infoName: NAME }, (err, info) => {
      if (ctx.helper.assertNull(info, 403, '未找到[' + NAME + ']消息内容', ctx)) {
        return;
      }
      ctx.model.Info.findOneAndUpdate({ infoName: NAME }, {
        content: NEWCONTENT,
        updateTime: Date.now(),
      });
    });
  }

  async get(NAME) {
    return this.ctx.model.Info.findOne({ infoName: NAME });
  }

}

module.exports = InfoService;
