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

exports.self = {
  description: 'Find user details',
  method: 'get',
  path: '/:userId',
  schema: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        format: 'uuid'
      }
    },
    required: ['userId']
  },
  handler: function * () {
    const {Users}=this.app.context;

    if (this.state.user && this.state.user.id !== this.params.userId) {
      this.throw(403, {error_description: 'you do not have access to this user details'});
    }

    this.body = yield Users
      .select()
      .where('id', '$userId')
      .runAndAssert(this.params, this, 'could not find the user info');
  }
};