// ================= STUDENT MANAGEMENT =================

// 📌 GET all students (role বাদ)
router.get('/students', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, student_id, phone, father_name, mother_name, 
              home_district, address, department, room_no, block, 
              profile_picture, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 GET single student
router.get('/students/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, name, email, student_id, phone, father_name, mother_name, 
              home_district, address, department, room_no, block, 
              profile_picture, created_at 
       FROM users 
       WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 CREATE new student
router.post('/students', verifyToken, isAdmin, async (req, res) => {
  try {
    const { 
      name, email, password, student_id, phone, father_name, mother_name,
      home_district, address, department, room_no, block 
    } = req.body;

    // Check if email exists
    const [existing] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users 
       (name, email, password, student_id, phone, father_name, mother_name,
        home_district, address, department, room_no, block) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, student_id, phone, father_name, mother_name,
       home_district, address, department, room_no, block]
    );

    res.status(201).json({ 
      message: 'Student registered successfully',
      id: result.insertId 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 UPDATE student
router.put('/students/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, email, student_id, phone, father_name, mother_name,
      home_district, address, department, room_no, block 
    } = req.body;

    await pool.query(
      `UPDATE users SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        student_id = COALESCE(?, student_id),
        phone = COALESCE(?, phone),
        father_name = COALESCE(?, father_name),
        mother_name = COALESCE(?, mother_name),
        home_district = COALESCE(?, home_district),
        address = COALESCE(?, address),
        department = COALESCE(?, department),
        room_no = COALESCE(?, room_no),
        block = COALESCE(?, block)
       WHERE id = ?`,
      [name, email, student_id, phone, father_name, mother_name,
       home_district, address, department, room_no, block, id]
    );

    res.json({ message: 'Student updated successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 DELETE student
router.delete('/students/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if student exists
    const [existing] = await pool.query(
      `SELECT id FROM users WHERE id = ?`,
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await pool.query(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    res.json({ message: 'Student deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});