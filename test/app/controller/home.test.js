'use strict';

const {
  app,
  assert
} = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {

  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  // it('should GET /', () => {
  //   return app.httpRequest()
  //     .get('/')
  //     .expect('hi, egg')
  //     .expect(200);
  // });

  it('should POST /login/decode', () => {
    // 模拟 CSRF token，下文会详细说明
    app.mockCsrf();
    return app.httpRequest()
      .post('/login')
      .type('form')
      .send({
        encryptedData: 'encryptedData',
        iv: 'iv',
        code: 'code'
      })
      .expect(404)
      .expect({
        "message": "Not Found"
      });
  });
});