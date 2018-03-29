'use strict';

const Controller = require('egg').Controller;

class ChallengeController extends Controller {

  constructor(ctx) {
    super(ctx);

    this.ChallengeCreateData = {
      // 敢说所属用户
      belongTo: { type: 'string', required: true, allowEmpty: false },
      // 所属用户
      owner: { type: 'string', required: true, allowEmpty: false },
      // 挑战视频截图
      posterUrl: { type: 'string', required: true, allowEmpty: false },
      // 挑战视频
      videoUrl: { type: 'string', required: true, allowEmpty: false },
    };
  }
  async index() {
    return;
  }
  async create() {
    const { ctx, service } = this;
    try {
      // 验证数据
      ctx.validate(this.ChallengeCreateData);

      const data = ctx.request.body;

      const doc = await service.challenge.create(data);
      if (doc) {
        ctx.status = 200;
        ctx.body = {
          error: '',
        };
      }
    } catch (error) {
      ctx.throw(403, '挑战添加失败！');
    }

  }
  async update() {
    return;
  }
  async destory() {
    return;
  }
  async show() {
    return;
  }
}

module.exports = ChallengeController;
