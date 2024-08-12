const ash = require('express-async-handler');
const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { format } = require('date-fns');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },

  filename: (req, file, cb) => {
    const eventName = req.body.label;
    const cleanEventName = eventName
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .toLowerCase();
    const filename = `${format(new Date(), 'yyyy-LL-dd')}_${cleanEventName}`;
    cb(null, `${filename}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

const fileUpload = upload.single('csvFile');

(async () => {
  const db = await require('./db').get();
  const csv = await require('./csv');

  router.get(
    '',
    ash((req, res) => {
      const events = db.get('events').value();
      res.json({ data: events });
    })
  );

  router.get('/uploads/:id', ash(async (req, res) => {
    const eventId = req.params.id;
    const event = db.get('events').find({ id: eventId }).value();

    if (!event) {
      return res.status(404).send('Event not found');
    }

    const filePath = event.filePath;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (currentDate >= startDate && currentDate <= endDate) {
      try {
        const data = await csv.get(filePath);

        const logosDir = path.join(__dirname, '../uploads/logos');
        const imageFiles = fs.readdirSync(logosDir).filter(file => {
          return file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.svg');
        });

        const imageUrls = imageFiles.map(file => `api/uploads/logos/${file}`);

        res.json({ data, imageUrls });
      } catch (error) {
        res.status(500).send('Error fetching CSV data');
      }
    } else {
      res.status(403).send('The event has not started or has ended');
    }
  }));


  router.post(
    '',
    fileUpload,
    ash(async (req, res) => {
      const { file, body } = req;

      const collection = db.get('events');
      let eventRef;

      if (body.id) {
        // Attempt to find and update an existing event
        eventRef = collection.getById(body.id);

        if (!eventRef.value())

          throw new Error(`No event found with ID ${body.id}`);
        eventRef = eventRef.assign({
          ...body,
        });
      } else {
        // Creating a new event
        eventRef = collection.insert({
          ...body,
          startDate: new Date(body.startDate).getTime(),
          endDate: new Date(body.endDate).getTime(),
          creationDate: Date.now(),
          filePath: file ? file.path : undefined,
        });
      }

      const event = await eventRef.write();
      res.json({ data: event });
    })
  );

  router.delete(
    '',
    ash(async (req, res) => {
      if (!req.query.id) throw new Error('An event ID is required');

      const deletedEvent = await db
        .get('events')
        .removeById(req.query.id)
        .write();

      res.json({ data: deletedEvent });
    })
  );
})();

module.exports = router;
