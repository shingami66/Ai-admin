require('dotenv').config();
const mysql = require('mysql2');

// إنشاء connection pool باستخدام متغيرات البيئة
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// استخدام promises بدل callbacks
const promisePool = pool.promise();

// اختبار الاتصال
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ Database connected successfully');
  connection.release();
});

module.exports = promisePool;
