'use strict';
const Qiniu = require('qiniu');

module.exports = (options, app) => {
  return async function(ctx, next) {
    try {
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
      ctx.logger.info(ctx.type + ' ' + ctx.status + ' ' + ctx.path);
    } catch (error) {
      ctx.throw(403, error);
    }
  };
};
