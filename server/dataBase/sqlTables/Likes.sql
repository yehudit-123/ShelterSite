CREATE TABLE likes (
    -- מזהה ייחודי של חוות הדעת
    LikeId INT AUTO_INCREMENT PRIMARY KEY,
    -- מזהה ייחודי ליוצר חוות הדעת למניעת כפולים
    userId INT NOT NULL,
    -- סוג מקום בטוח מיגונית או קהילתי
    shelterId INT NOT NULL,

    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);