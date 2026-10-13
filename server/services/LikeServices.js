const conDB = require("../dataBase/ConnectToDB");

// כל הלייקים של משתמש מסוים (לבדיקה מי כבר עשה לייק)
async function getLikesByUser(userId) {
    const [rows] = await conDB.promise().query(
        "SELECT shelterId FROM likes WHERE userId = ?",
        [userId]
    );
    return rows;
}

// הוספת לייק - גם רשומה בטבלת likes וגם הגדלת המספר ב-shelters
async function addLike(userId, shelterId) {
    const [existing] = await conDB.promise().query(
        "SELECT LikeId FROM likes WHERE userId = ? AND shelterId = ?",
        [userId, shelterId]
    );

    if (existing.length > 0) {
        // מחיקה מטבלת הלייקים
        await conDB.promise().query(
            "DELETE FROM likes WHERE userId = ? AND shelterId = ?",
            [userId, shelterId]
        );

        // הפחתת המונה ב-1 (תוך שמירה שלא ירד מתחת ל-0)
        await conDB.promise().query(
            "UPDATE shelters SET likesCount = GREATEST(likesCount - 1, 0) WHERE shelterId = ?",
            [shelterId]
        );

        return { success: true, action: "removed", message: "הלייק הוסר בהצלחה" };
    }

    await conDB.promise().query(
        "INSERT INTO likes (userId, shelterId) VALUES (?, ?)",
        [userId, shelterId]
    );

    await conDB.promise().query(
        "UPDATE shelters SET likesCount = likesCount + 1 WHERE shelterId = ?",
        [shelterId]
    );

    return { success: true };
}

// הסרת לייק - מחיקה מטבלת likes והקטנת המספר ב-shelters
async function removeLike(userId, shelterId) {
    const [result] = await conDB.promise().query(
        "DELETE FROM likes WHERE userId = ? AND shelterId = ? ",
        [userId, shelterId]
    );

    if (result.affectedRows > 0) {
        await conDB.promise().query(
            "UPDATE shelters SET likesCount = GREATEST(likesCount - 1, 0) WHERE shelterId = ?",
            [shelterId]
        );
    }

    return { success: true };
}

module.exports = { getLikesByUser, addLike, removeLike };