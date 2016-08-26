module.exports = function (h) {
  return {
    table: 'tags',
    columns: {
      id: 'integer',
      title: 'string',
      description: 'text',
      createdAt: 'timestamp',
      updatedAt: 'timestamp'
    },
    relations: {
      classifieds: h.belongsToMany('Classifieds','ClassifiedsTags','tagId')
    }
  };
};