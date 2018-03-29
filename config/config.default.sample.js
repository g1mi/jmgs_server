'use strict';

module.exports = appInfo => {
  const config = exports = {
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/testdb',
        options: {
          autoReconnect: true,
          reconnectTries: Number.MAX_VALUE,
          bufferMaxEntries: 0,
          auth: { authSource: 'testdb' },
        },
      },
    },
    jwt: {
      secret: 'bulala',
      match: '/api/',
    },
    nativeConf: {
      timeout: 666, // 这不知道是啥，忘记了
    },
    security: {
      csrf: {
        enable: false, // 方便测试
        ignoreJSON: true,
      },
    },
    weapp: {
      authUrl: 'https://api.weixin.qq.com/sns/jscode2session',
      appSecret: '1',
      appId: '1',
    },
    redis: {
      client: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 0,
      },
    },
    qiniu: {
      accessKey: '1',
      secretKey: '1',
      bucket: '1',
      ticketCallbackUrl: '上传成功后回调的业务服务器地址',
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '111';

  // add your config here
  config.middleware = [ 'checkStatus' ];
  config.checkStatus = {
    match: '/api/',
  };
  config.onerror = {
    all(err, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, this);
      ctx.response.type = 'json';
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && ctx.app.config.env === 'prod' ?
        'Internal Server Error' :
        err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        error,
      };
      ctx.header['content-type'] = 'application/vnd.api+json';
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    },
    accepts() {
      return 'json';
    },
  };
  return config;
};
