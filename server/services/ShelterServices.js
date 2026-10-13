const conDB = require("../dataBase/ConnectToDB");

async function getAllShelters() {
    const [rows] = await conDB.promise().query(
        "SELECT * FROM Shelters"
    );

    return rows;
}
async function getApprovedShelters() {
    const [rows] = await conDB.promise().query(
        "SELECT * FROM shelters WHERE status = ?",
        ["approved"]
    );

    return rows;
}

// כל המיגוניות הממתינות לאישור
async function getPendingShelters() {
    const [rows] = await conDB.promise().query(
        "SELECT * FROM shelters WHERE status = ?",
        ["pending"]
    );

    return rows;
}
async function getSheltersByUserId(userId) {
    const [rows] = await conDB.promise().query(
        "SELECT * FROM shelters WHERE createdByUserId = ?",
        [userId]
    );

    return rows;
}
async function addShelter(data) {

    const query = `
    INSERT INTO shelters
    (
        shelterName,
        address,
        latitude,
        longitude,
        type,
        createdByUserId,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.shelterName,
        data.address,
        data.latitude,
        data.longitude,
        data.type,
        data.createdByUserId,
        data.status
    ];

    return await conDB.promise().query(query, values);
}
async function approveShelter(id) {
    await conDB.promise().query(
        `
        UPDATE shelters
        SET status = "approved"
        WHERE shelterId = ?
        `,
        [id]
    );
}
async function rejectShelter(id) {
    await conDB.promise().query(
        `
        UPDATE shelters
        SET status = "reject"
        WHERE shelterId = ?
        `,
        [id]
    );
}
async function deleteShelter(shelterId) {
    await conDB.promise().query(
        `
        DELETE FROM shelters
        WHERE shelterId = ?
        `,
        [shelterId]
    );
}
module.exports = {
    getAllShelters,
    approveShelter,
    rejectShelter,
    getSheltersByUserId,
    addShelter,
    deleteShelter,
    getApprovedShelters,
    getPendingShelters
};