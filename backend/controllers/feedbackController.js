const pool = require('../utils/db');

// Public: feedback জমা দেওয়া
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    await pool.query(
      `INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)`,
      [name || null, email || null, message]
    );
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: সব feedback দেখা
exports.getAllFeedback = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM feedback ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: read হিসেবে mark করা
exports.markFeedbackRead = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE feedback SET is_read = TRUE WHERE id = ?`, [id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: delete
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM feedback WHERE id = ?`, [id]);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};