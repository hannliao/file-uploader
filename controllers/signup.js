const { validationResult } = require('express-validator');
const signupValidator = require('../validators/signup');
const bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.signupGet = (req, res) => {
  res.render('signup', { appName: 'clouddrive', title: 'Sign Up', errors: [] });
};

exports.signupPost = [
  signupValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('signup', {
        appName: 'clouddrive',
        title: 'Sign Up',
        errors: errors.array(),
        username: req.body.username,
      });
    }
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          folders: {
            create: {
              name: 'Home',
            },
          },
        },
      });
      res.redirect('/login');
    } catch (err) {
      console.error('Error creating user:', err);
    }
  },
];
