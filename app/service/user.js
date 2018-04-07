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
  async findRecords(USERID) {
    const tickets = await this.ctx.model.Ticket.find({ owner: USERID }).populate({ path: 'owner', select: 'avatarUrl' });
    const challenges = await this.ctx.model.Challenge.find({ owner: USERID }).populate({
      path: 'belongTo',
      select: [ 'createTime', 'isAlive' ],
      populate: {
        path: 'owner',
        select: 'avatarUrl',
      },
    });
    const checkDulplicate = [];
    const returnData = [];
    for (let i = 0; i < tickets.length; i++) {
      const element = tickets[i];
      checkDulplicate.push(element.id);
      returnData.push({
        ticketId: element.id,
        createTime: element.createTime,
        avatarUrl: element.owner.avatarUrl,
        isAlive: element.isAlive,
      });
    }
    console.log(checkDulplicate.length);
    for (let i = 0; i < challenges.length; i++) {
      const element = challenges[i];
      if (checkDulplicate.indexOf(element.belongTo.id) === -1) {
        checkDulplicate.push(element.belongTo.id);
        returnData.push({
          ticketId: element.belongTo.id,
          createTime: element.belongTo.createTime,
          avatarUrl: element.belongTo.owner.avatarUrl,
          isAlive: element.belongTo.isAlive,
        });
      }
    }
    console.log(checkDulplicate.length);

    return returnData;
  }
}

module.exports = UserService;
