const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const profileController = require('../controllers/profileController');

const router = Router();

router.get('/me', authenticate, profileController.getProfile);
router.put('/me', authenticate, profileController.updateProfile);
router.post('/me/links', authenticate, profileController.createLink);
router.put('/me/links/:linkId', authenticate, profileController.updateLink);
router.post('/me/links/reorder', authenticate, profileController.reorderLinks);
router.delete('/me/links/:linkId', authenticate, profileController.deleteLink);
router.get('/templates', authenticate, profileController.listTemplates);
router.get('/templates/public', profileController.listTemplates);
router.get('/public/:username', profileController.getPublicProfile);
router.post('/public/:username/links/:linkId/click', profileController.registerClick);

module.exports = router;
