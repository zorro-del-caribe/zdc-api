exports.self = {
  description: 'Get classified details',
  method: 'get',
  path: '/:classifiedId',
  schema: {
    type: 'object',
    properties: {
      classifiedId: {
        type: ['integer', 'string']
      }
    },
    required: ['classifiedId']
  },
  handler: function * () {
    const {Classifieds, Users} = this.app.context;
    const [classified] = yield Classifieds
      .select()
      .where('id', '$classifiedId')
      .run(this.params);

    if (!classified) {
      this.throw(404, {error_description: 'could not find the classified'});
    }

    this.body = classified;
  }
};

exports.list = {
  description: 'fetch a list of classifieds',
  path: '/',
  method: 'get',
  handler: function * () {
    const {Classifieds} = this.app.context;
    this.body = yield Classifieds
      .select()
      .orderBy('createdAt', 'desc')
      .run();
  }
};

exports.create = {
  description: 'create a new classified',
  path: '/',
  method: 'post',
  schema: {
    type: 'object',
    properties: {
      title: {type: 'string', maxLength: 255},
      content: {type: 'string'}
    },
    required: ['title', 'content']
  },
  handler: function * () {
    const {Classifieds}=this.app.context;
    const {user} = this.state;

    this.assert(user, 403, {error_description: 'you don not have correct access rights'});

    this.body = yield Classifieds.new(Object.assign(this.request.body, {userId: user.id})).create();
    this.status = 201;
  }
};
