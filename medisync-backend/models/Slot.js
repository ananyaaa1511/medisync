const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    date: {
        type: String,
        required: [true, 'Date is required']
    },
    startTime: {
        type: String,
        required: [true, 'start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'end time is required']
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);