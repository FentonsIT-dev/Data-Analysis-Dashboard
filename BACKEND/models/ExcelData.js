const mongoose = require('mongoose');

const ExcelDataSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  sheetName: { type: String, required: true },
  data: { type: Array, required: true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExcelData', ExcelDataSchema);