const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recordsRoute = require('./routes/records');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/records', recordsRoute);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/signatureSheet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'));

app.listen(5000, () => console.log('Server running on port 5000'));
