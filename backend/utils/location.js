const axios = require('axios');
const HttpError = require('../models/http-errors');

exports.getCoordsForAddress = async (address) => {
  // return {
  //   lat: '40.7485644',
  //   lng: '-73.9867614',
  // };

  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_API}`
  );

  const data = response.data.features;
  if (!data || data.length < 1) {
    throw new HttpError('Could not find a location for the specified address', 422);
  }
  const coordinates = {
    lat: data[0].center[0],
    lng: data[0].center[1],
  };
  return coordinates;
};
