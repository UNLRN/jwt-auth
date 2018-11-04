require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');

const app = express();

app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

passport.use('local-strategy', require('./passport/local-strategy'));
passport.use('jwt-strategy', require('./passport/jwt-strategy'));

app.use('/auth', require('./routes/auth'));
app.use('/api', passport.authenticate('jwt-strategy', { session: false }), require('./routes/api'));
app.use('/health', require('./routes/health'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
