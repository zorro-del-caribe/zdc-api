module.exports = {
  priority: 300,
  extension(sh){
    Object.assign(sh.adapters, {
      runAndAssert(params = {}, ctx, message){
        return this.run(params)
          .then(function ([item]) {
            if (!item) {
              ctx.throw(404, {error_description: message || 'could not find the item'});
            }
            return item;
          });
      }
    });
  }
};