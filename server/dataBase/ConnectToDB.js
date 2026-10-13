const path = require("path");
// 1. טעינת קובץ ה-env בצורה נכונה
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// 2. יבוא ספריית ה-mysql רק פעם אחת!
const mysql = require("mysql2");

// 3. יצירת החיבור עם המשתנים מתוך ה-env
const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS, // יהיה ריק וזה מצוין
    database: process.env.DB_NAME || "shelters"
});

// 4. התחברות ובדיקה
connection.connect((err) => {
    if (err) {
        console.log("❌ Connection to DB failed");
        console.log(err.message);
        return;
    }
    console.log("🚀 Connected to shelters DB successfully!");
});

module.exports = connection;