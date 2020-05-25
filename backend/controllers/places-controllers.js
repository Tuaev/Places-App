const { v4: uuid } = require('uuid');
const HttpError = require('../models/http-errors');

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world',
    location: {
      lat: '40.7485644',
      lng: '-73.9867614',
    },
    address: '20 W 34th St, New York, NY 10001, United States',
    creator: 'u1',
  },
];

exports.getPlaceById = (req, res, next) => {
  const { placeId } = req.params;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place });
};

exports.getPlaceByUserId = (req, res, next) => {
  const { userId } = req.params;
  const place = DUMMY_PLACES.find((place) => place.creator === userId);
  if (!place) {
    return next(new HttpError('Could not find a place for the provided user id.', 404));
  }
  res.json({ place });
};

exports.createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  console.log('Pushed');
  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = (req, res, next) => {
  console.log('update hit');
  const { title, description } = req.body;
  const { placeId } = req.params;

  const updatedPlace = { ...DUMMY_PLACES.find((place) => place.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {};
