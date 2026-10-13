const conDB = require("../dataBase/ConnectToDB");

// קבלת הודעות נכנסות למנהל (רק ממשתמשים)
async function getAllMessages() {
    const [rows] = await conDB.promise().query(`
        SELECT *
        FROM Messages
        WHERE recipientUserId IS NULL
        ORDER BY createdAt DESC
    `);
    return rows;
}

// הוספת הודעה מהמשתמש למנהל
async function addMessage(senderUserId, senderName, senderEmail, subject, messageText) {
    const [result] = await conDB.promise().query(
        `INSERT INTO Messages (senderUserId, senderName, senderEmail, subject, messageText)
         VALUES (?, ?, ?, ?, ?)`,
        [senderUserId, senderName, senderEmail, subject, messageText]
    );
    return result.insertId;
}

// תגובת מנהל להודעה נכנסת
async function addReply(messageId, replyText) {
    const [result] = await conDB.promise().query(
        `UPDATE Messages
         SET adminResponse = ?, status = 'answered'
         WHERE messageId = ?`,
        [replyText, messageId]
    );
    return result.affectedRows > 0;
}

// שליחת הודעה מהמנהל למשתמש
async function addAdminMessage(recipientUserId, subject, messageText) {
    const [result] = await conDB.promise().query(
        `INSERT INTO Messages (recipientUserId, senderName, senderEmail, subject, messageText)
         VALUES (?, 'מנהל', 'admin@system', ?, ?)`,
        [recipientUserId, subject, messageText]
    );
    return result.insertId;
}

// הודעות שהמנהל שלח (עם שם המשתמש)
async function getAdminSentMessages() {
    const [rows] = await conDB.promise().query(`
        SELECT m.*, u.userName AS recipientName
        FROM Messages m
        LEFT JOIN users u ON m.recipientUserId = u.userId
        WHERE m.recipientUserId IS NOT NULL
        ORDER BY m.createdAt DESC
    `);
    return rows;
}

// כל ההודעות של משתמש — מה ששלח ומה שקיבל
async function getMessagesByUserId(userId) {
    const [rows] = await conDB.promise().query(
        `SELECT *
         FROM Messages
         WHERE senderUserId = ? OR recipientUserId = ?
         ORDER BY createdAt DESC`,
        [userId, userId]
    );
    return rows;
}

module.exports = {
    getAllMessages,
    addMessage,
    addReply,
    addAdminMessage,
    getAdminSentMessages,
    getMessagesByUserId
};