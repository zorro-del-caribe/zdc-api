exports.self = {
  description: 'Get tag details',
  method: 'get',
  path: '/:tagId',
  schema: {
    type: 'object',
    properties: {
      tagId: {type: ['integer', 'string']}
    },
    required: ['tagId']
  },
  handler: function * () {
    const {Tags} = this.app.context;
    this.body = yield Tags
      .select()
      .where('id', '$tagId')
      .runAndAssert(this.params, this, 'could not find the tag');
  }
};

exports.list = {
  description: 'Get a searchable list of tags',
  path: '/',
  method: 'get',
  schema: {
    type: 'object',
    properties: {
      search: {type: 'string'}
    }
  },
  handler: function * () {
    const {Tags} = this.app.context;
    const qp = this.request.query;
    const builder = Tags
      .select()
      .orderBy('id');

    if (qp.search) {
      builder
        .where('title', 'ilike', '$search')
        .noop();

      qp.search = `%${qp.search}%`;
    }

    this.body = yield builder.run(qp);
  }
};