const Logger = require('../../DevTools/Logger/index');
module.exports = client => {

  Logger.Error("./events/Client/error.js",console.error(), Date.now());
};
