process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const axios = require("axios");
const https = require("https");
require("dotenv").config();
const agent = new https.Agent({
  rejectUnauthorized: false
});

async function getCoordinates(address) {
  try {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          httpsAgent: agent,
          address,
          key: API_KEY
        }
      }
    );
    console.log("API KEY:", API_KEY);
    console.log("STATUS:", response.data.status);
    console.log(response.data);
    if (response.data.status !== "OK") {
      console.log("ADDRESS:", address);
      console.log("STATUS:", response.data.status);

      if (response.data.error_message) {
        console.log("ERROR:", response.data.error_message);
      }

      return null;
    }

    const location =
      response.data.results[0].geometry.location;

    return {
      address,
      latitude: location.lat,
      longitude: location.lng
    };

  } catch (err) {
    console.log(err.message);
    return null;
  }
}

module.exports = {
  getCoordinates
};