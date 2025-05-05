const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ExcelData = require('../models/ExcelData');
const excelToDatabase = require('../utils/excelToDatabase');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, 'excel-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: function(req, file, cb) {
    console.log("File details:", file); // Log file details for debugging
    const filetypes = /xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.mimetype === 'application/vnd.ms-excel';

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Excel files only!'));
    }
  }
});

// Upload and process Excel file
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an Excel file' });
    }

    const results = await excelToDatabase(req.file.path, req.file.originalname);
    res.status(201).json({ 
      message: 'Excel file processed successfully',
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rows from all Excel files
router.get('/all-rows', async (req, res) => {
  try {
    const allData = await ExcelData.find({}, { data: 1, _id: 0 });
    const rows = allData.flatMap(doc => doc.data); // Combine all rows into a single array
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get list of all Excel files
router.get('/', async (req, res) => {
  try {
    const files = await ExcelData.find({}, {
      fileName: 1,
      uploadDate: 1,
      sheetName: 1,
      _id: 1
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific Excel file data by ID
router.get('/:id', async (req, res) => {
  try {
    const excelData = await ExcelData.findById(req.params.id); // Fetch data by ID
    if (!excelData) {
      return res.status(404).json({ message: 'Excel data not found' });
    }
    res.json(excelData); // Return the data
  } catch (error) {
    console.error('Error fetching data by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete an Excel file data
router.delete('/:id', async (req, res) => {
  try {
    const excelData = await ExcelData.findByIdAndDelete(req.params.id);
    if (!excelData) {
      return res.status(404).json({ message: 'Excel data not found' });
    }
    res.json({ message: 'Excel data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;