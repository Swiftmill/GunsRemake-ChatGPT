const { Router } = require('express');
const rateLimiter = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');

const router = Router();

router.post('/register', rateLimiter({ max: 20, windowMs: 15 * 60 * 1000 }), authController.register);
router.post('/login', rateLimiter({ max: 50, windowMs: 15 * 60 * 1000 }), authController.login);
router.post('/logout', authController.logout);
router.post('/discord', authController.exchangeDiscordToken);

module.exports = router;
