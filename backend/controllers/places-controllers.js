const { v4: uuid } = require('uuid');

const Place = require('../models/place');
const { validationCheck } = require('../middleware/validation-middleware');
const { getCoordsForAddress } = require('../utils/location');
const HttpError = require('../models/http-errors');

let DUMMY_PLACES = [
  // {
  //   id: 'p1',
  //   title: 'Empire State Building',
  //   description: 'One of the most famous sky scrapers in the world',
  //   location: {
  //     lat: '40.7485644',
  //     lng: '-73.9867614',
  //   },
  //   address: '20 W 34th St, New York, NY 10001, United States',
  //   creator: 'u1',
  // },
  // {
  //   id: 'p2',
  //   title: 'Empire State Building',
  //   description: 'One of the most famous sky scrapers in the world',
  //   location: {
  //     lat: '40.7485644',
  //     lng: '-73.9867614',
  //   },
  //   address: '20 W 34th St, New York, NY 10001, United States',
  //   creator: 'u1',
  // },
];

exports.getPlaceById = async (req, res, next) => {
  const { placeId } = req.params;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a place.', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find a place for the provided id.', 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

exports.getPlacesByUserId = async (req, res, next) => {
  const { userId } = req.params;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not find places for the provided user id.', 500)
    );
  }

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id.', 404));
  }
  res.json({ places: places.map((place) => place.toObject({ getters: true })) });
};

exports.createPlace = async (req, res, next) => {
  try {
    validationCheck(req, 'Invalid inputs passed, please check your data.');
  } catch (error) {
    return next(error);
  }

  const { title, description, address, creator, image } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    image: 'https://cdn.stocksnap.io/img-thumbs/960w/New%20York-city_4DA1218986.jpg',
    address,
    location: coordinates,
    creator,
  });

  try {
    await createdPlace.save();
  } catch (error) {
    return next(new HttpError('Creating a place failed, please try again', 500));
  }

  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = (req, res, next) => {
  validationCheck(req, 'Invalid update inputs passed, please check your data.');

  const { title, description } = req.body;
  const placeId = req.params.placeId;

  const updatedPlace = { ...DUMMY_PLACES.find((place) => place.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;
  if (!DUMMY_PLACES.find((place) => place.id === placeId)) {
    throw new HttpError('Could not find a place with that id');
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);

  res.status(200).json({ message: 'Deleted place.' });
};
