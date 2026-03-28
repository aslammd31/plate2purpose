const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

function haversineDistance(coords1, coords2) {
    function toRad(x) {
      return x * Math.PI / 180;
    }
    const lon1 = coords1[0];
    const lat1 = coords1[1];
    const lon2 = coords2[0];
    const lat2 = coords2[1];
    const R = 6371; // km
    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // return in meters
}

// @route   POST api/food
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { food_name, quantity, category, address, coordinates, expiry_time } = req.body;
        
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        let parsedCoords = [];
        if (typeof coordinates === 'string') {
            parsedCoords = JSON.parse(coordinates); // [lng, lat]
        } else {
            parsedCoords = coordinates;
        }

        const newFood = {
            _id: Date.now().toString(),
            food_name,
            quantity,
            category,
            address,
            location: {
                type: 'Point',
                coordinates: parsedCoords
            },
            expiry_time: new Date(expiry_time),
            image_url: imageUrl,
            donor_id: req.user.id,
            status: 'available',
            claimed_by: null,
            createdAt: new Date()
        };

        global.foods.push(newFood);

        let userIndex = global.users.findIndex(u => u.id === req.user.id);
        if (userIndex !== -1) {
            global.users[userIndex].totalDonations += 1;
            global.users[userIndex].points += 10;
            if (global.users[userIndex].totalDonations >= 5 && !global.users[userIndex].badges.includes('Hunger Hero')) {
                global.users[userIndex].badges.push('Hunger Hero');
            }
        }

        req.app.get('io').emit('food_posted', { 
            food_name: newFood.food_name, 
            address: newFood.address 
        });

        res.json(newFood);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

function enrichFoodWithDonorState(food) {
    const donor = global.users.find(u => u.id === food.donor_id);
    return {
        ...food,
        donor_id: donor ? { name: donor.name, email: donor.email, badges: donor.badges, address: food.address } : null
    };
}

// @route   GET api/food
router.get('/', async (req, res) => {
    try {
        const { lng, lat, maxDistance = 50000, category } = req.query;
        const now = new Date();

        let results = global.foods.filter(f => f.status === 'available' && new Date(f.expiry_time) > now);

        if (category) {
            results = results.filter(f => f.category === category);
        }

        if (lng && lat) {
            const userCoords = [parseFloat(lng), parseFloat(lat)];
            const distLimit = parseInt(maxDistance);
            results = results.filter(f => {
                const dist = haversineDistance(f.location.coordinates, userCoords);
                return dist <= distLimit;
            });
        }

        // Sort by newest first
        results.sort((a, b) => b.createdAt - a.createdAt);
        
        // Populate donor_id
        results = results.map(enrichFoodWithDonorState);

        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/food/:id/claim
router.patch('/:id/claim', auth, async (req, res) => {
    try {
        const foodIndex = global.foods.findIndex(f => f._id === req.params.id);
        if (foodIndex === -1) return res.status(404).json({ msg: 'Food not found' });
        
        const food = global.foods[foodIndex];
        if (food.status !== 'available') return res.status(400).json({ msg: 'Food already claimed or expired' });
        
        food.status = 'claimed';
        food.claimed_by = req.user.id;
        
        req.app.get('io').emit('food_claimed', { 
            food_id: food._id, 
            food_name: food.food_name, 
            donor_id: food.donor_id 
        });

        res.json(food);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/food/dashboard
router.get('/dashboard', auth, async (req, res) => {
    try {
        let posted = global.foods.filter(f => f.donor_id === req.user.id);
        posted.sort((a, b) => b.createdAt - a.createdAt);
        posted = posted.map(enrichFoodWithDonorState);

        let claimed = global.foods.filter(f => f.claimed_by === req.user.id);
        claimed.sort((a, b) => b.createdAt - a.createdAt);
        claimed = claimed.map(enrichFoodWithDonorState);

        const u = global.users.find(usr => usr.id === req.user.id);
        const userStats = u ? { points: u.points, badges: u.badges, totalDonations: u.totalDonations } : null;

        res.json({ posted, claimed, userStats });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
