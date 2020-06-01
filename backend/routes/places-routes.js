const { Router } = require('express');

const fileUpload = require('../middleware/file-upload');
const { checkPlace } = require('../middleware/validation-middleware');
const placesController = require('../controllers/places-controllers');
const router = Router();

router.post('/', fileUpload.single('image'), checkPlace, placesController.createPlace);

router.get('/:placeId', placesController.getPlaceById);
router.patch('/:placeId', checkPlace, placesController.updatePlace);
router.delete('/:placeId', placesController.deletePlace);

router.get('/user/:userId', placesController.getPlacesByUserId);

module.exports = router;
