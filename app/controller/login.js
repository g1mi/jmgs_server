'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.decodeData = {
      code: { type: 'string', required: true, allowEmpty: false },
      encryptedData: { type: 'string', required: true, allowEmpty: false },
      iv: { type: 'string', required: true, allowEmpty: false },
    };
  }


  async login() {
    const { ctx, service } = this;
    const { weapp } = this.config;
    // 验证数据
    ctx.validate(this.decodeData);

    // 获取sessionId
    const { code, encryptedData, iv, rawData } = ctx.request.body;
    const params = {
      appid: weapp.appId,
      secret: weapp.appSecret,
      js_code: code,
      grant_type: 'authorization_code',
    };

    // 获取登录数据
    const { session_key, unionid } = await service.auth.curlData(ctx.helper.formatUrl(weapp.authUrl, params));
    let userInfo = null;
    // 查询是否为新用户
    let user = await service.user.findByUnionId(unionid);
    if (user) {
      // 非新用户 查看是否需要更新数据
      if (Date.now - user.updateTime > 172800000) { // 2天
        //
      }
      userInfo = user;
    } else {
      // 新用户 添加用户
      userInfo = ctx.helper.decodeUserInfo(encryptedData, iv, weapp.appId, session_key, ctx);
      const params = {
        unionId: userInfo.unionId,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
      };
      user = await service.user.create(params);
      if (ctx.helper.assertNull(user, 403, '用户未添加成功！', ctx)) {
        return;
      }
    }

    // 取得jwt
    const token = service.auth.sign(rawData + session_key);
    ctx.body = {
      authorization: token,
      userInfo: {
        id: userInfo.id,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
      },
    };
    ctx.status = 200;
  }
}

module.exports = LoginController;
