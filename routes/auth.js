require('dotenv').config();
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const cuid = require('cuid');
const helpers = require('../helpers');
const db = require('../database');

const router = express.Router();

router.get('/status', (req, res) => {
  res.send('reporting in...');
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const doesUserExist = await db.get('users').find({ email }).value();
  if (doesUserExist) {
    return res.status(400).send({ message: 'Email exists.' });
  }
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const id = cuid();
    const user = { id, email, password: hash };
    await db.get('users').push({ ...user }).write();
    const token = helpers.signJwt(user);
    res.cookie('jwt', token);
    return res.status(200).send({ token, message: 'Account Created' });
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.post('/login', (req, res) => {
  passport.authenticate('local-strategy', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({ info });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.send(err);
      }
      const token = helpers.signJwt(user);
      res.cookie('jwt', token);
      return res.status(200).json({ token, message: 'User signed in' });
    });
    return null;
  })(req, res);
});

module.exports = router;
