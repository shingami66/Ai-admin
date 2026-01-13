-- استخدام قاعدة البيانات الموجودة
USE ai_db;

-- إضافة بيانات admin تجريبية إذا لم تكن موجودة
-- يمكنك تعديل Username, Email, Password حسب احتياجك

INSERT INTO administrator (Username, Email, Password) VALUES
('Admin User', 'admin@example.com', 'admin123')
ON DUPLICATE KEY UPDATE Username = Username;

-- إضافة admin إضافي (اختياري)
INSERT INTO administrator (Username, Email, Password) VALUES
('Mozfer Admin', 'mozfer.admin@gmail.com', '123456')
ON DUPLICATE KEY UPDATE Username = Username;

-- عرض جميع المسؤولين
SELECT * FROM administrator;
