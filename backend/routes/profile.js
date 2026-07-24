const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const pool = require('../utils/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ============================================
// 📌 Multer Setup for Profile Picture Upload
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// ============================================
// 📌 GET: Current User Profile
// ============================================
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.query(
      `SELECT id, name, email, student_id, father_name, mother_name, 
              home_district, address, department, degree_level, phone, 
              room_no, block, profile_picture,
              date_of_birth, blood_group, created_at
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// 📌 PUT: Update Profile
// ============================================
router.put('/update', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name, phone, father_name, mother_name, home_district,
      address, department, degree_level, room_no, block,
      date_of_birth, blood_group
    } = req.body;

    await pool.query(
      `UPDATE users SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        father_name = COALESCE(?, father_name),
        mother_name = COALESCE(?, mother_name),
        home_district = COALESCE(?, home_district),
        address = COALESCE(?, address),
        department = COALESCE(?, department),
        degree_level = COALESCE(?, degree_level),
        room_no = COALESCE(?, room_no),
        block = COALESCE(?, block),
        date_of_birth = COALESCE(?, date_of_birth),
        blood_group = COALESCE(?, blood_group)
       WHERE id = ?`,
      [
        name, phone, father_name, mother_name, home_district,
        address, department, degree_level, room_no, block,
        date_of_birth, blood_group,
        userId
      ]
    );

    // Get updated profile
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: rows[0]
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// 📌 POST: Upload Profile Picture
// ============================================
router.post('/upload-picture', verifyToken, upload.single('profile_picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const profilePicture = `/uploads/profiles/${req.file.filename}`;

    // Delete old profile picture if exists
    const [old] = await pool.query(
      `SELECT profile_picture FROM users WHERE id = ?`,
      [userId]
    );

    if (old.length > 0 && old[0].profile_picture) {
      const oldPath = path.join(__dirname, '..', old[0].profile_picture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await pool.query(
      `UPDATE users SET profile_picture = ? WHERE id = ?`,
      [profilePicture, userId]
    );

    res.json({
      message: 'Profile picture uploaded successfully',
      profile_picture: profilePicture
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// 📌 DELETE: Remove Profile Picture
// ============================================
router.delete('/remove-picture', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [old] = await pool.query(
      `SELECT profile_picture FROM users WHERE id = ?`,
      [userId]
    );

    if (old.length > 0 && old[0].profile_picture) {
      const oldPath = path.join(__dirname, '..', old[0].profile_picture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await pool.query(
      `UPDATE users SET profile_picture = NULL WHERE id = ?`,
      [userId]
    );

    res.json({ message: 'Profile picture removed successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;