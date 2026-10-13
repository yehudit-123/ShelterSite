const express = require("express");
const router = express.Router();
const messagesService = require("../services/MessagesService");

// קבלת כל ההודעות הנכנסות (למנהל)
router.get("/admin", async (req, res) => {
    const messages = await messagesService.getAllMessages();
    res.json(messages);
});

// הודעות שהמנהל שלח למשתמשים
router.get("/admin/sent", async (req, res) => {
    const messages = await messagesService.getAdminSentMessages();
    res.json(messages);
});

// כל ההודעות של משתמש לפי ID
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const messages = await messagesService.getMessagesByUserId(userId);
    res.json(messages);
});

// שליחת הודעה מהמשתמש למנהל
router.post("/", async (req, res) => {
    const { senderUserId, senderName, senderEmail, subject, messageText } = req.body;

    if (!senderName?.trim() || !senderEmail?.trim() || !subject?.trim() || !messageText?.trim()) {
        return res.status(400).json({ success: false, message: "חובה למלא את כל השדות" });
    }

    const messageId = await messagesService.addMessage(
        senderUserId || null, senderName, senderEmail, subject, messageText
    );

    res.json({ success: true, messageId });
});

// שליחת הודעה מהמנהל למשתמש
router.post("/to-user", async (req, res) => {
    const { recipientUserId, subject, messageText } = req.body;

    if (!recipientUserId || !subject?.trim() || !messageText?.trim()) {
        return res.status(400).json({ success: false, message: "חובה למלא את כל השדות" });
    }

    const messageId = await messagesService.addAdminMessage(recipientUserId, subject, messageText);
    res.json({ success: true, messageId });
});

// תגובת מנהל להודעה נכנסת
router.put("/:messageId/reply", async (req, res) => {
    const { messageId } = req.params;
    const { replyText } = req.body;

    if (!replyText?.trim()) {
        return res.status(400).json({ success: false, message: "חובה להזין תוכן לתגובה" });
    }

    const updated = await messagesService.addReply(messageId, replyText);

    if (!updated) {
        return res.status(404).json({ success: false, message: "ההודעה לא נמצאה" });
    }

    res.json({ success: true });
});

module.exports = router;