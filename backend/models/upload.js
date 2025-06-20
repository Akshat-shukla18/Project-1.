const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalFileName: String,
  uploadDate: { type: Date, default: Date.now },
  parsedData: Array, // optional if storing structured data
  summary: String,    // if using AI to generate summaries
  chartConfig: Object // to store chart preferences
});

module.exports = mongoose.model('Upload', uploadSchema);
