'use strict';

const Controller = require('egg').Controller;

class InfoController extends Controller {
  async show() {
    const { service, ctx } = this;
    const bulletinInfo = await service.info.get('bulletinInfo');
    if (ctx.helper.assertNull(bulletinInfo, 404, '未找到展报信息！', ctx)) {
      return;
    }

    ctx.body = {
      bulletinInfo: bulletinInfo.content,
    };
    ctx.status = 200;
    return;
  }
}

module.exports = InfoController;
