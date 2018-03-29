'use strict';
const Qiniu = require('qiniu');

module.exports = (options, app) => {
  return async function(ctx, next) {
    try {
      console.log('经过api, 即将进入安检！');
      const { authorization } = ctx.request.header;
      ctx.assert(authorization, 403, '身份验证失败！！');
      // 上传回调验证
      if (authorization.indexOf('QBox ') === 0) {
        const callbackPass = Qiniu.util.isQiniuCallback(app.config.qiniu.mac, ctx.request.href, null, authorization);
        ctx.assert(callbackPass, 403, '非法Callback！');
      } else {
        // 普通验证
        ctx.service.auth.verify(authorization);
      }

      // 设定返回形式
      ctx.type = 'json';
      await next();
    } catch (error) {
      ctx.throw(403, error);
    }
  };
};
