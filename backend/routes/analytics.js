const express = require('express');
const router = express.Router();

// @route   GET api/analytics
// @desc    Get global impact stats
// @access  Public
router.get('/', (req, res) => {
    try {
        const totalUsers = global.users.length;
        
        // Count total foods Claimed (saved)
        const totalSaved = global.foods.filter(f => f.status === 'claimed').length;
        
        // Count active listings
        const now = new Date();
        const activeListings = global.foods.filter(f => f.status === 'available' && new Date(f.expiry_time) > now).length;

        // Calculate total points across platform
        const platformPoints = global.users.reduce((acc, crr) => acc + (crr.points || 0), 0);
        const totalPlatformDonations = global.users.reduce((acc, crr) => acc + (crr.totalDonations || 0), 0);

        res.json({
            totalUsers,
            totalSaved,
            activeListings,
            platformPoints,
            totalPlatformDonations
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
