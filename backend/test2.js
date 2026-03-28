const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/plate2purpose', { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('MongoDB is UP');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB is DOWN', err.message);
    process.exit(1);
  });
