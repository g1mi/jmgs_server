'use strict';

const Service = require('egg').Service;

class ChallengeService extends Service {

  /**
   * belongTo
      owner
      createTime
      posterUrl
      videoUrl
   *
   */

  async create(DATA) {

    const { ctx, service } = this;
    const { Challenge } = ctx.model;

    // 检查是否可用
    const ticket = await service.ticket.find(DATA.belongTo);
    if (!ticket || !ticket.isAlive) {
      ctx.throw(403, '该挑战不存在或已过期！');
    }

    // 检查是否过期
    const overdue = ticket.createTime + ticket.duration < Date.now();
    if (overdue) {
      await service.ticket.setOverdue(ticket.id);
      ctx.throw(403, '该挑战已过期！');
    }

    // 添加新挑战, 并在用户和敢说里添加条目
    const challenge = await Challenge.create(DATA);
    ctx.assert(challenge, 405, '挑战创建失败！');
    const updatedTicket = await service.ticket.addChallenge(challenge.belongTo, challenge.id);
    ctx.assert(updatedTicket, 405, '挑战未添加到敢说中！');
    const updatedUser = await service.user.addChallenge(challenge.owner, challenge.id);
    ctx.assert(updatedUser, 405, '挑战未添加到用户记录中！');
    return challenge;
  }

  async find(ID) {
    return this.ctx.model.Challenge.findById(ID);
  }
  // 传入数组Ids
  async findByPage(challengeIds, page) {
    if (!challengeIds) { return; }
    if (typeof challengeIds !== 'object' || typeof page !== 'number') {
      this.ctx.throw(403, '数据有误！');
    }
    return this.ctx.model.Challenge.find({ _id: { $in: challengeIds } }).sort({ createTime: -1 }).limit((page - 1) * 10);
  }
  async fromTicket(TICKETID) {
    return this.ctx.model.Challenge.find({
      belongTo: TICKETID,
    });
  }

}

module.exports = ChallengeService;
