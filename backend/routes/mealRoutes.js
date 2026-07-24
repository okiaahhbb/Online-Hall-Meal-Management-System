const express = require('express');

const router = express.Router();

const { verifyToken } = require('../middleware/auth');

const {

    saveMeal,

    getMyMeals,

    getMealByDate

} = require('../controllers/mealController');


// Save / Update meal
router.post('/', verifyToken, saveMeal);

// All meals
router.get('/', verifyToken, getMyMeals);

// One day's meal
router.get('/:date', verifyToken, getMealByDate);

module.exports = router;