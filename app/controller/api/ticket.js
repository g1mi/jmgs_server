'use strict';

const Controller = require('egg').Controller;

class TicketController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.TicketCreateData = {
      // 敢说所属用户
      owner: { type: 'string', required: true, allowEmpty: false },
      // 敢说音频地址
      audioUrl: { type: 'string', required: true, allowEmpty: false },
      // 可持续时间，这个由客户端算好传入
      duration: { type: 'string', required: true, allowEmpty: false },
      // 总人数
      amount: { type: 'string', required: true, allowEmpty: false },
      // 地点 二维 坐标
      location: { type: 'string', required: true, allowEmpty: false },
    };
  }
  async index() {
    return;
  }
  async create() {

    const { ctx, service } = this;
    try {
      // 验证数据
      ctx.validate(this.TicketCreateData);
      const data = ctx.request.body;

      // 重新组装
      data.location = JSON.parse(data.location);

      // 创建ticket
      const doc = await service.ticket.create(data);

      if (doc) {
        ctx.status = 200;
        ctx.body = JSON.stringify({ ticketId: doc.id });
      }
    } catch (error) {
      ctx.throw(403, '添加敢说失败！');
    }


  }
  async update() {
    return;
  }
  async destory() {
    return;
  }
  async show() {
    const { ctx, service, app } = this;
    const ticketId = ctx.params.id;
    const authorizeUrl = ctx.helper.authorizeUrl; // (originUrl, deadline, domain, bucketManager)
    const deadline = app.config.qiniu.deadline;
    const domain = app.config.qiniu.bucketDomain;
    const bucketManager = service.auth.initBucketManager();
    const page = ctx.request.query.page ? parseInt(ctx.request.query.page) : 1; // 默认为首页数据
    const doc = await service.ticket.find(ticketId);
    ctx.assert(doc, 404, '未找到该敢说:' + ticketId);

    // 检查是否过期
    if (doc.createTime + doc.duration < Date.now()) {
      service.ticket.setOverdue(doc.id);
      ctx.throw(404, '未找到该敢说！');
    }

    // 返回敢说数据（包括敢说）
    // 应当包含敢说的id，owner信息（nickname，avatarUrl），tickets
    const ownerDoc = await service.user.find(doc.owner);
    const challengeDocs = await service.challenge.findByPage(doc.challenges, page);

    // 组装数据
    const returnInfo = {
      ticketId: doc.id,
      ticketOwnerNickName: ownerDoc.nickName,
      ticketOwnerAvatarUrl: ownerDoc.avatarUrl,
      audioUrl: authorizeUrl(doc.audioUrl, deadline, domain, bucketManager), // 需要下载授权
      challenges: [],
    };

    if (challengeDocs.length > 0) {
      for (let i = 0; i < challengeDocs.length; i++) {
        const challenge = challengeDocs[i];
        returnInfo.challenges.push({
          challengeId: challenge.id,
          createTime: challenge.createTime,
          challengeOwnerNickName: challenge.owner.nickName,
          challengeOwnerAvatarUrl: challenge.owner.avatarUrl,
          posterUrl: authorizeUrl(challenge.posterUrl, deadline, domain, bucketManager), // 需要下载授权
          videoUrl: authorizeUrl(challenge.videoUrl, deadline, domain, bucketManager), // 需要下载授权
          isVertical: challenge.isVertical,
        });
      }
    }
    ctx.body = returnInfo;
    ctx.status = 200;
    // 日他先人，钻牛角尖了
    // new Promise(resolve => {
    //   let i = 0;
    //   let returnBody = {};
    //   function isOver() {
    //     if(++i >= 3) {
    //       resolve(returnBody);
    //     }
    //   };
    //   new Promise(rev => {
    //     const ownerDoc = await service.user.find(doc.owner);
    //     rev(ownerDoc);
    //   })
    // })

  }
}

module.exports = TicketController;
