const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Admin login attempt:', email);

    const [admins] = await db.query(
      'SELECT AdminID as id, Username as username, Email as email FROM administrator WHERE Email = ? AND Password = ?',
      [email, password]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const admin = { ...admins[0], role: 'admin' };
    console.log('✅ Admin login successful:', admin.username);

    res.json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('❌ Admin login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    // Total users
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM registereduser');
    
    // Images generated (content type = image)
    const [imageCount] = await db.query(
      "SELECT COUNT(*) as count FROM content WHERE ContentType = 'image'"
    );
    
    // Videos created (content type = video)
    const [videoCount] = await db.query(
      "SELECT COUNT(*) as count FROM content WHERE ContentType = 'video'"
    );
    
    // Total revenue from payments
    const [revenue] = await db.query(
      "SELECT COALESCE(SUM(Amount), 0) as total FROM payment WHERE State = 'Completed'"
    );

    res.json({
      success: true,
      stats: {
        totalUsers: userCount[0].count,
        imagesGenerated: imageCount[0].count,
        videosCreated: videoCount[0].count,
        totalRevenue: parseFloat(revenue[0].total)
      }
    });
  } catch (error) {
    console.error('❌ Stats error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT UserID as id, Username as name, Email as email, "Active" as status, DATE_FORMAT(CURDATE(), "%Y-%m-%d") as joinDate FROM registereduser'
    );
    console.log('👥 Fetched users:', users.length);
    res.json({ success: true, users });
  } catch (error) {
    console.error('❌ Get users error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new user
router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const [result] = await db.query(
      'INSERT INTO registereduser (Username, Email, Password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    res.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error('❌ Add user error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    
    let query = 'UPDATE registereduser SET Username = ?, Email = ?';
    let params = [username, email];
    
    if (password) {
      query += ', Password = ?';
      params.push(password);
    }
    
    query += ' WHERE UserID = ?';
    params.push(id);
    
    await db.query(query, params);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Update user error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1️⃣ حذف الشكاوى أولاً
    await db.query('DELETE FROM complaintssuggestions WHERE UserID = ?', [id]);
    
    // 2️⃣ حذف المحتوى
    await db.query('DELETE FROM content WHERE OwnerID = ?', [id]);
    
    // 3️⃣ حذف الاشتراكات
    await db.query('DELETE FROM subscription WHERE UserID = ?', [id]);
    
    // 4️⃣ حذف المدفوعات (من خلال الاشتراكات)
    await db.query(`
      DELETE p FROM payment p
      JOIN subscription s ON p.SubscriptionID = s.SubscriptionID
      WHERE s.UserID = ?
    `, [id]);
    
    // 5️⃣ أخيراً حذف المستخدم
    await db.query('DELETE FROM registereduser WHERE UserID = ?', [id]);
    
    console.log('✅ User and all related data deleted:', id);
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Delete user error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all content
router.get('/content', async (req, res) => {
  try {
    const [content] = await db.query(
      `SELECT 
        c.ContentID as id, 
        c.Title as title, 
        c.ContentType as type, 
        u.Username as creator, 
        DATE_FORMAT(c.DateCreated, '%Y-%m-%d') as date,
        c.ImageURL,
        c.VideoURL
      FROM content c 
      LEFT JOIN registereduser u ON c.OwnerID = u.UserID
      ORDER BY c.DateCreated DESC`
    );
    console.log('📝 Fetched content with URLs:', content.length);
    res.json({ success: true, content });
  } catch (error) {
    console.error('❌ Get content error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete content
router.delete('/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM content WHERE ContentID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Delete content error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all subscriptions
router.get('/subscriptions', async (req, res) => {
  try {
    const [subscriptions] = await db.query(
      `SELECT s.SubscriptionID as id, u.Username as user, 'AI Plus' as plan,
       s.Status as status, s.StartDate as startDate, s.EndDate as endDate
       FROM subscription s
       LEFT JOIN registereduser u ON s.UserID = u.UserID`
    );
    res.json({ success: true, subscriptions });
  } catch (error) {
    console.error('❌ Get subscriptions error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update subscription status
router.put('/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query('UPDATE subscription SET Status = ? WHERE SubscriptionID = ?', [status, id]);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Update subscription error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete subscription
router.delete('/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM subscription WHERE SubscriptionID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Delete subscription error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT p.PaymentID as id, u.Username as user, p.Amount as amount,
       p.PaymentMethod as method, p.State as status, p.PaymentDate as date
       FROM payment p
       LEFT JOIN subscription s ON p.SubscriptionID = s.SubscriptionID
       LEFT JOIN registereduser u ON s.UserID = u.UserID`
    );
    res.json({ success: true, payments });
  } catch (error) {
    console.error('❌ Get payments error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all complaints and suggestions
router.get('/complaints', async (req, res) => {
  try {
    const [complaints] = await db.query(
      `SELECT c.ComplaintID as id, u.Username as user, c.Description as description,
       'Pending' as status
       FROM complaintssuggestions c
       LEFT JOIN registereduser u ON c.UserID = u.UserID`
    );
    console.log('📝 Fetched complaints:', complaints.length);
    res.json({ success: true, complaints });
  } catch (error) {
    console.error('❌ Get complaints error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete complaint
router.delete('/complaints/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM complaintssuggestions WHERE ComplaintID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Delete complaint error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;