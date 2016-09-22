const test = require('tape');
const testFor = require('./helper').testFor;
const uuid = require('node-uuid');

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

test('get details for an existing user', t=> {
  testFor({type: 'user', target: 'some@other.com'})
    .then(function ({req, app}) {
      const {Users} = app.context;
      Users
        .insert({email: 'some@other.com'})
        .run()
        .then(function ([u]) {
          req
            .get(`/users/${u.id}`)
            .set('Authorization', 'Bearer tokenCode')
            .expect(200)
            .end(function (err, {body}) {
              t.error(err);
              t.equal(body.id, u.id);
              t.equal(body.email, 'some@other.com');
              app.stop();
              t.end();
            });
        });
    });
});

test('get details for a user fails as the user requested does not match the token one', t=> {
  testFor()
    .then(function ({req, app}) {
      const {Users} = app.context;
      Users
        .insert({email: 'some@other.again'})
        .run()
        .then(function ([u]) {
          req
            .get(`/users/${u.id}`)
            .set('Authorization', 'Bearer tokenCode')
            .expect(403)
            .end(function (err, {body}) {
              t.error(err);
              t.equal(body.error_description, 'you do not have access to this user details');
              app.stop();
              t.end();
            });
        });
    });
});

test('could not find the user details', t=> {
  testFor({type: 'app'})
    .then(function ({req, app}) {
      req
        .get('/users/' + uuid())
        .set('Authorization', 'Bearer tokenCode')
        .expect(404)
        .end(function (err, {body}) {
          t.error(err);
          t.equal(body.error_description, 'could not find the user info');
          app.stop();
          t.end();
        });
    });
});


