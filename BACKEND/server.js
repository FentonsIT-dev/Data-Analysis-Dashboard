const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const excelToDatabase = require("./utils/excelToDatabase"); // Import the correct function
const excelRoutes = require('./routes/excelRoutes');
const ExcelData = require('./models/ExcelData'); // Import the ExcelData model

dotenv.config(); // Ensure environment variables are loaded

const app = express();
const PORT = process.env.PORT || 8081; // Default port 8081 if not provided

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Enable CORS
app.use(cors());
//test
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

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

// Verify MongoDB connection string
if (!process.env.MONGODB_URL) {
    console.error("Error: MONGODB_URL is not defined in .env");
    process.exit(1);
}

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connection successful!"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Use the Excel routes
app.use('/excel', excelRoutes);

// Endpoint to upload and store Excel data in the database
app.post("/upload-excel", upload.single("excelFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an Excel file" });
        }
        
        const filePath = req.file.path;
        const results = await excelToDatabase(filePath, req.file.originalname); // Use the correct function
        res.status(200).json({ 
            message: "Excel data successfully stored in the database.",
            results
        });
    } catch (error) {
        console.error("Error in Excel upload:", error);
        res.status(500).json({ message: "Error storing Excel data", error: error.message });
    }
});

// Testing endpoint
app.get("/", (req, res) => {
    res.send("API is running successfully!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running on port number ${PORT}`);
});