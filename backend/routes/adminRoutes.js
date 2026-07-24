const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getMealHistory,
  getMealsByDate,
  getHallSettings,
  setHallSetting,
  getMealRates,
  setMealRate,
  getStudentBill,
  changeAdminPassword,
} = require('../controllers/adminController');

// Students
router.get('/students', verifyAdminToken, getAllStudents);
router.post('/students', verifyAdminToken, upload.single('profilePicture'), createStudent);
router.put('/students/:id', verifyAdminToken, upload.single('profilePicture'), updateStudent);
router.delete('/students/:id', verifyAdminToken, deleteStudent);

// Meal management & history
router.get('/meals/history', verifyAdminToken, getMealHistory);
router.get('/meals/date/:date', verifyAdminToken, getMealsByDate);

// Hall / calendar control
router.get('/hall-settings', verifyAdminToken, getHallSettings);
router.post('/hall-settings', verifyAdminToken, setHallSetting);

// Billing
router.get('/meal-rates', verifyAdminToken, getMealRates);
router.post('/meal-rates', verifyAdminToken, setMealRate);
router.get('/bill/:userId/:month', verifyAdminToken, getStudentBill);

// Settings
router.post('/change-password', verifyAdminToken, changeAdminPassword);

module.exports = router;