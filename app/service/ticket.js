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
    if (ctx.helper.assertNull(owner, 404, '用户不存在！', ctx)) {
      return;
    }
    DATA.createTime = Date.now();
    const ticket = await Ticket.create(DATA);
    if (ctx.helper.assertNull(ticket, 403, '添加敢说失败！', ctx)) {
      return;
    }
    const addedUser = await service.user.addTicket(DATA.owner, ticket.id);
    if (ctx.helper.assertNull(addedUser, 403, '未能添加敢说到用户记录！', ctx)) {
      return;
    }
    return ticket;
  }

  async addChallenge(TICKETID, CHALLENGEID) {
    return this.ctx.model.Ticket.findByIdAndUpdate(TICKETID, {
      updateTime: Date.now(),
      $push: {
        challenges: CHALLENGEID,
      },
    });
  }


  async setOverdue(TICKETID) {
    return this.ctx.model.Ticket.findByIdAndUpdate(TICKETID, {
      isAlive: false,
      updateTime: Date.now(),
    });
  }

  async find(ID) {
    return this.ctx.model.Ticket.findById(ID);
  }

  async locate(QUERY) {
    return this.ctx.model.Ticket.find({
      location: {
        $near: QUERY.location,
        $maxDistance: QUERY.maxDistance,
      },
    }).where({ isAlive: true }).sort({ createTime: -1 });
  }
}

module.exports = TicketService;
