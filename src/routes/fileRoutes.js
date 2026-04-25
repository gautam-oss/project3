const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadFile,
  getAllFiles,
  getFileById,
  deleteFile,
  serveFile,
} = require('../controllers/fileController');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/upload', upload.single('file'), asyncHandler(uploadFile));
router.get('/', asyncHandler(getAllFiles));
router.get('/:id', asyncHandler(getFileById));
router.delete('/:id', asyncHandler(deleteFile));

router.get('/serve/:filename', serveFile);

module.exports = router;
