const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const db = await mongoose.connect('mongodb://127.0.0.1/Kodagu_Task');
    console.log(`connected to mongoDB ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Error ${error}`);
  }
};
module.exports = connectDB();