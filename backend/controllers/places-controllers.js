const { v4: uuid } = require('uuid');

const Place = require('../models/place');
const { validationCheck } = require('../middleware/validation-middleware');
const { getCoordsForAddress } = require('../utils/location');
const HttpError = require('../models/http-errors');

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

exports.updatePlace = async (req, res, next) => {
  try {
    validationCheck(req, 'Invalid inputs passed, please check your data.');
  } catch (error) {
    return next(error);
  }

  const { title, description } = req.body;
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not update place.', 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError('Something went wrong, could not save updated place.', 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  try {
    place = await Place.deleteOne({ _id: placeId });
  } catch (error) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  res.status(200).json({ message: 'Deleted place.' });
};
