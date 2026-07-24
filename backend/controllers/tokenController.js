const pool = require('../utils/db');
const { generateTokensForTomorrow } = require('../scheduler/tokenScheduler');

exports.getMyTokens = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, meal_date, meal_type, token, status, generated_at
       FROM tokens WHERE user_id = ? ORDER BY meal_date DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTodayToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split('T')[0];
    const [rows] = await pool.query(
      `SELECT id, meal_date, meal_type, token, status
       FROM tokens WHERE user_id = ? AND meal_date = ?`,
      [userId, todayStr]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// টেস্টের জন্য — ম্যানুয়ালি টোকেন জেনারেট ট্রিগার করার এন্ডপয়েন্ট (dev only)
exports.manualGenerate = async (req, res) => {
  try {
    await generateTokensForTomorrow();
    res.json({ message: 'Tokens generated manually for testing.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};