const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { upload } = require('../services/storageService');
const assetController = require('../controllers/assetController');

const router = Router();

router.get('/', authenticate, assetController.listAssets);
router.post('/', authenticate, upload.single('file'), assetController.uploadAsset);
router.delete('/:assetId', authenticate, assetController.deleteAsset);

module.exports = router;
