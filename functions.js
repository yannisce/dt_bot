const dot_env = require('dotenv');
dot_env.config();

function authenticate(userId) {
  if (userId) {
    return (userId == process.env.QUNETUM || userId == process.env.PEPEGAS) ? true : false
  } else return;
}

module.exports = {
  authenticate
};