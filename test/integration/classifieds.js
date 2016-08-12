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