const pool = require('../utils/db');
const bcrypt = require('bcryptjs');

// ================= STUDENT MANAGEMENT =================
exports.getAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, student_id, name, email, role, phone, room_no, profile_picture, created_at FROM users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const {
      name, email, password, student_id, phone,
      father_name, mother_name, home_district, department,
      room_no, block, address
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicture = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO users 
       (name, email, password, student_id, phone, father_name, mother_name, home_district, department, room_no, block, address, profile_picture, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'student')`,
      [name, email, hashedPassword, student_id || null, phone || null, father_name || null,
       mother_name || null, home_district || null, department || null, room_no || null,
       block || null, address || null, profilePicture]
    );

    res.status(201).json({ message: 'Student registered successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, email, student_id, phone,
      father_name, mother_name, home_district, department,
      room_no, block, address
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const profilePicture = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : existing[0].profile_picture;

    await pool.query(
      `UPDATE users SET
        name = ?, email = ?, student_id = ?, phone = ?,
        father_name = ?, mother_name = ?, home_district = ?, department = ?,
        room_no = ?, block = ?, address = ?, profile_picture = ?
       WHERE id = ?`,
      [name, email, student_id || null, phone || null, father_name || null,
       mother_name || null, home_district || null, department || null,
       room_no || null, block || null, address || null, profilePicture, id]
    );

    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= MEAL MANAGEMENT & HISTORY =================
exports.getMealHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        DATE_FORMAT(date, '%Y-%m-%d') as date,
        SUM(breakfast) as breakfast_count,
        SUM(lunch) as lunch_count,
        SUM(dinner) as dinner_count
       FROM meals
       GROUP BY date
       ORDER BY date DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMealsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const [rows] = await pool.query(
      `SELECT m.id, u.name, u.student_id, m.breakfast, m.lunch, m.dinner
       FROM meals m
       JOIN users u ON m.user_id = u.id
       WHERE m.date = ?`,
      [date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= HALL / CALENDAR CONTROL =================
exports.getHallSettings = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM hall_settings ORDER BY date DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setHallSetting = async (req, res) => {
  try {
    const { date, is_hall_closed, is_meal_off, note } = req.body;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    await pool.query(
      `INSERT INTO hall_settings (date, is_hall_closed, is_meal_off, note)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       is_hall_closed = VALUES(is_hall_closed),
       is_meal_off = VALUES(is_meal_off),
       note = VALUES(note)`,
      [date, !!is_hall_closed, !!is_meal_off, note || null]
    );

    res.json({ message: 'Hall setting updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= BILLING =================
exports.getMealRates = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM meal_rates ORDER BY date DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setMealRate = async (req, res) => {
  try {
    const { date, breakfast_rate, lunch_rate, dinner_rate } = req.body;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    await pool.query(
      `INSERT INTO meal_rates (date, breakfast_rate, lunch_rate, dinner_rate)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       breakfast_rate = VALUES(breakfast_rate),
       lunch_rate = VALUES(lunch_rate),
       dinner_rate = VALUES(dinner_rate)`,
      [date, breakfast_rate || 40, lunch_rate || 40, dinner_rate || 40]
    );

    res.json({ message: 'Meal rate updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentBill = async (req, res) => {
  try {
    const { userId, month } = req.params;

    const [meals] = await pool.query(
      `SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, breakfast, lunch, dinner
       FROM meals
       WHERE user_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?`,
      [userId, month]
    );

    const [rates] = await pool.query(`SELECT * FROM meal_rates`);
    const rateMap = {};
    rates.forEach((r) => {
      rateMap[r.date] = r;
    });

    let total = 0;
    const breakdown = meals.map((m) => {
      const rate = rateMap[m.date] || { breakfast_rate: 40, lunch_rate: 40, dinner_rate: 40 };
      const dayTotal =
        (m.breakfast ? Number(rate.breakfast_rate) : 0) +
        (m.lunch ? Number(rate.lunch_rate) : 0) +
        (m.dinner ? Number(rate.dinner_rate) : 0);
      total += dayTotal;
      return { ...m, dayTotal };
    });

    res.json({ userId, month, total, breakdown });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CHANGE PASSWORD =================
exports.changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT * FROM admins WHERE id = ?', [adminId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Admin not found' });

    const admin = rows[0];
    const match = await bcrypt.compare(oldPassword, admin.password);
    if (!match) return res.status(401).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, adminId]);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};