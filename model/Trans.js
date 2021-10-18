const mongoose = require('mongoose');

const TransSchema = mongoose.Schema({
    userId: {
        type: String,
        default: null
    },
    payout: {
        type: String,
        default: null
    },
    allPayout: {
        type: String,
        default: null
    },
    data: {
        type: Date,
        default: Date.now()
    },
});

const Trans = mongoose.model('Transaction', TransSchema);
module.exports = Trans;