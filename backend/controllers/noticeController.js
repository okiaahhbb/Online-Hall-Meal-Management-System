const pool = require('../utils/db');

// Public: শুধু approved notices
exports.getPublicNotices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, content, created_at FROM notices WHERE status = 'approved' ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: সব notices (pending + approved)
exports.getAllNoticesAdmin = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM notices ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: notice বানানো (সরাসরি approved হিসেবে বানাতে পারবে, বা pending রেখে পরে approve)
exports.createNotice = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const [result] = await pool.query(
      `INSERT INTO notices (title, content, status) VALUES (?, ?, ?)`,
      [title, content, status === 'approved' ? 'approved' : 'pending']
    );
    res.status(201).json({ message: 'Notice created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: approve করা
exports.approveNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE notices SET status = 'approved' WHERE id = ?`, [id]);
    res.json({ message: 'Notice approved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: delete
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM notices WHERE id = ?`, [id]);
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};