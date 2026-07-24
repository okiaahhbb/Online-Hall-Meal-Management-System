const pool = require('../utils/db');

// লগইন করা ইউজারের নিজের প্রোফাইল দেখা
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, student_id, name, email, phone, father_name, mother_name,
              home_district, address, department, degree_level, room_no, block,
              profile_picture, date_of_birth, blood_group, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// লগইন করা ইউজারের নিজের প্রোফাইল আপডেট করা (ছবি সহ)
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name, phone, father_name, mother_name,
      home_district, address, department, room_no, block
    } = req.body;

    const [existing] = await pool.query('SELECT profile_picture FROM users WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profilePicture = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : existing[0].profile_picture;

    await pool.query(
      `UPDATE users SET
        name = ?, phone = ?, father_name = ?, mother_name = ?,
        home_district = ?, address = ?, department = ?, room_no = ?, block = ?,
        profile_picture = ?
       WHERE id = ?`,
      [name, phone || null, father_name || null, mother_name || null,
       home_district || null, address || null, department || null,
       room_no || null, block || null, profilePicture, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};