module.exports = function (h) {
  return {
    table: 'users',
    columns: {
      id: 'uuid',
      email: 'string',
      name: 'string',
      createdAt: 'timestamp',
      updatedAt: 'timestamp'
    },
    relations: {
      classifieds: h.hasMany('classifieds')
    }
  };
};