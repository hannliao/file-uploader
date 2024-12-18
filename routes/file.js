const { Router } = require('express');
const router = Router();
const controller = require('../controllers/file');

router.get('/:id', controller.viewFileGet);

module.exports = router;
