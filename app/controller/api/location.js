'use strict';

const Controller = require('egg').Controller;

class LocateController extends Controller {

  async locate() {
    const { ctx, service } = this;
    try {
      // 取得目标坐标
      const { longitude, latitude, maxDistance } = ctx.request.query;
      ctx.assert(longitude || latitude || maxDistance, 403, '请求定位格式不对！');
      const queryData = {
        location: [
          longitude,
          latitude,
        ],
        maxDistance,
      };
      // 取得周围坐标点
      const ticketsNear = await service.ticket.locate(queryData);
      if (ticketsNear) {
        const tickets = [];
        for (let i = 0; i < ticketsNear.length; i++) {
          const t = ticketsNear[i];
          tickets.push({
            ticketId: t.id,
            ticketLocation: t.location,
          });
        }
        ctx.body = { tickets };
        ctx.status = 200;
      }
      return;
    } catch (error) {
      ctx.throw(403, error);
    }
  }
}

module.exports = LocateController;
