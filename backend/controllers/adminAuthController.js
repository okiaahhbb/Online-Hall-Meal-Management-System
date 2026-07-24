const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;

    if (secretCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ message: 'Invalid admin secret code' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [existing] = await pool.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Admin already registered with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Admin registered', adminId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};