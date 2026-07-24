const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/adminAuth');
const {
  submitFeedback,
  getAllFeedback,
  markFeedbackRead,
  deleteFeedback,
} = require('../controllers/feedbackController');

router.post('/', submitFeedback); // public
router.get('/admin', verifyAdminToken, getAllFeedback);
router.post('/admin/:id/read', verifyAdminToken, markFeedbackRead);
router.delete('/admin/:id', verifyAdminToken, deleteFeedback);

module.exports = router;