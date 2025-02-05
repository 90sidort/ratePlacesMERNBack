const axios = require("axios");

const getLatLong = async (address) => {
  const url = `http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.GEOCODE_API}&location=${address}`;
  const res = await axios.get(url);
  const results = await res.data.results[0].locations[0].displayLatLng;
  if (results.lng === -100.445882 && results.lat === 39.78373) {
    return "Error";
  } else {
    return results;
  }
};

module.exports = { getLatLong };
