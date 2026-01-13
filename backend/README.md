# AI Admin Backend Setup

## خطوات التشغيل

### 1. تثبيت MySQL
تأكد من تثبيت MySQL على جهازك

### 2. إعداد قاعدة البيانات

افتح MySQL Workbench أو command line وشغل الملف:
```bash
mysql -u root -p < database/setup.sql
```

أو انسخ محتوى الملف `database/setup.sql` وشغله في MySQL Workbench

### 3. تعديل إعدادات قاعدة البيانات

افتح الملف `config/database.js` وعدل:
- `user`: اسم مستخدم MySQL (عادة `root`)
- `password`: كلمة مرور MySQL الخاصة بك
- `database`: `ai_admin_db`

### 4. تثبيت الـ Dependencies

في مجلد backend، شغل:
```bash
cd backend
npm install
```

### 5. تشغيل السيرفر

```bash
npm start
```

أو للتطوير مع auto-reload:
```bash
npm run dev
```

السيرفر راح يشتغل على: `http://localhost:5000`

## بيانات تسجيل الدخول التجريبية

### Admin 1:
- **Email**: admin@example.com
- **Password**: admin123

### Admin 2:
- **Email**: mozfer524@gmail.com
- **Password**: 123456

## API Endpoints

### Login
```
POST http://localhost:5000/api/admin/login
Body: {
  "email": "admin@example.com",
  "password": "admin123"
}
```

## ملاحظات مهمة

⚠️ **تحذير أمني**: 
- كلمات المرور حالياً مخزنة بشكل نصي (plain text)
- للإنتاج، يجب استخدام `bcrypt` لتشفير كلمات المرور
- يجب إضافة JWT للـ authentication tokens

## إضافة admin جديد يدوياً

```sql
USE ai_admin_db;
INSERT INTO administrator (Username, Email, Password) 
VALUES ('Your Name', 'your.email@example.com', 'your_password');
```
