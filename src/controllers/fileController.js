const path = require('path');
const fs = require('fs');
const File = require('../models/File');

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  const fileDoc = await File.create({
    originalName: req.file.originalname,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    url: fileUrl,
  });

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully.',
    data: {
      id: fileDoc._id,
      originalName: fileDoc.originalName,
      filename: fileDoc.filename,
      mimetype: fileDoc.mimetype,
      size: fileDoc.size,
      url: fileDoc.url,
      uploadedAt: fileDoc.createdAt,
    },
  });
};

const getAllFiles = async (_req, res) => {
  const files = await File.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    count: files.length,
    data: files.map((f) => ({
      id: f._id,
      originalName: f.originalName,
      filename: f.filename,
      mimetype: f.mimetype,
      size: f.size,
      url: f.url,
      uploadedAt: f.createdAt,
    })),
  });
};

const getFileById = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return res.status(404).json({ success: false, message: 'File not found.' });
  }
  res.json({
    success: true,
    data: {
      id: file._id,
      originalName: file.originalName,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: file.url,
      uploadedAt: file.createdAt,
    },
  });
};

const deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return res.status(404).json({ success: false, message: 'File not found.' });
  }

  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  await file.deleteOne();
  res.json({ success: true, message: 'File deleted successfully.' });
};

const serveFile = (req, res) => {
  const filePath = path.join(__dirname, '../../uploads', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found.' });
  }
  res.sendFile(filePath);
};

module.exports = { uploadFile, getAllFiles, getFileById, deleteFile, serveFile };
