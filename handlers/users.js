exports.me = {
  description: 'Find or create a user based on an access token',
  method: 'put',
  path: '/me',
  user: false,
  schema: {
    type: 'object',
    properties: {
      email: {type: 'string', format: 'email'},
      name: {type: 'string', maxLength: 128}
    },
    additionalProperties: false
  },
  handler: function * () {
    const {Users} = this.app.context;
    const {token:{scope}} = this.state;

    let user;
    const email = scope.target ? scope.target : this.request.body.email;

    if (scope.type === 'user') {
      [user] = yield Users
        .select()
        .where('email', '$email')
        .instances({email});
    } else {
      throw new Error('Not implemented');
    }

    if (!user) {
      this.body = yield Users.new(Object.assign({}, this.request.body, {email})).create();
      this.status = 201;
    } else {
      this.body = user;
    }
  }
};