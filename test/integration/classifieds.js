const test = require('tape');
const helper = require('./helper');
const testFor = helper.testFor;

test('can not find classified', t=> {
  testFor()
    .then(function ({req, app}) {
      req
        .get('/classifieds/666')
        .set('Authorization', 'Bearer tokenCode')
        .expect(404)
        .end(function (err, {body}) {
          t.error(err);
          t.equal(body.error_description, 'could not find the classified');
          app.stop();
          t.end();
        });
    });
});

test('get an existing classified', t=> {
  testFor()
    .then(function ({req, app}) {
      const {Classifieds, Users} = app.context;
      helper.findOrCreateUser(Users, {email: 'hello@world.com'})
        .then(function (user) {
          return Classifieds
            .insert({title: 'test', content: 'that is a content', userId: user.id})
            .run();
        })
        .then(function ([c]) {
          req
            .get(`/classifieds/${c.id}`)
            .set('Authorization', 'Bearer tokenCode')
            .expect(200)
            .end(function (err, {body}) {
              t.error(err);
              t.equal(body.id, c.id);
              t.equal(body.title, 'test');
              t.equal(body.content, 'that is a content');
              t.ok(body.createdAt);
              t.ok(body.updatedAt);
              t.ok(body.userId);
              app.stop();
              t.end();
            });
        });
    });
});

test('create a new classified', t=> {
  testFor()
    .then(function ({req, app}) {
      const {Users}=app.context;
      return helper.findOrCreateUser(Users, {email: 'hello@world.com'})
        .then((function (user) {
          req
            .post('/classifieds')
            .set('Authorization', 'Bearer tokenCode')
            .send({title: 'new post', content: 'that is a content', price: 54.32})
            .expect(201)
            .end(function (err, {body}) {
              t.error(err);
              t.ok(body.id);
              t.equal(body.title, 'new post');
              t.equal(body.content, 'that is a content');
              t.equal(+(body.price), 54.32);
              t.equal(body.userId, user.id);
              app.stop();
              t.end();
            });
        }));
    })
    .catch(t.end);
});

test('create a new classified fails with 403 as the token does not match any user', t=> {
  testFor({type: 'app'})
    .then(function ({req, app}) {
      req
        .post('/classifieds')
        .set('Authorization', 'Bearer tokenCode')
        .send({title: 'new post', content: 'that is a content', price: 54.32})
        .expect(403)
        .end(function (err, {body}) {
          t.error(err);
          t.equal(body.error_description, 'you do not have correct access rights');
          app.stop();
          t.end();
        });
    })
    .catch(t.end);
});