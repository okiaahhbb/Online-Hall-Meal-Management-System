const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/adminAuth');
const {
  getAllStudents,
  getMealHistory,
  getMealsByDate,
  getHallSettings,
  setHallSetting,
  getMealRates,
  setMealRate,
  getStudentBill,
  changeAdminPassword,
} = require('../controllers/adminController');

router.get('/students', verifyAdminToken, getAllStudents);
router.get('/meals/history', verifyAdminToken, getMealHistory);
router.get('/meals/date/:date', verifyAdminToken, getMealsByDate);
router.get('/hall-settings', verifyAdminToken, getHallSettings);
router.post('/hall-settings', verifyAdminToken, setHallSetting);
router.get('/meal-rates', verifyAdminToken, getMealRates);
router.post('/meal-rates', verifyAdminToken, setMealRate);
router.get('/bill/:userId/:month', verifyAdminToken, getStudentBill);
router.post('/change-password', verifyAdminToken, changeAdminPassword);

module.exports = router;