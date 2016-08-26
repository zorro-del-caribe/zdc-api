module.exports = function (h) {
  return {
    table: 'classifieds_tags',
    columns: {
      id: 'integer',
      tagId: 'integer',
      classifiedId: 'integer'
    }
  }
};