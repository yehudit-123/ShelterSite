CREATE TABLE shelters (
    -- מזהה ייחודי למקלט
    shelterId INT AUTO_INCREMENT PRIMARY KEY,
    -- שם קצר או כינוי למקלט
    shelterName VARCHAR(100) DEFAULT 'shelter',
    -- כתובת
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    -- סוג מקלט- מיגונית או קהילתי
    type VARCHAR(30) NOT NULL,
    -- במקרה של מבנה קהילתי נרצה מספר מזהה ייחודי של היוצר
    createdByUserId INT NULL,
    -- מצב המיגונית- בהוספת מבנה קהילתי חדש, ברירת מחדל מחכה לאישור
    status VARCHAR(20) DEFAULT 'pending',
    -- כמות לייקים, לחיסכון בחישובים מיותרים
    likesCount INT DEFAULT 0,
    -- תאריך יצירת המבנה הקהילתי
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (createdByUserId) REFERENCES users(userId) ON DELETE SET NULL
);