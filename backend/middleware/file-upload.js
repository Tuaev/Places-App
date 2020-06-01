const multer = require('multer');
const { v1: uuid } = require('uuid');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};
var fileUpload = multer({
  limits: 500000, // 500kb
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + '.' + ext);
    },
  }),
  fileFilter: '',
});

module.exports = fileUpload;
