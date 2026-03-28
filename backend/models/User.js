const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['donor', 'receiver', 'ngo', 'volunteer', 'admin'],
        default: 'receiver'
    },
    rating: {
        type: Number,
        default: 0
    },
    totalDonations: {
        type: Number,
        default: 0
    },
    points: {
        type: Number,
        default: 0
    },
    badges: [{ 
        type: String 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
