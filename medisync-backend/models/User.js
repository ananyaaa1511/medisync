const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ["true", "name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['patient', 'doctor'],
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);