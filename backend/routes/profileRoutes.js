const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');

router.get('/me', verifyToken, getMyProfile);
router.put('/update', verifyToken, upload.single('profilePicture'), updateMyProfile);

module.exports = router;