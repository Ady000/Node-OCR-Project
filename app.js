const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.static('public'));

app.post('/upload', upload.single('image'), (req, res) => {
  const imgPath = path.join(__dirname, 'uploads', req.file.filename);

  // Perform OCR using Tesseract.js
  Tesseract.recognize(imgPath, 'eng', {
    logger: m => console.log(m)
  })
  .then(({ data: { text } }) => {
    // Send the extracted text back to the client
    res.send(`<h1>Extracted Text</h1><pre>${text}</pre>`);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Error processing image');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
