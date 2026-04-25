const express = require('express');
const path = require('path');
const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (_req, res) => {
  res.json({
    message: 'File/Image Upload API',
    endpoints: {
      upload: 'POST /api/files/upload  (form-data field: "file")',
      listAll: 'GET /api/files',
      getById: 'GET /api/files/:id',
      delete: 'DELETE /api/files/:id',
      serveByName: 'GET /api/files/serve/:filename',
      staticServe: 'GET /uploads/:filename',
    },
    constraints: {
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      maxSize: '5MB',
    },
  });
});

app.use('/api/files', fileRoutes);

app.use(errorHandler);

module.exports = app;
