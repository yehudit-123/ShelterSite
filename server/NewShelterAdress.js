const axios = require("axios");

async function getCoordinates(address) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
            params: {
                address,
                key: apiKey
            }
        }
    );

    if (response.data.results.length === 0) {
        return null;
    }

    const location =
        response.data.results[0].geometry.location;

    return {
        latitude: location.lat,
        longitude: location.lng
    };
}