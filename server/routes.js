const express = require('express');
const path = require('path');

const auth = require('./auth');
const eventsRouter = require('./events');
const submissionRouter = require('./submission');

module.exports = (app) => {
  app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));
  app.use('/api/events', auth, eventsRouter);
  app.use('/api/submission', auth, submissionRouter);

  // Static hosting of built React files
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('api/uploads/event_template.csv', auth, (req, res) => {
    const filePath = path.join(__dirname, '../uploads/event_template.csv');
    res.download(filePath);
  });

  // Catch-all route for serving the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });

  // Error handling for all above routes
  app.use((e, req, res) => {
    console.error(e);
    res
      .status(e.status || 500)
      .json({ error: { message: e.message, stack: e.stack } });
  });
};
