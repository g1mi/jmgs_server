'use strict';

const Service = require('egg').Service;

class AuthService extends Service {
  async curlData(URL) {
    // 获取登录数据
    const result = await this.ctx.curl(URL, { dataType: 'json', timeout: 3000 });
    this.ctx.assert(result.data, 403, '获取用户信息失败! assert');

    return result.data;
  }

  sign(TOKEN) {
    return this.app.jwt.sign(TOKEN, this.config.jwt.secret);
  }

  verify(TOKEN) {
    return this.app.jwt.verify(TOKEN, this.config.jwt.secret);
  }

}

module.exports = AuthService;
