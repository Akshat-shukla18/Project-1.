const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const ExcelData = require('../models/ExcelData'); // MongoDB model

const router = express.Router();

// In-memory multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /api/upload
 * @desc Upload and parse Excel file, save to DB
 */
router.post('/', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) return res.status(400).json({ message: 'No data found in sheet' });

    // Deduplicate rows
    const uniqueData = Array.from(new Map(sheetData.map(row => [JSON.stringify(row), row])).values());

    // Optional: clear existing data (comment if you want multiple uploads)
    await ExcelData.deleteMany({});

    const inserted = await ExcelData.insertMany(uniqueData);

    console.log('Inserted rows:', inserted.length);
    res.json({ message: 'File uploaded successfully', dataCount: inserted.length });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Failed to process file', error });
  }
});

/**
 * @route GET /api/upload/all
 * @desc Return all uploaded Excel data
 */
router.get('/all', async (req, res) => {
  try {
    const data = await ExcelData.find({});
    res.json(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
});

/**
 * @route DELETE /api/upload/clear
 * @desc Clear all uploaded Excel data
 */
router.delete('/clear', async (req, res) => {
  try {
    await ExcelData.deleteMany({});
    res.json({ message: 'ExcelData collection cleared' });
  } catch (error) {
    console.error('Clear Error:', error);
    res.status(500).json({ message: 'Failed to clear ExcelData', error });
  }
});

module.exports = router;
