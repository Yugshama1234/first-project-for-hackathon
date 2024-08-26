// server/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    enrollmentNumber: { type: Number, required: true, unique: true },
    clubName: { type: String, required: true },
    // Add any additional fields if needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
