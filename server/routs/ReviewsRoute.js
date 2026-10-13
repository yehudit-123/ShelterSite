const express = require("express");
const router = express.Router();
const reviewsService = require("../services/ReviewsServices");

// קבלת כל חוות הדעת של מיגונית מסוימת
router.get("/shelter/:shelterId", async (req, res) => {
    try {
        const { shelterId } = req.params;
        const reviews = await reviewsService.getReviewsByShelter(shelterId);
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "שגיאת שרת בקבלת חוות דעת" });
    }
});

// הוספת חוות דעת חדשה למיגונית
router.post("/", async (req, res) => {
    try {
        const { userId, shelterId, content } = req.body;
        
        // בדיקת תקינות קלט בסיסית
        if (!userId || !shelterId || !content) {
            return res.status(400).json({ success: false, message: "נא לשלוח את כל השדות החשובים" });
        }

        const result = await reviewsService.addReview(userId, shelterId, content);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "שגיאת שרת בהוספת חוות דעת" });
    }
});

module.exports = router;