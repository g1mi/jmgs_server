'use strict';

const Controller = require('egg').Controller;
const Qiniu = require('qiniu');

class AuthController extends Controller {
  async getToken() {
    try {
      const { ctx } = this;
      const { qiniu } = this.app.config;
      const accessKey = qiniu.accessKey;
      const secretKey = qiniu.secretKey;
      const mac = qiniu.mac = qiniu.mac ? qiniu.mac : new Qiniu.auth.digest.Mac(accessKey, secretKey);
      const bucket = qiniu.bucket;
      const options = { // 上传策略
        scope: bucket, // bucket名称
        expires: 300, // 过期时间

        fsizeLimit: 20971520, // 20 MB

        // callback url settings
        callbackUrl: qiniu.ticketCallbackUrl,
        callbackBody: '{' +
          // Model
          '"owner":"$(x:owner)",' +
          '"audioUrl":"$(x:audioUrl)",' +
          '"duration":"$(x:duration)",' +
          '"amount":"$(x:amount)",' +
          '"location":"$(x:location)"' +
          '}',
        callbackBodyType: 'application/json',

        // custom variables

      };
      const putPolicy = new Qiniu.rs.PutPolicy(options);
      const token = putPolicy.uploadToken(mac);
      ctx.assert(token, 403, '获取上传授权失败！');
      ctx.status = 200;
      ctx.body = {
        ticketToken: token,
      };
      return;
    } catch (err) {
      this.throw(500, '获取上传文件授权失败！');
    }
  }
}

module.exports = AuthController;
