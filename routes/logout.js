const { Router } = require('express');
const router = Router();
const controller = require('../controllers/logout');

router.get('/', controller.logout);

module.exports = router;
