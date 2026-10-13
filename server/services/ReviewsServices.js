const conDB = require("../dataBase/ConnectToDB");

// שליפת כל חוות הדעת עבור מיגונית ספציפית, ממוין מהחדש לישן
async function getReviewsByShelter(shelterId) {
    const [rows] = await conDB.promise().query(
        "SELECT reviewId, userId, shelterId, content, createdAt FROM reviews WHERE shelterId = ? ORDER BY createdAt DESC",
        [shelterId]
    );
    return rows;
}

// הוספת חוות דעת חדשה לטבלה
async function addReview(userId, shelterId, content) {
    const [result] = await conDB.promise().query(
        "INSERT INTO reviews (userId, shelterId, content) VALUES (?, ?, ?)",
        [userId, shelterId, content]
    );
    if (result.affectedRows > 0) {
        return { success: true, insertId: result.insertId };
    }
    
    return { success: false, message: "לא ניתן היה לשמור את חוות הדעת" };
}
module.exports = { getReviewsByShelter, addReview };