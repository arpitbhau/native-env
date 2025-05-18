// radhe radhe

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create a router instance
const router = express.Router();

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Configure storage with dynamic filename from request parameter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
   
    // Fallback to default naming strategy
    const fileExtension = path.extname(file.originalname);
    const filenameToBeSaved = req.file.filename
    cb(null, `${filenameToBeSaved}${fileExtension}`);
  
  }
});

const upload = multer({ storage: storage });

// Route handler that uses the configured multer upload
router.post("/memUpload", upload.single("vidMem"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    return res.status(200).json({
      success: true,
      message: `${req.file.filename} uploaded successfully`,
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message
    });
  }
});

module.exports = router;
