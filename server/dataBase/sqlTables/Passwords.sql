CREATE TABLE passwords (
    -- מזהה ייחודית למשתמש
    userId INT PRIMARY KEY,
    -- סיסמא
    passwordHash VARCHAR(255) NOT NULL,

    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);