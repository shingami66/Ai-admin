const mysql = require('mysql2');

// إنشاء connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // غير هذا حسب إعدادات MySQL عندك
  password: '',        // ضع كلمة المرور هنا
  database: 'ai_db',   // اسم قاعدة البيانات الموجودة
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
