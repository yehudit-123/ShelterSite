
const conDB = require("../dataBase/ConnectToDB");

// GET ALL USERS
async function getAllUsers() {

    const [rows] = await conDB.promise().query(
        "SELECT * FROM users"
    );

    return rows;
}

// LOGIN
async function login(userName, passwordHash) {

    const [rows] = await conDB.promise().query(
        `
        SELECT u.*
        FROM users u
        INNER JOIN passwords p
            ON u.userId = p.userId
        WHERE u.userName = ?
        AND p.passwordHash = ?
        LIMIT 1
        `,
        [userName, passwordHash]
    );

    return rows;
}

// GET USER BY ID
async function getUserById(userId) {
    const [rows] = await conDB.promise().query(
        `
        SELECT *
        FROM users
        WHERE userId = ?
        `,
        [userId]
    );

    return rows[0];
}

// ADD USER
async function addUser(userName, email, phone, userRole, passwordHash) {
    const [result] = await conDB.promise().query(
        `
        INSERT INTO users
        (userName, email, phone, userRole)
        VALUES (?, ?, ?, ?)
        `,
        [userName, email, phone, userRole || "user"]
    );
    const userId = result.insertId;
    console.log(`${userId} user id created`);
    await conDB.promise().query(
        `
        INSERT INTO passwords
        (userId, passwordHash)
        VALUES (?, ?)
        `,
        [userId, passwordHash]
    );
    return userId;
}

// UPDATE USER
async function updateUser(userId, userName, email, phone, password, userRole) {
    await conDB.promise().query(
        `
        UPDATE users
        SET
            userName = ?,
            email = ?,
            phone = ?,
            userRole = ?
        WHERE userId = ?
        `,
        [userName, email, phone, userRole, userId]
    );
    if (password) {
        await conDB.promise().query(
            `UPDATE passwords SET passwordHash=? WHERE userId = ?`,
            [password, userId]       // הפרמטר הנכון: password, ובסדר הנכון
        );

    }
}

// DELETE USER
async function deleteUser(userId) {

    await conDB.promise().query(
        `
        DELETE FROM users
        WHERE userId = ?
        `,
        [userId]
    );
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    login
};
