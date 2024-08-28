const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;

//Configure multer for handling file uploads: