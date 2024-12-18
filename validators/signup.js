const { body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requiredErr = 'is required';
const lengthErr = 'must have at least 8 letters';

module.exports = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage(`Username ${requiredErr}`)
    .custom(async (username) => {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (user) {
        throw new Error('Username already taken');
      }
      return true;
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage(`Password ${requiredErr}`)
    .isLength({ min: 8 })
    .withMessage(`Password ${lengthErr}`),
  body('confirmPwd').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];
