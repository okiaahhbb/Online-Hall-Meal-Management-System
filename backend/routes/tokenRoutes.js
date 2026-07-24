const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getMyTokens, getTodayToken, manualGenerate } = require('../controllers/tokenController');

router.get('/', verifyToken, getMyTokens);
router.get('/today', verifyToken, getTodayToken);
router.post('/generate-now', verifyToken, manualGenerate); // টেস্টিং-এর জন্য শুধু

module.exports = router;