const { Router } = require('express');
const router = Router();
const controller = require('../controllers/file');
const upload = require('../middleware/multer');

router.get('/:filePath', controller.viewFileGet);
router.post('/upload/:id', upload.single('file'), controller.uploadFilePost);
router.get('/download/:filePath', controller.downloadFileGet);

module.exports = router;
