'use strict';
const Qiniu = require('qiniu');

module.exports = (options, app) => {
  return async function(ctx, next) {
    try {
      const { authorization } = ctx.request.header;
      if (ctx.helper.assertNull(authorization, 403, '身份验证失败！！', ctx)) {
        return;
      }
      // 上传回调验证
      if (authorization.indexOf('QBox ') === 0) {
        const callbackPass = Qiniu.util.isQiniuCallback(app.config.qiniu.mac, ctx.request.href, null, authorization);
        if (ctx.helper.assertNull(callbackPass, 403, '非法Callback！', ctx)) {
          return;
        }
      } else {
        // 普通验证
        ctx.service.auth.verify(authorization);
      }

      // 设定返回形式
      ctx.type = 'json';
      await next();
      if (ctx.app.config.env !== 'prod') {
        ctx.logger.info(ctx.status);
      }
    } catch (error) {
      ctx.throw(403, error);
    }
  };
};
