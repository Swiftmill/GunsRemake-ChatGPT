const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/adminController');

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', adminController.listUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.get('/overview', adminController.getOverview);

router.get('/badges', adminController.listBadges);
router.post('/badges', adminController.createBadge);
router.put('/badges/:badgeId', adminController.updateBadge);
router.delete('/badges/:badgeId', adminController.deleteBadge);
router.post('/users/:userId/badges/:badgeId', adminController.assignBadge);
router.delete('/users/:userId/badges/:badgeId', adminController.removeBadge);

router.get('/templates', adminController.listTemplates);
router.post('/templates', adminController.createTemplate);
router.put('/templates/:templateId', adminController.updateTemplate);
router.delete('/templates/:templateId', adminController.deleteTemplate);

router.get('/analytics/:userId', adminController.getAnalytics);

module.exports = router;
