const url = require('url');
const amqp = require('amqplib');
const broker = require('../middlewares/broker');
module.exports = {
  priority: 202,
  init(app, handlers){
    if (process.env.NODE_ENV !== 'test') {
      const {conf} = app.context;
      const rabbit = conf.value('broker');
      const urlString = url.format(rabbit);
      const verbose = handlers.filter(h=>h.notify === true);
      return amqp.connect(urlString)
        .then(conn=> {
          return conn.createChannel();
        })
        .then(ch=> {
          ch.assertExchange('zdc', 'topic', {durable: false});
          app.context.channel = ch;

          for (const h of verbose) {
            const handlers = Array.isArray(h.handler) ? h.handler : [h.handler];
            handlers.unshift(broker(['zdc', h.namespace, h.title].join('.')));
            h.handler = handlers;
          }

          /**/
          return ch.assertQueue('', {exclusive: true}).then(function (q) {
            ch.bindQueue(q.queue, 'zdc', '#');
            ch.consume(q.queue, function (msg) {
              console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {noAck: true});
          });
        });
    }
  }
};