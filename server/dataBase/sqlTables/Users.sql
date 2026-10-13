CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL,
   -- מה ההרשאות, ברירת מחדל- משתמש רגיל
    userRole VARCHAR(10) DEFAULT 'user'
);