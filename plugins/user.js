const user = require('../middlewares/user');

module.exports = {
  priority: 201,
  init: function (app, handlers) {
    const userHandlers = handlers.filter(h=>h.user !== false);
    for (const h of userHandlers) {
      const handler = Array.isArray(h.handler) ? h.handler : [h.handler];
      handler.unshift(user());
      h.handler = handler;
    }
    return app;
  }
};