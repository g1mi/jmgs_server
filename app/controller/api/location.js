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
        ctx.status = 200;
        const tickets = [];
        ticketsNear.forEach(ticket => {
          tickets.push({
            ticketId: ticket.id,
            ticketLocation: ticket.location,
          });
        });
        ctx.body = { tickets };
      }
      return;
    } catch (error) {
      ctx.throw(403, error);
    }
  }
}

module.exports = LocateController;
