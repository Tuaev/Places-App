const fs = require('fs');
const mongoose = require('mongoose');

const User = require('../models/user');
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
  let userWithPlaces;

  try {
    // 9.17 video
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not find places for the provided user id.', 500)
    );
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id.', 404));
  }

  res.json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
};

exports.createPlace = async (req, res, next) => {
  try {
    validationCheck(req, 'Invalid inputs passed, please check your data.');
  } catch (error) {
    return next(error);
  }

  const { title, description, address } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    image: req.file.path,
    location: coordinates,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError('Could not find a user for provided id', 404));
  }

  if (!user) {
    return next(new HttpError('Could not find a user for provided id', 404));
  }

  try {
    // video 9.15
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
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

  const { title, description, address } = req.body;
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId);
    if (!place) {
      throw new Error('Place not found');
    }
  } catch (error) {
    return next(new HttpError('Something went wrong, place does not exist.', 500));
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError('You are not authorized to edit this place', 403));
  }

  place.title = title;
  place.description = description;
  place.address = address;

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
    place = await Place.findById(placeId).populate('creator');
    if (!place) {
      throw new Error('Place not found');
    }
  } catch (error) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError('You are not authorized to delete this place', 403));
  }
  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await place.remove({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted place.' });
};
