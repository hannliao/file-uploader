const { Router } = require('express');
const router = Router();
const controller = require('../controllers/file');
const upload = require('../middleware/multer');

router.get('/:filePath', controller.viewFileGet);
router.post('/:id/upload', upload.single('file'), controller.uploadFilePost);
router.get('/:filePath/download', controller.downloadFileGet);
router.post('/:filePath/delete', controller.deleteFilePost);

module.exports = router;
