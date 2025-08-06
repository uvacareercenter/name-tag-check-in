require('dotenv').config();

import https from 'https';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(bodyParser.json());
app.use(helmet());

import initRoutes from './server/routes';

import { version } from './package.json';
console.log(`Name Tag Check-In v${version}`);

// Ensuring logs folder exists before proceeding
fs.stat(path.join(__dirname, 'logs')).catch(() => {
  console.log('Logs folder does not exist, creating');
  fs.mkdir(path.join(__dirname, 'logs')).catch((e) => {
    throw new Error('Error creating logs folder: ' + e.message);
  });
});

(async () => {
  await require('./server/db').init();
  initRoutes(app);

  // Redirecting HTTP requests to HTTPS Express server
  http
    .createServer((req, res) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    })
    .listen(80);

  const port = process.env.PORT || 443;
  https
    .createServer(
      {
        key: await fs.readFile(process.env.HTTPS_KEY_FILE),
        cert: await fs.readFile(process.env.HTTPS_CERT_FILE),
        // only set if present (not used in development)
        ca: process.env.HTTPS_CA_FILE
          ? await fs.readFile(process.env.HTTPS_CA_FILE)
          : undefined,
      },
      app
    )
    .listen(port, () => console.log(`Server listening on port ${port}`));
})().catch(console.error);
