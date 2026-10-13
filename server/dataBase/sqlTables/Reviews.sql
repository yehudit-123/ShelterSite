CREATE TABLE reviews (
    -- סימון חוות דעת כמזהה ייחודי
    reviewId INT AUTO_INCREMENT PRIMARY KEY,
    -- מי כתב את החוות דעת- מזהה
    userId INT NOT NULL,
    -- מזהה ייחודי של המבנה
    shelterId INT NOT NULL,
    -- תוכן- כמה מילים כחחות דעת
    content TEXT NOT NULL,
    -- תאריך יצירת חוות הדעת
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (shelterId) REFERENCES shelters(shelterId) ON DELETE CASCADE

);