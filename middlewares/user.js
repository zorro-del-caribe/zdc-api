module.exports = function () {
  return function * (next) {
    const {scope} = this.state.token;
    const {Users} = this.app.context;
    const {target:email} = scope;

    const [user] =yield Users
      .select()
      .where('email', '$email')
      .run({email});

    this.assert(user, 400, {error_description: 'user could not be found in our system. Make sure you have converted your token first /users/me'});
    this.state.user = user;

    yield *next;
  };
};