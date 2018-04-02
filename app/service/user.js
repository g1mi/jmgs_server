'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  /**
   *  {*unionId，*nickName，*avatarUrl,updateTime,tickets,challenges}
   */

  async create(DATA) {
    DATA.createTime = Date.now();
    return this.ctx.model.User.create(DATA);
  }

  async update(ID, DATA) {
    DATA.updateTime = Date.now();
    return this.ctx.model.User.findByIdAndUpdate(ID, DATA);
  }

  async remove(ID) {
    return this.ctx.model.User.findByIdAndRemove(ID);
  }
  async find(ID) {
    return this.ctx.model.User.findById(ID);
  }
  async findByUnionId(DATA) {
    return this.ctx.model.User.findOne({ unionId: DATA });
  }
  async addChallenge(USERID, CHALLENGEID) {
    return this.ctx.model.User.findByIdAndUpdate(USERID, {
      $push: {
        challenges: CHALLENGEID,
      },
    });
  }
  async addTicket(USERID, TICKETID) {
    return this.ctx.model.User.findByIdAndUpdate(USERID, {
      $push: {
        tickets: TICKETID,
      },
    });
  }
}

module.exports = UserService;
