const app = require('../../app');
const req = require('supertest');
const nock = require('nock');
const url = require('url');

module.exports = {
  testFor(tokenScope = {type: 'user', target: 'hello@world.com'}){
    const a = app();
    return a.start()
      .then(function () {
        const {conf} = a.context;
        const {client_id:user, secret:pass}=conf.value('zdc.auth');
        const auth = nock(url.format(conf.value('zdc.auth.endpoint')))
          .get('/tokens/tokenCode')
          .basicAuth({user, pass})
          .reply(200, {
            revoked: false,
            expires_in: 2000,
            access_token: 'access',
            scope: tokenScope
          });

        return {req: req(a.server), app: a};
      })
      .catch(err=> {
        console.error(err);
        t.end(err);
      });

  },
  findOrCreateUser(Users, {email}){
    return Users
      .select()
      .where('email', email)
      .run()
      .then(function ([user]) {
        return user ? [user] : Users.insert({email}).run()
      })
      .then(function ([user]) {
        return user;
      });
  }
};