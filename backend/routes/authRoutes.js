const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');
const { register, login, changePassword } = require('../controllers/authController');

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);

module.exports = router;