module.exports = function (h) {
  return {
    table: 'classifieds',
    columns: {
      id: 'integer',
      title: 'string',
      content: 'text',
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
      userId: 'uuid',
      price:'number'
    },
    relations: {
      owner: h.belongsTo('Users', 'userId'),
      tags: h.belongsToMany('tags', 'ClassifiedsTags', 'classifiedId')
    }
  };
};