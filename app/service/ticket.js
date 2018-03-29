'use strict';

const Service = require('egg').Service;
class TicketService extends Service {
  /**
   *    owner,
        audioUrl,
        createTime,
        status,
        duration, 客户端算好
        amount,
        location: [lng, lat]
        challengs:[]
   */


  async create(DATA) {
    const { ctx, service } = this;
    const { Ticket } = ctx.model;

    // 在创建的同时，用户表里需要添加记录
    const owner = await service.user.find(DATA.owner);
    ctx.assert(owner, 404, '用户不存在！');

    const ticket = await Ticket.create(DATA);
    ctx.assert(ticket, 405, '添加敢说失败！');
    const addedUser = await service.user.addTicket(DATA.owner, ticket.id);
    ctx.assert(addedUser, 405, '未能添加敢说到用户记录！');
    return ticket;
  }

  async addChallenge(TICKETID, CHALLENGEID) {
    return this.ctx.model.Ticket.findByIdAndUpdate(TICKETID, {
      $push: {
        challenges: CHALLENGEID,
      },
    });
  }


  async setOverdue(TICKETID) {
    return this.ctx.model.Ticket.findByIdAndUpdate(TICKETID, {
      isAlive: false,
    });
  }

  async find(ID) {
    return this.ctx.model.Ticket.findById(ID);
  }

  async locate(QUERY) {
    return await this.ctx.model.Ticket.find({
      location: {
        $near: QUERY.location,
        $maxDistance: QUERY.maxDistance,
      },
    }).where({ isAlive: true });
  }

}

module.exports = TicketService;
