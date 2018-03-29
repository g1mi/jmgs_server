'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // this.ctx.response.type = 'json';
    // const token = this.service.auth.sign({ unionId: 'sessionKey' });


    // const decoded = this.app.jwt.verify(token, this.config.jwt.secret);
    // console.log(decoded);
    // const decoded1 = this.app.jwt.decode(token);
    // console.log(decoded1);

    // this.app.jwt.verify(token, this.config.jwt.secret, (err, dec) => {
    //   if (!err) {
    //     console.log(dec);
    //   }
    // });
    this.ctx.body = 'hello, egg!';
  }
}

module.exports = HomeController;
