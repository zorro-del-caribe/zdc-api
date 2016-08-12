const test = require('tape');
const testFor = require('./helper').testFor;


test('me a new user from a token', t=> {
  testFor()
    .then(function ({req, app}) {
      req
        .put('/users/me')
        .set('Authorization', 'Bearer tokenCode')
        .expect(201)
        .end(function (err, {body}) {
          t.error(err);
          t.ok(body.id);
          t.equal(body.email, 'hello@world.com');
          app.stop();
          t.end();
        });
    });
});

test('me an existing user', t=> {
  testFor({type: 'user', target: 'foo@bar.com'})
    .then(function ({req, app}) {
      const {Users} = app.context;
      Users
        .insert({email: 'foo@bar.com'})
        .run()
        .then(function ([u]) {
          req
            .put('/users/me')
            .set('Authorization', 'Bearer tokenCode')
            .expect(200)
            .end(function (err, {body}) {
              t.error(err);
              t.equal(body.id, u.id);
              t.equal(body.email, 'foo@bar.com');
              app.stop();
              t.end();
            });
        });
    });
});


