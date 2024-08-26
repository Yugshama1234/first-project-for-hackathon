// server/apiRoutes.js
const express = require('express');
const router = express.Router();
const Club = require('./models/clubModel');
const User = require('./models/userModel');

// Route to get all clubs
router.get('/clubs', async (req, res) => {
    try {
        const clubs = await Club.find({});
        res.json(clubs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to get club notifications
router.get('/clubs/:clubName/notifications', async (req, res) => {
    try {
        const club = await Club.findOne({ clubName: req.params.clubName });
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json(club.notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route for admin to add a notification
router.post('/clubs/:clubName/notifications', async (req, res) => {
    try {
        const club = await Club.findOne({ clubName: req.params.clubName });
        if (!club) return res.status(404).json({ message: 'Club not found' });

        club.notifications.push(req.body.notification);
        await club.save();
        res.status(201).json(club.notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route for user login and verification
router.post('/users/login', async (req, res) => {
    try {
        const { enrollmentNumber } = req.body;
        const user = await User.findOne({ enrollmentNumber });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User authenticated successfully', clubName: user.clubName });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route for admin login and verification
router.post('/admin/login', async (req, res) => {
    try {
        const { clubName, password } = req.body;
        const club = await Club.findOne({ clubName, password });
        if (!club) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Admin authenticated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
