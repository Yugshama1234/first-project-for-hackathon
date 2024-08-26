// server/models/clubModel.js
const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    clubName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notifications: [{ type: String }] // Array of strings for notifications
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
