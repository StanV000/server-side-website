const mongoose = require('mongoose');

// Create a Mongoose schema for a booking
const bookingSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    default: Date.now, 
  },
});

// Create a Mongoose model based on the schema
const Booking = mongoose.model('Booking', bookingSchema);

// Export the model for use in your application
module.exports = Booking;
