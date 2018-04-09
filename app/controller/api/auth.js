'use strict';

const Controller = require('egg').Controller;
const Qiniu = require('qiniu');

class AuthController extends Controller {
  // 在创建上传Token之前应当先查验是否具备上传条件，如遇到过期，人满等情况

  async checkLogin() {
    this.ctx.status = 200;
  }

  /**
   * TODO:
   *   添加权限检查（是否可以添加敢说，是否可以挑战等等）
   */


  async ticketToken() {
    try {
      const { ctx } = this;
      const { qiniu } = this.app.config;
      const mac = this.service.auth.initMac();
      const bucket = qiniu.bucket;
      const options = { // 上传策略
        scope: bucket, // bucket名称
        expires: 300, // 过期时间

        fsizeLimit: 10485760, // 10 MB

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

  async challengeToken() {
    try {
      const { ctx } = this;
      const { qiniu } = this.app.config;
      const mac = this.service.auth.initMac();
      const bucket = qiniu.bucket;
      const options = { // 上传策略
        scope: bucket, // bucket名称
        expires: 600, // 过期时间

        fsizeLimit: 10485760, // 20 MB

        // callback url settings
        callbackUrl: qiniu.challengeCallbackUrl,
        callbackBody: '{' +
          // Model
          '"belongTo":"$(x:belongTo)",' +
          '"owner":"$(x:owner)",' +
          '"posterUrl":"$(x:posterUrl)",' +
          '"videoUrl":"$(x:videoUrl)",' +
          '"isVertical":"$(x:isVertical)"' +
          '}',
        callbackBodyType: 'application/json',

        // custom variables

      };
      const putPolicy = new Qiniu.rs.PutPolicy(options);
      const token = putPolicy.uploadToken(mac);
      ctx.assert(token, 403, '获取上传授权失败！');
      ctx.status = 200;
      ctx.body = {
        challengeToken: token,
      };
      return;
    } catch (err) {
      this.throw(500, '获取上传文件授权失败！');
    }
  }
}

module.exports = AuthController;
