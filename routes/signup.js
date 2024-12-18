const { Router } = require('express');
const router = Router();
const controller = require('../controllers/signup');

router.get('/', controller.signupGet);
router.post('/', controller.signupPost);

module.exports = router;
