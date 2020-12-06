const axios = require("axios");
const { Open_Geocoding_API } = require("../config");

const getLatLong = async (addres) => {
  const res = await axios.get(
    `http://open.mapquestapi.com/geocoding/v1/address?key=${Open_Geocoding_API}&location=${addres}`
  );
  const results = await res.data.results[0].locations[0].displayLatLng;
  if (results.lng === -100.445882 && results.lat === 39.78373) {
    return "Error";
  } else {
    return results;
  }
};

module.exports = { getLatLong };
