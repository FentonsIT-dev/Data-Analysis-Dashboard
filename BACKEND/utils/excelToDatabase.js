const xlsx = require('xlsx');
const ExcelData = require('../models/ExcelData');

/**
 * Process Excel file and save data to MongoDB
 * @param {string} filePath - Path to the Excel file
 * @param {string} fileName - Original name of the file
 * @returns {Object} - Saved Excel data document
 */
const excelToDatabase = async (filePath, fileName) => {
  try {
    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const results = [];
    
    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      
      // Normalize column names
      const normalizedData = jsonData.map(row => {
        const normalizedRow = {};
        Object.keys(row).forEach(key => {
          const normalizedKey = key.trim(); // Remove extra spaces
          normalizedRow[normalizedKey] = row[key];
        });
        return normalizedRow;
      });
      
      // Create document in database
      const excelData = new ExcelData({
        fileName: fileName,
        sheetName: sheetName,
        data: normalizedData
      });
      
      const savedData = await excelData.save();
      results.push(savedData);
    }
    
    return results;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
};

module.exports = excelToDatabase;