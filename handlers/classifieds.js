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
    const {Classifieds} = this.app.context;
    this.body = yield Classifieds
      .select()
      .where('id', '$classifiedId')
      .runAndAssert(this.params, this, 'could not find the classified');
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
      content: {type: 'string'},
      price: {type: ['number', 'string']}
    },
    required: ['title', 'content']
  },
  handler: function * () {
    const {Classifieds}=this.app.context;
    const {user} = this.state;
    const {title, content, price} = this.request.body;
    const classifiedData = {
      title,
      content,
      price: price || null
    };

    this.assert(user, 403, {error_description: 'you do not have correct access rights'});

    this.body = yield Classifieds
      .new(Object.assign(classifiedData, {userId: user.id}))
      .create();

    this.status = 201;
  }
};
