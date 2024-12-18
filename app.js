require('dotenv').config();
const express = require('express');
const path = require('node:path');
const passport = require('passport');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const auth = require('./middleware/auth');
const preventCache = require('./middleware/preventCache');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const indexRouter = require('./routes/index');
const foldersRouter = require('./routes/folders');

const app = express();
const prisma = new PrismaClient();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    },
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return done(null, false, { message: 'Username does not exist' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/', auth, preventCache, indexRouter);
app.use('/folders', auth, preventCache, foldersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500);
  res.render('error', { message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port`, PORT);
});
