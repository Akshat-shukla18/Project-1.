const mongoose = require('mongoose');

const ExcelRowSchema = new mongoose.Schema({}, { strict: false }); // Accept any shape

module.exports = mongoose.model('ExcelData', ExcelRowSchema);
