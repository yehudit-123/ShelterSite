CREATE TABLE Messages (
    messageId INT AUTO_INCREMENT PRIMARY KEY,

    senderUserId INT NULL,

    senderName VARCHAR(100) NOT NULL,
    senderEmail VARCHAR(150) NOT NULL,

    subject VARCHAR(200) NOT NULL,
    messageText TEXT NOT NULL,

    adminResponse TEXT NULL,

    status ENUM('pending', 'answered') DEFAULT 'pending',

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);