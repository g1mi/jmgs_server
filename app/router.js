'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/', controller.home.index);
  router.resources('user', '/api/user', controller.api.user);
  router.resources('user', '/api/ticket', controller.api.ticket);
  router.resources('user', '/api/challenge', controller.api.challenge);
  router.get('/api/info', controller.api.info.show);
  router.get('/api/location', controller.api.location.locate);
  router.post('/login', controller.login.login);
  router.get('/api/auth/ticket', controller.api.auth.ticketToken);
  router.get('/api/auth/challenge', controller.api.auth.challengeToken);
};
