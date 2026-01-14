require('dotenv').config();

// تصدير API Key من متغيرات البيئة
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn('⚠️ Warning: API_KEY not found in environment variables');
}

module.exports = {
  API_KEY
};
