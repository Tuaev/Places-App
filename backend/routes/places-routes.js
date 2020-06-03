const express = require('express');

const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const { checkPlace } = require('../middleware/validation-middleware');
const placesController = require('../controllers/places-controllers');
const router = express.Router();

router.get('/:placeId', placesController.getPlaceById);
router.get('/user/:userId', placesController.getPlacesByUserId);

router.use(checkAuth);
router.post('/', fileUpload.single('image'), checkPlace, placesController.createPlace);
router.patch('/:placeId', checkPlace, placesController.updatePlace);
router.delete('/:placeId', placesController.deletePlace);

module.exports = router;
