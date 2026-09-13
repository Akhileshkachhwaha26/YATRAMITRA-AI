const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yatramitra';
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    console.error('Make sure MongoDB is running locally, or set MONGO_URI to a valid connection string (e.g. MongoDB Atlas).');
    process.exit(1);
  }
};

module.exports = connectDB;
