module.exports = function (routing) {
  return function * (next) {
    const {channel} = this.app.context;
    yield *next;
    const {body, status}=this.response;
    if (status < 400) {
      channel.publish('zdc', routing, new Buffer(JSON.stringify(body)));
    }
  }
};