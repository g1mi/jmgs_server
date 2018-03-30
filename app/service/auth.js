'use strict';

const Service = require('egg').Service;
const Qiniu = require('qiniu');
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

  initMac() {
    const { qiniu } = this.app.config;
    const accessKey = qiniu.accessKey;
    const secretKey = qiniu.secretKey;
    qiniu.mac = qiniu.mac ? qiniu.mac : new Qiniu.auth.digest.Mac(accessKey, secretKey);
    return qiniu.mac;
  }
  initBucketManager() {
    const { qiniu } = this.app.config;
    qiniu.mac = this.service.auth.initMac();
    const config = new Qiniu.conf.Config();
    qiniu.bucketManager = qiniu.bucketManager ? qiniu.bucketManager : new Qiniu.rs.BucketManager(qiniu.mac, config);
    return qiniu.bucketManager;
  }
}

module.exports = AuthService;
