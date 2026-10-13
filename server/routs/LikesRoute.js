const express = require("express");
const router = express.Router();
const likesService = require("../services/LikeServices");

// קבלת כל הלייקים של משתמש מסוים
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const likes = await likesService.getLikesByUser(userId);
        res.json(likes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

// הוספת לייק
router.post("/:shelterId/:userId", async (req, res) => {
    try {
        const { shelterId, userId } = req.params;
        const result = await likesService.addLike(userId, shelterId);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

// הסרת לייק
router.delete("/:shelterId/:userId", async (req, res) => {
    try {
        const { shelterId, userId } = req.params;
        const result = await likesService.removeLike(userId, shelterId);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;