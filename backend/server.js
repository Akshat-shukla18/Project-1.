const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/excel-analysis', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/upload')); // only once!

// Start server
app.listen(5000, () => console.log('🚀 Server running on port 5000'));
