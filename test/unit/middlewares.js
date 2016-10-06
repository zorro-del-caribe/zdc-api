const test = require('tape');
const req = require('supertest');
const koa = require('koa');
const authentication = require('../../middlewares/authentication');
const authorization = require('../../middlewares/authorization');
const http = require('http');
const broker = require('../../middlewares/broker');

function mockAuth (response) {
  return {
    tokens(params = {}){
      return {
        self(selfOpts = {}){
          const {token} = selfOpts;
          if (token !== 'foo')
            return Promise.reject('invalid token value');

          return Promise.resolve(response);
        }
      }
    }
  }
}

test('authentication middleware: http 401 if there is no Authorization header', t=> {
  const app = koa()
    .use(authentication());

  req(http.createServer(app.callback()))
    .get('/')
    .expect(401)
    .end(function (err, {body}) {
      t.error(err);
      t.end();
    });
});

test('authentication middleware: http 401 if authorisation header is invalid', t=> {
  const app = koa()
    .use(authentication());

  req(http.createServer(app.callback()))
    .get('/')
    .set('Authorization', 'Basic alkdjsfsf=')
    .expect(401)
    .end(function (err, {body}) {
      t.error(err);
      t.end();
    });
});

test('authentication middleware: assign token to request state ', t=> {
  const app = koa()
    .use(authentication())
    .use(function * () {
      this.body = this.state;
    });

  req(http.createServer(app.callback()))
    .get('/')
    .set('Authorization', 'Bearer foo')
    .expect(200)
    .end(function (err, {body}) {
      t.error(err);
      t.equal(body.token, 'foo');
      t.end();
    });
});

test('authorization middleware: http 403 if token has been revoked', t=> {
  const app = koa()
    .use(function * (next) {
      this.state.token = 'foo';
      yield *next;
    })
    .use(authorization());

  app.context.auth = mockAuth({
    token: 'foo',
    revoked: true,
    scope: {},
    expires_in: 234
  });

  req(http.createServer(app.callback()))
    .get('/')
    .expect(403)
    .end(function (err, {body}) {
      t.error(err);
      t.end();
    });
});

test('authorization middleware: http 403 if token has expired', t=> {
  const app = koa()
    .use(function * (next) {
      this.state.token = 'foo';
      yield *next;
    })
    .use(authorization());

  app.context.auth = mockAuth({
    token: 'foo',
    revoked: false,
    scope: {},
    expires_in: -12
  });

  req(http.createServer(app.callback()))
    .get('/')
    .expect(403)
    .end(function (err, {body}) {
      t.error(err);
      t.end();
    });
});

test('authorization middleware: assign token result', t=> {
  const app = koa()
    .use(function * (next) {
      this.state.token = 'foo';
      yield *next;
    })
    .use(authorization())
    .use(function * () {
      this.body = this.state.token;
    });

  app.context.auth = mockAuth({
    token: 'foo',
    revoked: false,
    scope: {
      type: 'user'
    },
    expires_in: 234
  });

  req(http.createServer(app.callback()))
    .get('/')
    .expect(200)
    .end(function (err, {body}) {
      t.error(err);
      t.deepEqual(body, {
        token: 'foo',
        revoked: false,
        scope: {
          type: 'user'
        },
        expires_in: 234
      });
      t.end();
    });
});

test('broker publish body as message if response status is success', t=> {
  const app = koa()
    .use(broker('hello.world'))
    .use(function * () {
      this.body = 'hello';
    });

  app.context.channel = {
    publish(channel, routing, message){
      t.equal(channel, 'zdc');
      t.equal(routing, 'hello.world');
      t.equal(message.toString(), '"hello"');
      t.end();
    }
  };

  req(http.createServer(app.callback()))
    .get('/')
    .expect(200)
    .end(function (err) {
      t.error(err);
    })
});