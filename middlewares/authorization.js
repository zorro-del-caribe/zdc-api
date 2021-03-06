const zdc = require('zdc')();

module.exports = function () {
  return function * (next) {
    const {token} = this.state;
    const {conf,zdc} = this.app.context;

    const fullToken = yield zdc.tokens(conf.value('zdc.auth')).self({token});
    const {revoked, expires_in} = fullToken;

    if (revoked || expires_in <= 0) {
      this.throw(403, 'The token is invalid, revoked or expired');
    }

    this.state.token = fullToken;

    yield *next;
  };
};