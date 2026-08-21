const mongoose = require('mongoose');
const Slot = require('../models/Slot');
const Doctor = require('../models/Doctor');

const createSlot = async (req, res) => {
    console.log("=== CREATE SLOT CALLED ===");
    console.log("req.user:", JSON.stringify(req.user));
    
    if (req.user.role != 'doctor') {
        return res.status(403).json({ message: 'only doctors can create slots' });
    }
    
    // Try finding WITHOUT ObjectId conversion first
    let doctorProfile = await Doctor.findOne({ user: req.user.id });
    console.log("Doctor found with string:", doctorProfile ? "YES" : "NO");
    
    if (!doctorProfile) {
        // Try with ObjectId
        doctorProfile = await Doctor.findOne({ 
            user: new mongoose.Types.ObjectId(req.user.id) 
        });
        console.log("Doctor found with ObjectId:", doctorProfile ? "YES" : "NO");
    }
    
    if (!doctorProfile) {
        return res.status(404).json({ 
            message: 'doctor profile not found, create your profile first' 
        });
    }
    
    const { date, startTime, endTime } = req.body;
    
    const slot = await Slot.create({
        doctor: doctorProfile._id,
        date,
        startTime,
        endTime
    });
    
    res.status(201).json(slot);
};

const getSlotByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.query;
        if (!doctorId) {
            return res.status(400).json({ message: 'doctorId query parameter is required' });
        }
        const slots = await Slot.find({ doctor: doctorId, isBooked: false });
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMySlot = async (req, res) => {
    try {
        let doctorProfile = await Doctor.findOne({ user: req.user.id });
        if (!doctorProfile) {
            doctorProfile = await Doctor.findOne({ 
                user: new mongoose.Types.ObjectId(req.user.id) 
            });
        }
        if (!doctorProfile) {
            return res.status(404).json({ message: 'doctor profile not found' });
        }
        const slots = await Slot.find({ doctor: doctorProfile._id });
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSlot, getSlotByDoctor, getMySlot };