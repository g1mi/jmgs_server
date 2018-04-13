'use strict';

module.exports = appInfo => {
  const config = exports = {
    mongoose: {
      client: {
        url: 'mongodb://testdb:123123qQ@127.0.0.1:27017/testdb',
        options: {
          autoReconnect: true,
          reconnectTries: Number.MAX_VALUE,
          bufferMaxEntries: 0,
          auth: { authSource: 'testdb' },
        },
      },
    },
    jwt: {
      secret: 'MightyG1mi',
      match: '/api/',
    },
    nativeConf: {
      timeout: 666,
    },
    weapp: {
      authUrl: 'https://api.weixin.qq.com/sns/jscode2session',
      appSecret: '###',
      appId: '###',
    },
    security: {
      csrf: {
        ignoreJSON: true,
      },
    },
    // redis: {
    //   client: {
    //     port: 6379,
    //     host: '127.0.0.1',
    //     password: '',
    //     db: 0,
    //   },
    // },
    qiniu: {
      accessKey: '###',
      secretKey: '',
      ticketCallbackUrl: 'http://jmgs.viphk.ngrok.org/api/ticket', // 上传成功后提交表单数据
      challengeCallbackUrl: 'http://jmgs.viphk.ngrok.org/api/challenge',
      bucketDomain: '###', // 不能加/ authorizeUrl
      bucket: '###',
      deadline: 3600, // 授权可访问时间
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1521562631790_5282';

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
