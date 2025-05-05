const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ExcelData = require('../models/ExcelData');
const excelToDatabase = require('../utils/excelToDatabase');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'excel-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
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
    console.log('All Data:', allData); // Debugging: Log all data
    const rows = allData.flatMap(doc => doc.data); // Combine all rows into a single array
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all rows:', error.message);
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

// Get distinct Job Status and their counts
router.get('/job-status', async (req, res) => {
  try {
    const jobStatusCounts = await ExcelData.aggregate([
      { $unwind: "$data" },
      { $group: { _id: "$data.Job Status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: { $ifNull: ["$_id", "Unknown"] }, count: 1 } } // Handle missing Job Status
    ]);
    console.log('Job Status Counts:', jobStatusCounts); // Debugging: Log aggregated data
    res.json(jobStatusCounts);
  } catch (error) {
    console.error('Error fetching job status:', error.message); // Debugging: Log errors
    res.status(500).json({ message: error.message });
  }
});

// Get the latest job status from the most recent upload
router.get('/latest-job-status', async (req, res) => {
  try {
    const latestData = await ExcelData.findOne({}, { data: 1 })
      .sort({ uploadDate: -1 }) // Sort by uploadDate in descending order
      .exec();

    if (!latestData || !latestData.data) {
      return res.status(404).json({ message: 'No data found' });
    }

    const jobStatusCounts = latestData.data.reduce((acc, row) => {
      const status = row["Job Status"]?.trim() || "Unknown"; // Trim and handle empty/null values
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.keys(jobStatusCounts).map((status) => ({
      status,
      count: jobStatusCounts[status],
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching latest job status:', error.message);
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