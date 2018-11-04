const _ = require('lodash');
const JwtStrategy = require('passport-jwt').Strategy;

const db = require('../database');

module.exports = new JwtStrategy({
  jwtFromRequest: req => _.get(req, 'cookies.jwt'),
  secretOrKey: process.env.JWT_SECRET,
}, async (payload, done) => {
  try {
    const user = await db.get('users').find({ id: payload.sub }).value();
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});
