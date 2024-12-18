const { Router } = require('express');
const router = Router();
const controller = require('../controllers/folders');

router.get('/:id', controller.viewFolderGet);
router.post('/:id', controller.createFolderPost);
router.post('/:id/edit', controller.updateFolderPost);
router.post('/:id/delete', controller.deleteFolderPost);

module.exports = router;
