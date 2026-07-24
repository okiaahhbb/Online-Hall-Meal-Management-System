const pool = require('../utils/db');

const {
    isPastDate,
    isToday,
    isEditableDate,
    isLockedAfter10PM
} = require('../utils/dateHelper');

// Save or update meal
exports.saveMeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            date,
            breakfast,
            lunch,
            dinner
        } = req.body;

        if (!date) {
            return res.status(400).json({
                message: "Date is required"
            });
        }

        // Past day
        if (isPastDate(date)) {
            return res.status(403).json({
                message: "Past meals cannot be changed."
            });
        }

        // Today
        if (isToday(date)) {
            return res.status(403).json({
                message: "Today's meals cannot be changed."
            });
        }

        // Only tomorrow editable
        if (!isEditableDate(date)) {
            if (isLockedAfter10PM()) {
                return res.status(403).json({
                    message: "Meal selection locked after 10:00 PM."
                });
            }
            return res.status(403).json({
                message: "You can only edit tomorrow's meals."
            });
        }

        await pool.query(
            `INSERT INTO meals (user_id, date, breakfast, lunch, dinner)
            VALUES (?,?,?,?,?)
            ON DUPLICATE KEY UPDATE
            breakfast=VALUES(breakfast),
            lunch=VALUES(lunch),
            dinner=VALUES(dinner)`,
            [
                userId,
                date,
                !!breakfast,
                !!lunch,
                !!dinner
            ]
        );

        res.json({
            success: true,
            message: "Meal selection saved successfully."
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};

// 🎯 ফিক্সড: Get all meals (DATE_FORMAT ব্যবহার করা হয়েছে)
exports.getMyMeals = async (req, res) => {
    try {
        const userId = req.user.id;

        // DATE_FORMAT দিয়ে ডেটকে সরাসরি YYYY-MM-DD স্ট্রিং আকারে নিয়ে আসা হলো
        const [rows] = await pool.query(
            `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, breakfast, lunch, dinner
             FROM meals
             WHERE user_id=?`,
            [userId]
        );

        res.json(rows);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// 🎯 ফিক্সড: Get meal by date (DATE_FORMAT ব্যবহার করা হয়েছে)
exports.getMealByDate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date } = req.params;

        const [rows] = await pool.query(
            `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, breakfast, lunch, dinner
             FROM meals
             WHERE user_id=? AND date=?`,
            [userId, date]
        );

        if (rows.length === 0) {
            return res.json({
                date,
                breakfast: false,
                lunch: false,
                dinner: false
            });
        }

        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};