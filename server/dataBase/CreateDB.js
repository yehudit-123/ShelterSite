const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });var mysql = require("mysql2");
function createDB() {

    var connection = mysql.createConnection({
      
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });
    connection.query(`CREATE DATABASE shelters`, function (err, result) {
        if (err) throw err;
        console.log(`shelters DB created`);
        connection.end();
      });
  }
  createDB();
  module.exports = createDB;