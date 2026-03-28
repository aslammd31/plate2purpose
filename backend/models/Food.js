const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    food_name: { type: String, required: true },
    quantity: { type: String, required: true },
    category: { type: String, enum: ['veg', 'non-veg', 'vegan'], required: true },
    image_url: { type: String, default: null },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    address: { type: String, required: true },
    expiry_time: { type: Date, required: true },
    status: { type: String, enum: ['available', 'claimed', 'expired'], default: 'available' },
    donor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    claimed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now }
});

foodSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Food', foodSchema);
