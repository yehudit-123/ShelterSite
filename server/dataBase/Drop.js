var mysql = require("mysql2");
var path = require("path");
const conDB = require("./ConnectToDB");

function cleanDB() {
  conDB.query(
    "DROP DATABASE IF EXISTS shelters",
    function (err, result) {
      if (err) throw err;
      console.log("Database dropped");
    }
  );
}

cleanDB();
module.exports = cleanDB;
