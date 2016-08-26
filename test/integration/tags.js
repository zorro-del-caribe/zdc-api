const test = require('tape');
const helper = require('./helper');
const testFor = helper.testFor;

test('can not find tag', t=> {
  testFor()
    .then(function ({req, app}) {
      req
        .get('/tags/666')
        .set('Authorization', 'Bearer tokenCode')
        .expect(404)
        .end(function (err, {body}) {
          t.error(err);
          t.equal(body.error_description, 'could not find the tag');
          app.stop();
          t.end();
        });
    })
    .catch(t.end);
});

test('get an existing tag', t=> {
  testFor()
    .then(function ({req, app}) {
      const {Tags}=app.context;
      return Tags
        .insert({title: 'new tag', description: 'amazing thing'})
        .run()
        .then(function ([tag]) {
          req
            .get(`/tags/${tag.id}`)
            .set('Authorization', 'Bearer tokenCode')
            .expect(200)
            .end(function (err, {body}) {
              t.error(err);
              t.equal(body.id, tag.id);
              t.equal(body.description, 'amazing thing');
              t.equal(body.title, 'new tag');
              app.stop();
              t.end();
            });
        });
    })
    .catch(t.end);
});

test('get a list of tags (no search)', t=> {
  testFor()
    .then(function ({req, app}) {
      const {Tags} = app.context;
      return Tags
        .delete()
        .run()
        .then(function () {
          return Tags
            .insert({
              title: 'tag',
              description: 'foo'
            })
            .run();
        })
        .then(function () {
          return Tags
            .insert({
              title: 'tagbis',
              description: 'blah'
            })
            .run();
        })
        .then(function () {
          req
            .get('/tags')
            .set('Authorization', 'Bearer tokenCode')
            .expect(200)
            .end(function (err, {body}) {
              t.error(err);
              t.equal(body.length, 2);
              app.stop();
              t.end();
            });
        });
    })
    .catch(t.end)
});

test('get a list of tags (with search)', t=> {
  testFor()
    .then(function ({req, app}) {
      const {Tags} = app.context;
      return Tags
        .delete()
        .run()
        .then(function () {
          return Tags
            .insert({
              title: 'tag',
              description: 'foo'
            })
            .run();
        })
        .then(function () {
          return Tags
            .insert({
              title: 'tagbis',
              description: 'blah'
            })
            .run();
        })
        .then(function () {
          req
            .get('/tags?search=bis')
            .set('Authorization', 'Bearer tokenCode')
            .expect(200)
            .end(function (err, {body}) {
              t.error(err);
              t.equal(body.length, 1);
              t.ok(body.every(t=>t.title.includes('bis')));
              app.stop();
              t.end();
            });
        });
    })
    .catch(t.end)
});