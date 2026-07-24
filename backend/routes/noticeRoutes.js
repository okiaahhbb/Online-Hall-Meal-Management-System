const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/adminAuth');
const {
  getPublicNotices,
  getAllNoticesAdmin,
  createNotice,
  approveNotice,
  deleteNotice,
} = require('../controllers/noticeController');

router.get('/public', getPublicNotices); // no auth — সবার জন্য উন্মুক্ত
router.get('/admin', verifyAdminToken, getAllNoticesAdmin);
router.post('/admin', verifyAdminToken, createNotice);
router.post('/admin/:id/approve', verifyAdminToken, approveNotice);
router.delete('/admin/:id', verifyAdminToken, deleteNotice);

module.exports = router;