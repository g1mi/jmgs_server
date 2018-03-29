'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.UserCreateData = {
      unionId: { type: 'string', required: true, allowEmpty: false },
      nickName: { type: 'string', required: true, allowEmpty: false },
      avatarUrl: { type: 'string', required: true, allowEmpty: false },
    };

    this.UserUpdateData = {
      nickName: { type: 'string', required: true, allowEmpty: false },
      avatarUrl: { type: 'string', required: true, allowEmpty: false },
    };
  }
  async index() {
    return;
  }
  async create() {
    const { ctx, service } = this;

    try {
      // 检查数据
      ctx.validate(this.UserCreateData);

      // 准备插入数据
      const data = this.ctx.request.body;
      const doc = await service.user.create(data);

      // 新建成功
      if (doc) {
        ctx.status = 200;
        ctx.body = {
          userId: doc.id,
        };
      }
    } catch (error) {
      ctx.throw(403, '新建用户失败');
    }

  }
  async update() {
    const { ctx, service } = this;
    try {
      // 检查数据
      ctx.validate(this.UserUpdateData);

      // 准备修改,加入修改时间
      const data = {
        nickName: ctx.request.body.nickName,
        avatarUrl: ctx.request.body.avatarUrl,
        updateTime: Date.now(),
      };
      const { id } = ctx.params;
      const doc = await service.user.update(id, data);

      // 修改成功
      if (doc) {
        ctx.status = 200;
        ctx.body = {
          error: '',
        };
      }
    } catch (error) {
      ctx.body = {
        error: '更新用户失败',
      };
      ctx.status = 403.3;
    }

  }
  async destory() {
    return;
  }
  async show() {
    return;
  }
}

module.exports = UserController;
