const bucanero = require('bucanero');
module.exports = function () {
  return bucanero({plugins: ['bucanero-tanker', 'bucanero-router']})
};
