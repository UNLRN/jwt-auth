const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

module.exports = {
  signJwt: user => jwt.sign({
    iss: 'tweeterdigest',
    sub: user.id,
    iat: dayjs().unix(),
    exp: dayjs().add(1, 'day').unix(),
  }, process.env.JWT_SECRET),
};
