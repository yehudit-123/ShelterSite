process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config({
    path: "../.env"
});
// console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

const fs = require("fs");
const axios = require("axios");

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// קריאת הקובץ עם הכתובות
const addresses = fs
  .readFileSync("./addresses.txt", "utf8")
  .split("\n")
  .map(line => line.trim())
  .filter(line => line.length > 0);

async function getCoordinates(address) {
  try {

    // מוסיף אוטומטית את העיר
    const fullAddress = `${address}, Tel-Aviv, Israel`;

    const url =
      "https://maps.googleapis.com/maps/api/geocode/json";

    const response = await axios.get(url, {
      params: {
        address: fullAddress,
        key: API_KEY
      }
    });

    if (response.data.status !== "OK") {

    console.log("ADDRESS:", fullAddress);
    console.log("STATUS:", response.data.status);

    if (response.data.error_message) {
        console.log("ERROR:", response.data.error_message);
    }

    return null;
}

    const location =
      response.data.results[0].geometry.location;

    return {
      address: fullAddress,
      latitude: location.lat,
      longitude: location.lng
    };

  } catch (err) {
    console.log(err.message);
    return null;
  }
}

async function run() {

  const results = [];

  for (const address of addresses) {

    const result =
      await getCoordinates(address);

    if (result) {
      results.push(result);

      console.log(result);
    }

    // לא להציף את גוגל בבקשות
    await new Promise(resolve =>
      setTimeout(resolve, 200)
    );
  }

  fs.writeFileSync(
    "./TelAvivsheltersCoordinates.json",
    JSON.stringify(results, null, 2)
  );

  console.log("Finished");
}

run();